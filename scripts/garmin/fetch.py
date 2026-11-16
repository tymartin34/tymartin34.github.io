import json, sys, time
from garmin_personal_mcp import garmin_client, activities
out = sys.argv[1]
keep = ['activityId','startTimeLocal','distance','duration','movingDuration','averageHR','maxHR','averageSpeed',
        'elevationGain','minTemperature','maxTemperature','aerobicTrainingEffect','anaerobicTrainingEffect',
        'hrTimeInZone_1','hrTimeInZone_2','hrTimeInZone_3','hrTimeInZone_4','hrTimeInZone_5','avgPower','normPower']
rows, off = [], 0
while True:
    page = garmin_client.call(lambda c: activities.search_activities(c, activities.ActivitySearch(), limit=100, offset=off))
    if not page: break
    for a in page:
        r = {k: a.get(k) for k in keep}
        r['type'] = (a.get('activityType') or {}).get('typeKey')
        r['event'] = (a.get('eventType') or {}).get('typeKey')
        rows.append(r)
    off += len(page)
    if len(page) < 100: break
    time.sleep(0.4)
json.dump(rows, open(out, 'w'))
ds = sorted(r['startTimeLocal'] for r in rows)
print(len(rows), 'activities', ds[0][:10], 'to', ds[-1][:10])
from collections import Counter
print(Counter(r['type'] for r in rows).most_common(14))
