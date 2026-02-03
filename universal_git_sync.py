import os
import subprocess
import glob
from datetime import datetime

REQUIRED_FOLDERS = [
    r"c:\Projects\dream-fortune-ai",
    r"c:\Projects\oneira-web", 
    r"c:\Projects\tetris",
    r"c:\Projects\ai-resume-editor"
]

def run_command(command, cwd):
    try:
        result = subprocess.run(
            command, 
            cwd=cwd, 
            shell=True, 
            stdout=subprocess.PIPE, 
            stderr=subprocess.PIPE, 
            text=True, 
            timeout=60
        )
        return result.returncode, result.stdout, result.stderr
    except Exception as e:
        return -1, "", str(e)

def sync_repo(repo_path):
    print(f"\n--- Checking {repo_path} ---")
    
    if not os.path.exists(os.path.join(repo_path, ".git")):
        print(f"[WARN] Not a git repository: {repo_path}")
        return
        
    # check for lock
    lock_file = os.path.join(repo_path, ".git", "index.lock")
    if os.path.exists(lock_file):
        print(f"[INFO] Removing stale lock file: {lock_file}")
        try:
            os.remove(lock_file)
        except Exception as e:
            print(f"[ERROR] Could not remove lock file: {e}")

    # Add
    print("[Action] Git Add...")
    run_command("git add .", repo_path)
    
    # Commit
    print("[Action] Git Commit...")
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    code, out, err = run_command(f'git commit -m "Auto-sync for PC transfer: {timestamp}"', repo_path)
    if code == 0:
        print(f"[Success] Committed changes.\n{out}")
    else:
        if "nothing to commit" in out:
            print("[Info] Nothing to commit.")
        else:
            print(f"[Error] Commit failed or nothing to commit.\nOutput: {out}\nError: {err}")

    # Push
    print("[Action] Git Push...")
    code, out, err = run_command("git push", repo_path)
    if code == 0:
        print("[Success] Pushed to remote.")
    else:
        print(f"[Error] Push failed.\nOutput: {out}\nError: {err}")

    # Status check
    code, out, err = run_command("git status -s", repo_path)
    if not out.strip():
        print("[Status] Clean working tree.")
    else:
        print(f"[Status] Uncommitted changes remain:\n{out}")

def main():
    print(f"Starting Universal Git Sync at {datetime.now()}")
    
    # Find all directories in Projects
    base_dir = r"c:\Projects"
    
    # First priority: Explicitly requested folders or known projects
    for folder in REQUIRED_FOLDERS:
        if os.path.exists(folder):
            sync_repo(folder)
            
    # Then check any others
    for entry in os.scandir(base_dir):
        if entry.is_dir() and entry.path not in REQUIRED_FOLDERS:
            # Check if it's a git repo
            if os.path.exists(os.path.join(entry.path, ".git")):
                sync_repo(entry.path)

if __name__ == "__main__":
    main()
