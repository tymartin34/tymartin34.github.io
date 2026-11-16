import json, sys, datetime as dt, statistics as st
from collections import defaultdict
import numpy as np
rows = json.load(open(sys.argv[1])); outp = sys.argv[2]
RUN = {'running','track_running','treadmill_running','trail_running','indoor_running'}
BIKE = {'indoor_cycling','road_biking','cycling','virtual_ride','gravel_cycling','mountain_biking'}
SWIM = {'lap_swimming','open_water_swimming','swimming'}
def sport(t): return 'run' if t in RUN else 'bike' if t in BIKE else 'swim' if t in SWIM else 'other'
for r in rows:
    r['d'] = dt.date.fromisoformat(r['startTimeLocal'][:10]); r['sp'] = sport(r['type']); r['h'] = (r['duration'] or 0)/3600
    r['wk'] = r['d'] - dt.timedelta(days=r['d'].weekday())
def rank(a):
    a = np.asarray(a, float); o = a.argsort(); rk = np.empty(len(a)); rk[o] = np.arange(len(a)); return rk
def spear(x, y):
    if len(x) < 5: return float('nan')
    return float(np.corrcoef(rank(x), rank(y))[0,1])
def pace(ms):  # m/s -> min/mi string
    s = 1609.344/ms; return f"{int(s//60)}:{int(s%60):02d}"

# ---- weekly hours by sport
wk = defaultdict(lambda: defaultdict(float))
for r in rows: wk[r['wk']][r['sp']] += r['h']
weeks = []; w = min(wk); 
while w <= max(wk): weeks.append(w); w += dt.timedelta(days=7)
tri = lambda w: sum(wk[w][s] for s in ('run','bike','swim'))
print('weeks', len(weeks), '| avg tri h/wk %.1f' % np.mean([tri(w) for w in weeks]), '| max %.1f' % max(tri(w) for w in weeks))

# ---- steady outdoor runs: efficiency = metres per heartbeat
runs = [r for r in rows if r['type'] in ('running','trail_running') and r['event'] != 'race' and (r['distance'] or 0) >= 5000
        and r['averageHR'] and r['averageSpeed'] and (r['elevationGain'] or 0)/(r['distance']/1000) < 15]
for r in runs: r['ef'] = r['averageSpeed']*60/r['averageHR']
print('steady outdoor runs', len(runs))
# pooled pace~HR slope within month (to express pace at a fixed 150 bpm)
bym = defaultdict(list)
for r in runs: bym[r['d'].strftime('%Y-%m')].append(r)
xs, ys = [], []
for m, rs in bym.items():
    if len(rs) >= 4:
        hr = np.array([r['averageHR'] for r in rs]); sp = np.array([r['averageSpeed'] for r in rs])
        xs += list(hr-hr.mean()); ys += list(sp-sp.mean())
slope = float(np.polyfit(xs, ys, 1)[0])
print('speed slope per bpm (m/s): %.4f' % slope)
for r in runs: r['s150'] = r['averageSpeed'] + slope*(150 - r['averageHR'])
print('month  n  medHR  pace@150  rawPace  ef(m/beat)  medTempC  runH  bikeH  swimH')
monthly = []
allm = sorted({r['d'].strftime('%Y-%m') for r in rows})
for m in allm:
    rs = bym.get(m, [])
    hrs = {s: sum(r['h'] for r in rows if r['sp']==s and r['d'].strftime('%Y-%m')==m) for s in ('run','bike','swim')}
    if rs:
        s150 = st.median(r['s150'] for r in rs); raw = st.median(r['averageSpeed'] for r in rs)
        temps = [((r['minTemperature'] or 0)+(r['maxTemperature'] or 0))/2 for r in rs if r['maxTemperature'] is not None]
        ef = st.median(r['ef'] for r in rs)
        print(m, f"{len(rs):2d}", f"{st.median(r['averageHR'] for r in rs):5.0f}", pace(s150), ' ', pace(raw), f"  {ef:.3f}  {st.median(temps) if temps else float('nan'):5.1f}  {hrs['run']:5.1f} {hrs['bike']:5.1f} {hrs['swim']:5.1f}")
        monthly.append({'month': m, 'n': len(rs), 'pace150_s_per_mi': round(1609.344/s150), 'hr': round(st.median(r['averageHR'] for r in rs)), 'ef': round(ef,3), **{k: round(v,1) for k,v in hrs.items()}})
    else:
        print(m, ' 0', ' '*37, f"{hrs['run']:5.1f} {hrs['bike']:5.1f} {hrs['swim']:5.1f}")

