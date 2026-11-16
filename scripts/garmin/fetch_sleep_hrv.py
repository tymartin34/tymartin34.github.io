import json, sys, datetime as dt, time
from garmin_personal_mcp import garmin_client, hrv, sleep
from garmin_personal_mcp.garmin_api import windows
out = sys.argv[1]
start, end = dt.date(2025, 6, 15), dt.date(2026, 11, 15)
H = []
for a, b in windows(start, end, 28):
    r = garmin_client.call(lambda c: hrv.get_hrv_summaries(c, a, b))
    H.append(r); time.sleep(0.3)
Sl = garmin_client.call(lambda c: sleep.get_sleep_summaries(c, start, end))
json.dump({'hrv': H, 'sleep': Sl}, open(out, 'w'))
def shape(x, d=0):
    if isinstance(x, dict): return {k: shape(v, d+1) for k, v in list(x.items())[:40]} if d < 2 else 'dict'
    if isinstance(x, list): return [len(x), shape(x[0], d+1)] if x else []
    return type(x).__name__
print(json.dumps(shape(H[-1]))[:900]); print(json.dumps(shape(Sl))[:1500])
