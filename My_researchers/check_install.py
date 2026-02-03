try:
    import notebooklm_py
    print("SUCCESS: notebooklm_py is installed")
except ImportError:
    try:
        import notebooklm
        print("SUCCESS: notebooklm is installed")
    except ImportError:
        print("FAILURE: notebooklm library not found")
