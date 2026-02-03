import os
import time

apk_path = r"c:\Projects\dream-fortune-ai\frontend\android\app\build\outputs\apk\debug\app-debug.apk"

print("Waiting for APK to be created...")
for i in range(120):  # Wait up to 2 minutes
    if os.path.exists(apk_path):
        print(f"APK found! Size: {os.path.getsize(apk_path)} bytes")
        print(f"Time: {time.ctime(os.path.getmtime(apk_path))}")
        exit(0)
    time.sleep(1)

print("Timeout: APK not found after 2 minutes.")
exit(1)
