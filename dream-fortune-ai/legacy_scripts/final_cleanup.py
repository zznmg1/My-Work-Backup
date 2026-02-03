import os
import shutil

PROJECT_ROOT = r"c:/Projects/dream-fortune-ai"
LEGACY_DIR = os.path.join(PROJECT_ROOT, "legacy_scripts")

# Ensure legacy directory exists
if not os.path.exists(LEGACY_DIR):
    os.makedirs(LEGACY_DIR)

# Files to KEEP (Whitelist)
KEEP_FILES = [
    "build_premium_design.bat",
    "verify_pc_build.bat",
    "start_dream_fortune.bat",
    "final_cleanup.py" # Keep myself running
]

# Extensions to cleanup
EXTENSIONS = {".bat", ".py", ".ps1", ".txt", ".log"}

MOVED_COUNT = 0

print(f"Scanning {PROJECT_ROOT}...")

for filename in os.listdir(PROJECT_ROOT):
    file_path = os.path.join(PROJECT_ROOT, filename)
    
    # Skip directories
    if os.path.isdir(file_path):
        continue
        
    # Check extension and whitelist
    input_ext = os.path.splitext(filename)[1].lower()
    
    if input_ext in EXTENSIONS and filename not in KEEP_FILES:
        try:
            shutil.move(file_path, os.path.join(LEGACY_DIR, filename))
            print(f"[MOVED] {filename}")
            MOVED_COUNT += 1
        except Exception as e:
            print(f"[ERROR] Could not move {filename}: {e}")

print(f"Cleanup finished. Moved {MOVED_COUNT} files.")
