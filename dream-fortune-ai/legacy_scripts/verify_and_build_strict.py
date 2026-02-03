import os
import time
import datetime
import subprocess
import shutil

# Target File Path
APK_PATH = r"c:\Projects\dream-fortune-ai\frontend\android\app\build\outputs\apk\debug\app-debug.apk"
ANDROID_DIR = r"c:\Projects\dream-fortune-ai\frontend\android"
FRONTEND_DIR = r"c:\Projects\dream-fortune-ai\frontend"

def get_file_info(path):
    if os.path.exists(path):
        mtime = os.path.getmtime(path)
        dt = datetime.datetime.fromtimestamp(mtime)
        size = os.path.getsize(path)
        return f"[EXIST] Time: {dt} | Size: {size} bytes"
    return "[NOT_FOUND] File does not exist"

print("--- STEP 1: FACT CHECK (BEFORE) ---")
print(f"Checking: {APK_PATH}")
print(f"Current Status: {get_file_info(APK_PATH)}")

print("\n--- STEP 2: FORCE DELETE ---")
if os.path.exists(APK_PATH):
    try:
        os.remove(APK_PATH)
        print("->os.remove() executed.")
    except Exception as e:
        print(f"->[ERROR] Delete failed: {e}")
        # Try killing java/adb processes that might lock it
        print("->Attempting to kill java/adb process...")
        os.system("taskkill /f /im java.exe")
        os.system("taskkill /f /im adb.exe")
        time.sleep(2)
        try:
            if os.path.exists(APK_PATH):
                os.remove(APK_PATH)
                print("->Retry verify_strict delete executed.")
        except Exception as e2:
            print(f"->[FATAL] Cannot delete file: {e2}")
            exit(1)

time.sleep(1)
if os.path.exists(APK_PATH):
    print(f"->[FATAL] File STILL exists: {get_file_info(APK_PATH)}")
    print("Cannot proceed with build because old file is persistent.")
    exit(1)
else:
    print("->SUCCESS: File is confirmed deleted.")

print("\n--- STEP 3: EXECUTE BUILD ---")
# Only proceed if deleted
try:
    print("running: gradlew.bat assembleDebug")
    # Redirect stderr to stdout to see errors
    result = subprocess.run("gradlew.bat assembleDebug", cwd=ANDROID_DIR, shell=True, capture_output=True, text=True)
    if result.returncode != 0:
        print("[BUILD ERROR]")
        print(result.stderr)
        # Check standard output too
        print(result.stdout[-500:]) 
        exit(1)
    else:
        print("[BUILD SUCCESS COMMAND FINISHED]")
except Exception as e:
    print(f"[EXECUTION ERROR] {e}")
    exit(1)

print("\n--- STEP 4: FACT CHECK (AFTER) ---")
print(f"Final Status: {get_file_info(APK_PATH)}")
print("Check the timestamp above strictly.")
