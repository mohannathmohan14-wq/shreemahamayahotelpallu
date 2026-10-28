#!/usr/bin/env python3
"""
Shri Maha Maya — image optimizer.
Converts every JPG/PNG in images/ to fast-loading WebP (with size limits),
and builds the social-share og-image.
Run after replacing or adding photos:  python3 tools/optimize.py
"""
import os
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG = os.path.join(ROOT, "images")
MAXW = {"hero": 1600, "about": 1400, "rooms": 1400, "food": 1400, "gallery": 1800}
QUALITY = 80


def optimize(path):
    im = Image.open(path).convert("RGB")
    folder = os.path.basename(os.path.dirname(path))
    name = os.path.basename(path)

    # 360-degree panorama: force a 2:1 ratio, center-cropped
    if name.lower().startswith("pano"):
        w, h = im.size
        target_h = w // 2
        if h != target_h:
            top = max(0, (h - target_h) // 2)
            im = im.crop((0, top, w, top + target_h))

    maxw = MAXW.get(folder, 1400)
    if im.width > maxw:
        im = im.resize((maxw, round(im.height * maxw / im.width)), Image.LANCZOS)

    out = os.path.splitext(path)[0] + ".webp"
    im.save(out, "WEBP", quality=QUALITY, method=6)
    print(f"  {os.path.relpath(out, ROOT):55s} {im.width}x{im.height}  {os.path.getsize(out)//1024} KB")


def og_image():
    """1200x630 JPG for WhatsApp / Facebook sharing (best from the hero shot)."""
    candidates = [
        os.path.join(IMG, "hero", "hero-1.jpg"),
        os.path.join(ROOT, "..", "uploads", "front.jpg"),
    ]
    src = next((c for c in candidates if os.path.exists(c)), None)
    if not src:
        print("  og-image: no source found, skipping")
        return
    im = Image.open(src).convert("RGB")
    w, h = im.size
    tw, th = 1200, 630
    scale = max(tw / w, th / h)
    im = im.resize((round(w * scale), round(h * scale)), Image.LANCZOS)
    left = (im.width - tw) // 2
    top = (im.height - th) // 2
    im = im.crop((left, top, left + tw, top + th))
    out = os.path.join(IMG, "og", "og-image.jpg")
    os.makedirs(os.path.dirname(out), exist_ok=True)
    im.save(out, "JPEG", quality=82, optimize=True)
    print(f"  {os.path.relpath(out, ROOT):55s} {tw}x{th}  {os.path.getsize(out)//1024} KB")


if __name__ == "__main__":
    print("Optimizing images…")
    for root, _, files in os.walk(IMG):
        for f in sorted(files):
            if f.lower().endswith((".jpg", ".jpeg", ".png")):
                optimize(os.path.join(root, f))
    og_image()
    print("Done.")
