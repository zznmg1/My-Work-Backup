import sys
import os

print("--- DIAGNOSTIC START ---")
print(f"Python Executable: {sys.executable}")
print(f"Current Working Directory: {os.getcwd()}")

print("[1] Checking .env file...")
env_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '.env')
if os.path.exists(env_path):
    print("    .env found.")
else:
    print("    ERROR: .env not found!")

print("[2] Checking requirements...")
try:
    import dotenv
    print("    python-dotenv matches.")
except ImportError as e:
    print(f"    ERROR borrowing dotenv: {e}")

try:
    import mcp
    print("    mcp matches.")
except ImportError as e:
    print(f"    ERROR borrowing mcp: {e}")

print("[3] Attempting to import NotebookLM...")
# Try all known variations
found_notebooklm = False
try:
    import notebooklm
    print("    'import notebooklm' worked.")
    found_notebooklm = True
except ImportError:
    print("    'import notebooklm' failed.")

try:
    from notebooklm.notebooklm import NotebookLM
    print("    'from notebooklm.notebooklm import NotebookLM' worked.")
    found_notebooklm = True
except ImportError:
    print("    'from notebooklm.notebooklm import NotebookLM' failed.")

if not found_notebooklm:
    print("    CRITICAL: NotebookLM library appears missing or incompatible.")

print("[4] Attempting to import server.py...")
try:
    import server
    print("    Imported server.py successfully.")
except Exception as e:
    print(f"    ERROR importing server.py: {e}")
    import traceback
    traceback.print_exc()

print("--- DIAGNOSTIC END ---")
