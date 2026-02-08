
import os
import sys
from PIL import Image

def generate_icons(source_path, res_dir):
    """
    Generates Android mipmap icons from a source image.
    Applies simple resizing (no rounding if source is already round/transparent).
    """
    if not os.path.exists(source_path):
        print(f"Error: Source file {source_path} not found.")
        return

    try:
        img = Image.open(source_path).convert("RGBA")
    except Exception as e:
        print(f"Error opening image: {e}")
        return

    # Android Mipmap sizes (standard)
    # mdpi: 48x48
    # hdpi: 72x72
    # xhdpi: 96x96
    # xxhdpi: 144x144
    # xxxhdpi: 192x192
    
    sizes = {
        "mipmap-mdpi": (48, 48),
        "mipmap-hdpi": (72, 72),
        "mipmap-xhdpi": (96, 96),
        "mipmap-xxhdpi": (144, 144),
        "mipmap-xxxhdpi": (192, 192)
    }

    for folder, size in sizes.items():
        target_dir = os.path.join(res_dir, folder)
        if not os.path.exists(target_dir):
            os.makedirs(target_dir, exist_ok=True)
            
        # Resize using LANCZOS for best quality
        resized_img = img.resize(size, Image.Resampling.LANCZOS)
        
        # Save as ic_launcher.png
        icon_path = os.path.join(target_dir, "ic_launcher.png")
        resized_img.save(icon_path, "PNG")
        print(f"Generated {icon_path}")
        
        # Save as ic_launcher_round.png (same image as user requested "just fill it")
        # Usually round icon is circular masked, but user said "image entire just fill"
        # and "if white space needed make it black". 
        # We will just use the same image for round icon as requested "image entire".
        round_path = os.path.join(target_dir, "ic_launcher_round.png")
        resized_img.save(round_path, "PNG")
        print(f"Generated {round_path}")

    print("Icon generation complete.")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python generate_icons.py <source_image_path>")
        sys.exit(1)
        
    source_image = sys.argv[1]
    res_directory = os.path.join("android", "app", "src", "main", "res")
    generate_icons(source_image, res_directory)
