import json, sys, datetime as dt, statistics as st
from collections import defaultdict
import numpy as np
D = json.load(open(sys.argv[1])); A = json.load(open(sys.argv[2]))
hs = [x for w in D['hrv'] if w for x in (w.get('hrvSummaries') or [])]
print('hrv keys', list(hs[0].keys())[:12], 'n', len(hs))
print('sleepScores keys', list((D['sleep'][-1].get('sleepScores') or {}).keys())[:8])
day = defaultdict(dict)
for h in hs:
    if h.get('lastNightAvg'): day[h['calendarDate']]['hrv'] = h['lastNightAvg']
for s in D['sleep']:
    d = day[s['calendarDate']]
    if s.get('sleepTimeSeconds'): d['sleep'] = s['sleepTimeSeconds']/3600
    sc = (s.get('sleepScores') or {}).get('overall') or {}
    if isinstance(sc, dict) and sc.get('value'): d['score'] = sc['value']
    if s.get('sleepStartTimestampLocal'):
        t = dt.datetime.utcfromtimestamp(s['sleepStartTimestampLocal']/1000); hr = t.hour + t.minute/60
        d['bed'] = hr + 24 if hr < 12 else hr
    d['deep'] = (s.get('deepSleepSeconds') or 0)/3600
def rank(a):
    a = np.asarray(a, float); o = a.argsort(); r = np.empty(len(a)); r[o] = np.arange(len(a)); return r
def sp(x, y): return float(np.corrcoef(rank(x), rank(y))[0,1]) if len(x) > 8 else float('nan')
def med(v): return st.median(v) if v else float('nan')
hv = [d['hrv'] for d in day.values() if 'hrv' in d]; sl = [d['sleep'] for d in day.values() if 'sleep' in d]
print('nights hrv %d median %.0f ms (IQR %.0f-%.0f) | sleep %d median %.2f h, <6.5h on %d%% of nights, >=8h on %d%%' % (len(hv), med(hv), np.percentile(hv,25), np.percentile(hv,75), len(sl), med(sl), 100*np.mean(np.array(sl)<6.5), 100*np.mean(np.array(sl)>=8)))
# load per day
load = defaultdict(lambda: {'h':0,'hard':0})
RUNT = ('running','trail_running')
runs = defaultdict(list)
for a in A:
    d = a['startTimeLocal'][:10]; load[d]['h'] += (a['duration'] or 0)/3600
    load[d]['hard'] += ((a.get('hrTimeInZone_4') or 0)+(a.get('hrTimeInZone_5') or 0))/60
    if a['type'] in RUNT and a['event']!='race' and (a['distance'] or 0)>=5000 and a['averageHR'] and a['averageSpeed']:
        runs[d].append(a['averageSpeed'] + 0.0095*(150-a['averageHR']))
prev = lambda d: str(dt.date.fromisoformat(d)-dt.timedelta(days=1))
# 1 same-night relationships
P = [(d['sleep'], d['hrv']) for d in day.values() if 'sleep' in d and 'hrv' in d]
print('sleep hours vs HRV same night rho=%+.2f n=%d' % (sp([p[0] for p in P],[p[1] for p in P]), len(P)))
P = [(d['bed'], d['hrv']) for d in day.values() if 'bed' in d and 'hrv' in d]
print('bedtime vs HRV rho=%+.2f | median bedtime %.1f' % (sp([p[0] for p in P],[p[1] for p in P]), med([p[0] for p in P])))
early = [h for b,h in P if b < 22.5]; late = [h for b,h in P if b >= 23.5]
print('HRV when asleep before 22:30: %.0f (n=%d) | after 23:30: %.0f (n=%d)' % (med(early), len(early), med(late), len(late)))
for lab, lo, hi in (('<6.5h',0,6.5),('6.5-7.5h',6.5,7.5),('7.5-8.5h',7.5,8.5),('>=8.5h',8.5,99)):
    v = [d['hrv'] for d in day.values() if 'sleep' in d and 'hrv' in d and lo <= d['sleep'] < hi]
    print('  HRV after %s sleep: %.0f (n=%d)' % (lab, med(v), len(v)))
# 2 load -> HRV that night (night belongs to next calendar date)
pts = [(load[prev(k)]['hard'], load[prev(k)]['h'], d['hrv']) for k, d in day.items() if 'hrv' in d]
print('prior-day hard minutes vs HRV rho=%+.2f | prior-day hours vs HRV rho=%+.2f' % (sp([p[0] for p in pts],[p[2] for p in pts]), sp([p[1] for p in pts],[p[2] for p in pts])))
for lab, f in (('rest day', lambda p: p[1]==0), ('easy day (<10 hard min)', lambda p: p[1]>0 and p[0]<10), ('hard day (30+ hard min)', lambda p: p[0]>=30), ('very hard (60+)', lambda p: p[0]>=60)):
    v = [p[2] for p in pts if f(p)]; print('  HRV night after %s: %.0f (n=%d)' % (lab, med(v), len(v)))
# 3 HRV / sleep -> run that day, relative to that month
mon = defaultdict(list)
for d, v in runs.items(): mon[d[:7]] += v
R = []
for d, v in runs.items():
    if d in day and len(mon[d[:7]]) >= 4:
        base = med(mon[d[:7]]); s = med(v)
        R.append((day[d].get('hrv'), day[d].get('sleep'), day[d].get('score'), 1609.344/s - 1609.344/base))  # sec/mi vs month, negative=faster
def cmp(idx, lab, cut_lo, cut_hi):
    lo = [r[3] for r in R if r[idx] is not None and r[idx] < cut_lo]; hi = [r[3] for r in R if r[idx] is not None and r[idx] >= cut_hi]
    x = [(r[idx], r[3]) for r in R if r[idx] is not None]
    print('  %s: low %+.0f s/mi (n=%d) vs high %+.0f s/mi (n=%d) | rho=%+.2f' % (lab, med(lo), len(lo), med(hi), len(hi), sp([a for a,_ in x],[b for _,b in x])))
print('run pace@150 vs month median (negative = faster), n=%d runs' % len(R))
hq = [r[0] for r in R if r[0]]; 
cmp(0, 'HRV (bottom vs top third)', np.percentile(hq,33), np.percentile(hq,67))
cmp(1, 'sleep hours (<6.5 vs >=7.5)', 6.5, 7.5)
cmp(2, 'sleep score (<70 vs >=80)', 70, 80)
# monthly HRV & sleep
print('month hrv sleep trainH')
for m in sorted({k[:7] for k in day}):
    hv = [d['hrv'] for k,d in day.items() if k[:7]==m and 'hrv' in d]; s = [d['sleep'] for k,d in day.items() if k[:7]==m and 'sleep' in d]
    th = sum(v['h'] for k,v in load.items() if k[:7]==m)
    print(m, '%.0f' % med(hv) if hv else '-', '%.1f' % med(s) if s else '-', '%.0f' % th)
