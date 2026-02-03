import os
import shutil
import subprocess
import datetime

# Configuration
ROOT_DIR = r"c:\Projects"
TEST_SOURCE = r"c:\Users\ㅋㅋ\.gemini\TEST"
TEST_DEST = os.path.join(ROOT_DIR, "TEST_Projects")

def run_command(cmd, cwd=ROOT_DIR):
    print(f"[CMD] {cmd} in {cwd}")
    try:
        subprocess.run(cmd, cwd=cwd, shell=True, check=True)
    except subprocess.CalledProcessError as e:
        print(f"[ERROR] {e}")

def main():
    print("=== Starting Monorepo Setup ===")
    
    # 1. Bring in TEST folder
    if os.path.exists(TEST_SOURCE):
        print(f"Copying TEST folder to {TEST_DEST}...")
        if os.path.exists(TEST_DEST):
            print("  - Destination exists, merging/updating...")
            shutil.copytree(TEST_SOURCE, TEST_DEST, dirs_exist_ok=True)
        else:
            shutil.copytree(TEST_SOURCE, TEST_DEST)
    else:
        print(f"[WARN] TEST folder not found at {TEST_SOURCE}")

    # 2. Disable sub-repos (dream-fortune-ai) to avoid submodules
    # We want one giant repo for easy sync.
    for item in os.listdir(ROOT_DIR):
        item_path = os.path.join(ROOT_DIR, item)
        git_folder = os.path.join(item_path, ".git")
        
        if os.path.isdir(git_folder):
            print(f"Archiving existing git repo in {item}...")
            # Rename .git to .git_backup_timestamp
            timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
            new_name = os.path.join(item_path, f".git_backup_{timestamp}")
            os.rename(git_folder, new_name)
            
    # 3. Create Root .gitignore
    gitignore_path = os.path.join(ROOT_DIR, ".gitignore")
    if not os.path.exists(gitignore_path):
        print("Creating .gitignore...")
        with open(gitignore_path, "w") as f:
            f.write("node_modules/\n")
            f.write("__pycache__/\n")
            f.write(".venv/\n")
            f.write("dist/\n")
            f.write(".DS_Store\n")
            f.write("*.zip\n")
            f.write(".git_backup_*\n") # Ignore the backups we just made
    
    # 4. Initialize Root Git
    if not os.path.exists(os.path.join(ROOT_DIR, ".git")):
        print("Initializing Root Git Repository...")
        run_command("git init")
    else:
        print("Root Git Repository already exists.")

    # 5. Add and Commit
    print("Adding all files...")
    run_command("git add .")
    
    print("Committing...")
    run_command('git commit -m "Initial Monorepo Commit: Consolidating Projects, TEST, and Researchers"')
    
    print("\n=== SUCCESS ===")
    print("Now you can create a repository on GitHub and push this folder.")
    print("Run: gh repo create My-Work-Backup --private --source=. --push")

if __name__ == "__main__":
    main()
