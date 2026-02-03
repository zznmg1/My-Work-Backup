import os
import time

apk_path = r"c:\Projects\dream-fortune-ai\frontend\android\app\build\outputs\apk\debug\app-debug.apk"

print(f"Target: {apk_path}")

# 1. Attempt Delete
if os.path.exists(apk_path):
    try:
        os.remove(apk_path)
        print("DELETE_ATTEMPTED: File existed and remove() called.")
    except Exception as e:
        print(f"DELETE_FAILED: {e}")
else:
    print("DELETE_NOT_NEEDED: File does not exist.")

# 2. Verify Absence
time.sleep(1)
if os.path.exists(apk_path):
    print("VERIFY_RESULT: FAILURE - File still exists!")
    # Try one more time with system command as backup
    os.system(f'del /F /Q "{apk_path}"')
    if os.path.exists(apk_path):
         print("VERIFY_RESULT: CRITICAL FAILURE - Backup delete also failed.")
    else:
         print("VERIFY_RESULT: SUCCESS (after backup delete)")
else:
    print("VERIFY_RESULT: SUCCESS - File is gone.")
