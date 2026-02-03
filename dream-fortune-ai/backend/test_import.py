import sys
print(f"Python Executable: {sys.executable}")
print(f"Path: {sys.path}")
try:
    import google.generativeai
    print("SUCCESS: google.generativeai imported")
except ImportError as e:
    print(f"FAILURE: {e}")
except Exception as e:
    print(f"ERROR: {e}")
