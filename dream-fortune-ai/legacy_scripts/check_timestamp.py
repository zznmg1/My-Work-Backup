import os
import time
import datetime

apk_path = r"c:\Projects\dream-fortune-ai\frontend\android\app\build\outputs\apk\debug\app-debug.apk"

try:
    mtime = os.path.getmtime(apk_path)
    dt = datetime.datetime.fromtimestamp(mtime)
    with open("timestamp.txt", "w") as f:
        f.write(f"APK Found: {dt}")
except Exception as e:
    with open("timestamp.txt", "w") as f:
        f.write(f"Error: {e}")
