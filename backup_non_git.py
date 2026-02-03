import os
import zipfile

def zip_folder(folder_paths, output_path):
    print(f"Creating backup at {output_path}...")
    
    with zipfile.ZipFile(output_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for folder_path in folder_paths:
            if not os.path.exists(folder_path):
                print(f"Skipping missing folder: {folder_path}")
                continue
                
            parent_dir = os.path.dirname(folder_path)
            folder_name = os.path.basename(folder_path)
            print(f"Zipping: {folder_name}...")
            
            for root, dirs, files in os.walk(folder_path):
                # Exclude heavy directories
                dirs[:] = [d for d in dirs if d not in ['node_modules', '.venv', '__pycache__', '.git', 'dist', 'build']]
                
                for file in files:
                    file_path = os.path.join(root, file)
                    rel_path = os.path.relpath(file_path, parent_dir)
                    try:
                        zipf.write(file_path, rel_path)
                    except Exception as e:
                        print(f"Failed to zip {file_path}: {e}")
                        
    print(f"\n[SUCCESS] Backup created: {output_path}")
    print("Transfer this file to your new PC and extract it to c:\\Projects")

if __name__ == "__main__":
    folders_to_backup = [
        r"c:\Projects\oneira-web",
        r"c:\Projects\tetris",
        r"c:\Projects\ai-resume-editor"
    ]
    output_zip = r"c:\Projects\Project_Backup_NonGit.zip"
    
    zip_folder(folders_to_backup, output_zip)
