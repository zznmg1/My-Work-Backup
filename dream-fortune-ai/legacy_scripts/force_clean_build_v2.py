import os
import shutil
import subprocess
import time
import datetime

LOG_FILE = "build_result.txt"

def log(msg):
    print(msg)
    with open(LOG_FILE, "a") as f:
        f.write(msg + "\n")

def force_remove(path):
    if os.path.exists(path):
        log(f"Removing {path}...")
        try:
            shutil.rmtree(path)
            log(f" -> Removed.")
        except Exception as e:
            log(f" -> Error removing {path}: {e}")
            os.system(f'rmdir /s /q "{path}"')
    else:
        log(f"Path not found (already clean): {path}")

def run_step(cmd, cwd=None):
    log(f"\n[Running] {cmd} in {cwd if cwd else '.'}")
    start_t = time.time()
    try:
        # Capture output to log file as well
        result = subprocess.run(cmd, cwd=cwd, shell=True, check=True, capture_output=True, text=True)
        log(f"[Done] took {time.time() - start_t:.1f}s")
        # log(f"Output: {result.stdout[:200]}...") 
    except subprocess.CalledProcessError as e:
        log(f"\n[ERROR] Command failed with return code {e.returncode}")
        log(f"Stderr: {e.stderr}")
        exit(1)

def main():
    # Reset log file
    with open(LOG_FILE, "w") as f:
        f.write(f"=== Force Clean Build V2 Started at {datetime.datetime.now()} ===\n")

    root_dir = os.getcwd()
    frontend_dir = os.path.join(root_dir, "frontend")
    # Corrected Path: android is inside frontend
    android_dir = os.path.join(frontend_dir, "android") 
    
    log(f"Root: {root_dir}")
    log(f"Frontend: {frontend_dir}")
    log(f"Android: {android_dir}")

    # 1. Clean
    log("\n=== 1. Clean Phase ===")
    force_remove(os.path.join(frontend_dir, "dist"))
    force_remove(os.path.join(android_dir, "app", "build"))
    
    # 2. Frontend Build
    log("\n=== 2. Frontend Build Phase ===")
    run_step("npm run build", cwd=frontend_dir)
    
    # 3. Cap Sync
    log("\n=== 3. Capacitor Sync Phase ===")
    # npx cap sync should probably be run in frontend dir based on package.json location
    run_step("npx cap sync", cwd=frontend_dir)
    
    # 4. Gradle Build
    log("\n=== 4. Gradle Build Phase ===")
    run_step("gradlew.bat clean assembleDebug", cwd=android_dir)
    
    log("\n=== Build Success! Checking verify... ===")
    apk_path = os.path.join(android_dir, "app", "build", "outputs", "apk", "debug", "app-debug.apk")
    if os.path.exists(apk_path):
        mtime = os.path.getmtime(apk_path)
        dt = datetime.datetime.fromtimestamp(mtime)
        log(f"APK FOUND: {apk_path}")
        log(f"TIMESTAMP: {dt}")
    else:
        log(f"[ERROR] APK file not found at {apk_path}")

if __name__ == "__main__":
    main()