# ---- weekly: efficiency vs trailing volume
wef = defaultdict(list)
for r in runs: wef[r['wk']].append(r['s150'])
def trail(w, n, f): 
    i = weeks.index(w); prev = weeks[max(0,i-n):i]
    return np.mean([f(x) for x in prev]) if len(prev) == n else None
print('\nSpearman: weekly pace@150 speed vs trailing avg weekly hours (higher = more volume, faster)')
for n in (4, 8, 12):
    for label, f in (('tri hours', tri), ('run hours', lambda w: wk[w]['run']), ('bike+swim h', lambda w: wk[w]['bike']+wk[w]['swim'])):
        pts = [(trail(w,n,f), st.median(v)) for w, v in wef.items()]
        pts = [p for p in pts if p[0] is not None]
        print(f"  {n:2d}wk {label:12s} rho={spear([p[0] for p in pts],[p[1] for p in pts]):+.2f} n={len(pts)}")
# same-week temperature confound
tw = [(st.median(((r['minTemperature'] or 0)+(r['maxTemperature'] or 0))/2 for r in runs if r['wk']==w and r['maxTemperature'] is not None), st.median(v)) for w, v in wef.items() if any(r['wk']==w and r['maxTemperature'] is not None for r in runs)]
print('  temp vs pace@150 speed rho=%+.2f n=%d' % (spear([t[0] for t in tw],[t[1] for t in tw]), len(tw)))

# ---- 4-week blocks: intensity split (all HR-zone time) vs next-block change
blocks = [weeks[i:i+4] for i in range(0, len(weeks)-3, 4)]
print('\nblock_start  hrs  %Z1-2  %Z3  %Z4-5  hardH  runH  bike+swimH  pace@150  n')
B = []
for b in blocks:
    rs = [r for r in rows if r['wk'] in b]
    z = [sum((r.get(f'hrTimeInZone_{i}') or 0) for r in rs if r['sp'] in ('run','bike','swim')) for i in range(1,6)]
    zt = sum(z) or 1
    br = [r for r in runs if r['wk'] in b]
    s = st.median(r['s150'] for r in br) if len(br) >= 3 else None
    d = dict(start=b[0], h=sum(tri(w) for w in b), lo=100*(z[0]+z[1])/zt, mid=100*z[2]/zt, hi=100*(z[3]+z[4])/zt, hardh=(z[3]+z[4])/3600,
             run=sum(wk[w]['run'] for w in b), bs=sum(wk[w]['bike']+wk[w]['swim'] for w in b), s=s, n=len(br))
    B.append(d)
    print(d['start'], f"{d['h']:5.1f} {d['lo']:5.0f} {d['mid']:5.0f} {d['hi']:5.0f}  {d['hardh']:5.1f} {d['run']:5.1f} {d['bs']:6.1f}     {pace(s) if s else '  - '}  {d['n']}")
pairs = [(a, b) for a, b in zip(B, B[1:]) if a['s'] and b['s']]
dl = [b['s']-a['s'] for a, b in pairs]
print('\nnext-block change in pace@150 speed vs this block (n=%d):' % len(pairs))
for k, lab in (('lo','% low intensity'),('mid','% zone 3'),('hi','% high intensity'),('hardh','hard hours'),('h','total hours'),('run','run hours'),('bs','bike+swim hours')):
    print(f"  {lab:18s} rho={spear([a[k] for a,_ in pairs], dl):+.2f}")
X = np.array([[a['run'], a['bs'], 1] for a,_ in pairs]); y = np.array(dl)
if len(pairs) >= 6:
    c = np.linalg.lstsq(X, y, rcond=None)[0]
    print('  OLS  d(speed) = %.5f*runH + %.5f*bikeSwimH + %.4f  => 1 run hour ~ %.1f bike/swim hours' % (c[0], c[1], c[2], c[0]/c[1] if c[1] else float('nan')))
# overall intensity split
z = [sum((r.get(f'hrTimeInZone_{i}') or 0) for r in rows if r['sp'] in ('run','bike','swim')) for i in range(1,6)]
print('\noverall time in zones 1-5 (%):', [round(100*v/sum(z)) for v in z])
zr = [sum((r.get(f'hrTimeInZone_{i}') or 0) for r in rows if r['sp']=='run') for i in range(1,6)]
print('runs only (%):', [round(100*v/sum(zr)) for v in zr])

json.dump({'weeks': [{'week': str(w), **{s: round(wk[w][s],2) for s in ('run','bike','swim')}, 'pace150': (round(1609.344/st.median(wef[w])) if w in wef else None)} for w in weeks],
           'monthly': monthly}, open(outp,'w'))
