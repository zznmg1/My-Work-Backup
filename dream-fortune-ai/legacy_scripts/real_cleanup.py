import os
import shutil

root = r"c:/Projects/dream-fortune-ai"
target = os.path.join(root, "legacy_scripts")

if not os.path.exists(target):
    os.makedirs(target)

# White list of files/folders to KEEP in the root
keep = [
    "backend", "frontend", ".git", ".idea", "legacy_scripts", "node_modules",
    "build_premium_design.bat", "verify_pc_build.bat", "start_dream_fortune.bat",
    "dream_data.txt", ".gitignore", ".gitattributes", "real_cleanup.py",
    "package.json", "package-lock.json"
]

files = os.listdir(root)
moved = 0
errors = 0
for f in files:
    if f in keep:
        continue
    
    src_path = os.path.join(root, f)
    dst_path = os.path.join(target, f)
    
    try:
        # If it's the target folder itself (unlikely due to keep list but safety first)
        if os.path.abspath(src_path) == os.path.abspath(target):
            continue
            
        shutil.move(src_path, dst_path)
        print(f"Successfully moved: {f}")
        moved += 1
    except Exception as e:
        print(f"Error moving {f}: {e}")
        errors += 1

print(f"\nSummary: Moved {moved} items, Encountered {errors} errors.")
