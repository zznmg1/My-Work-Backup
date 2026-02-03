import zipfile
import os

src = r"c:\Projects\dream-fortune-ai\frontend\android\app\build\outputs\apk\debug\app-debug.apk"
dst = r"c:\Projects\dream-fortune-ai\dream-fortune-app-v2.zip"

try:
    if os.path.exists(src):
        with zipfile.ZipFile(dst, 'w', zipfile.ZIP_DEFLATED) as zipf:
            zipf.write(src, "app-debug.apk")
    else:
        # Create a dummy file to signal error if src missing
        with open("error_missing_src.txt", "w") as f:
            f.write("Source APK not found")
except Exception as e:
    with open("error_zip.txt", "w") as f:
        f.write(str(e))
