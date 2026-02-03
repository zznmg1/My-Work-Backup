import os
import time
import datetime

apk_path = r"c:\Projects\dream-fortune-ai\frontend\android\app\build\outputs\apk\debug\app-debug.apk"
report_file = "build_verification_report.txt"

def verify_build():
    if not os.path.exists(apk_path):
        return False, "APK file not found."

    mtime = os.path.getmtime(apk_path)
    current_time = time.time()
    diff = current_time - mtime
    
    dt_mtime = datetime.datetime.fromtimestamp(mtime)
    
    # Check if built within last 10 minutes
    if diff < 600:
        return True, f"SUCCESS: APK created at {dt_mtime} ({int(diff)} seconds ago)."
    else:
        return False, f"FAILURE: APK is STALE. Created at {dt_mtime} (Current time: {datetime.datetime.now()})"

success, message = verify_build()

with open(report_file, "w") as f:
    f.write(message)
    
print(message)

if not success:
    exit(1)
