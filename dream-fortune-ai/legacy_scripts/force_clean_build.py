import os
import shutil
import subprocess
import time
import datetime

def force_remove(path):
    if os.path.exists(path):
        print(f"Removing {path}...")
        try:
            shutil.rmtree(path)
            print(f" -> Removed.")
        except Exception as e:
            print(f" -> Error removing {path}: {e}")
            # Try shell command as fallback
            os.system(f'rmdir /s /q "{path}"')
    else:
        print(f"Path not found (already clean): {path}")

def run_step(cmd, cwd=None):
    print(f"\n[Running] {cmd} in {cwd if cwd else '.'}")
    start_t = time.time()
    # shell=True required for bat/cmd files on Windows
    try:
        proc = subprocess.run(cmd, cwd=cwd, shell=True, check=True)
        print(f"[Done] took {time.time() - start_t:.1f}s")
    except subprocess.CalledProcessError as e:
        print(f"\n[ERROR] Command failed with return code {e.returncode}")
        exit(1)

def main():
    print(f"=== Force Clean Build Started at {datetime.datetime.now()} ===")
    
    root_dir = os.getcwd()
    frontend_dir = os.path.join(root_dir, "frontend")
    android_dir = os.path.join(root_dir, "android")
    
    # 1. Clean
    print("\n=== 1. Clean Phase ===")
    force_remove(os.path.join(frontend_dir, "dist"))
    force_remove(os.path.join(android_dir, "app", "build"))
    
    # 2. Frontend Build
    print("\n=== 2. Frontend Build Phase ===")
    run_step("npm run build", cwd=frontend_dir)
    
    # 3. Cap Sync
    print("\n=== 3. Capacitor Sync Phase ===")
    # npx cap sync must be run from root or frontend depending on config, usually root for this mono-repo structure?
    # Based on bat files, it was run from root.
    run_step("npx cap sync", cwd=root_dir)
    
    # 4. Gradle Build
    print("\n=== 4. Gradle Build Phase ===")
    # clean assembleDebug
    run_step("gradlew.bat clean assembleDebug", cwd=android_dir)
    
    print("\n=== Build Success! Checking verify... ===")
    apk_path = os.path.join(android_dir, "app", "build", "outputs", "apk", "debug", "app-debug.apk")
    if os.path.exists(apk_path):
        mtime = os.path.getmtime(apk_path)
        dt = datetime.datetime.fromtimestamp(mtime)
        print(f"APK FOUND: {apk_path}")
        print(f"TIMESTAMP: {dt}")
    else:
        print(f"[ERROR] APK file not found at {apk_path}")

if __name__ == "__main__":
    main()
