try:
    import notebooklm
    print("Imported notebooklm")
    print("Dir:", dir(notebooklm))
    try:
        from notebooklm import NotebookLM
        print("NotebookLM class found directly under notebooklm")
    except ImportError:
        print("NotebookLM class NOT found directly under notebooklm")
        try:
            from notebooklm.notebooklm import NotebookLM
            print("NotebookLM class found under notebooklm.notebooklm")
        except ImportError:
            print("NotebookLM class NOT found under notebooklm.notebooklm")
except ImportError as e:
    print(f"Failed to verify imports: {e}")
