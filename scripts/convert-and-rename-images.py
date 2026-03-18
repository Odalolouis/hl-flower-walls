"""
Convert & SEO-rename product images for H&L Flower Walls.

Converts HEIC/HEIF/PNG/WebP to optimized JPG, renames with SEO-friendly
filenames, resizes to max 2400px, and deletes originals.

Usage:  python scripts/convert-and-rename-images.py
"""

import os
import sys

from pillow_heif import register_heif_opener
from PIL import Image, ImageOps

register_heif_opener()

BASE = os.path.join(os.path.dirname(__file__), '..', 'src', 'images', 'walls')
QUALITY = 85
MAX_DIMENSION = 2400


def convert_image(src_path, dst_path):
    """Open any supported image, fix orientation, resize, save as JPG."""
    img = Image.open(src_path)
    img = ImageOps.exif_transpose(img)
    img = img.convert('RGB')

    w, h = img.size
    if max(w, h) > MAX_DIMENSION:
        ratio = MAX_DIMENSION / max(w, h)
        img = img.resize((int(w * ratio), int(h * ratio)), Image.LANCZOS)

    img.save(dst_path, 'JPEG', quality=QUALITY)
    return os.path.getsize(dst_path)


def rename_jpg(src_path, dst_path):
    """Rename an existing JPG (no conversion needed)."""
    os.rename(src_path, dst_path)
    return os.path.getsize(dst_path)


# Mapping: slug -> list of (source_filename, target_seo_filename, action)
# action: 'convert' for HEIC/HEIF/PNG/WebP, 'rename' for badly-named JPGs
CONVERSIONS = {
    'angel-white': [
        ('Angel White Flower wall.jpg',
         'angel-white-flower-wall-closeup-white-roses-greenery-tampa.jpg',
         'rename'),
        ('IMG_0457.HEIC',
         'angel-white-flower-wall-wedding-sweetheart-table-backdrop-tampa.jpg',
         'convert'),
        ('IMG_1093.HEIC',
         'angel-white-flower-wall-elegant-venue-table-setting-tampa.jpg',
         'convert'),
        ('IMG_4130.HEIC',
         'angel-white-flower-wall-outdoor-party-balloon-garland-tampa.jpg',
         'convert'),
        ('IMG_5373.HEIC',
         'angel-white-flower-wall-birthday-party-led-sign-tampa.jpg',
         'convert'),
    ],
    'dhalia-pink': [
        ('Dhalia Pink Wedding Flower Wall Rental - 1d - 1lGS6BxYh3s9X-jBcn-V3_IrTCrZwEFoc.heif',
         'dhalia-pink-flower-wall-wedding-venue-led-sign-display-tampa.jpg',
         'convert'),
        ('IMG_0556.PNG',
         'dhalia-pink-flower-wall-portrait-photoshoot-backdrop-tampa.jpg',
         'convert'),
        ('IMG_5297.HEIC',
         'dhalia-pink-flower-wall-baby-shower-led-sign-tampa.jpg',
         'convert'),
        ('IMG_5305.HEIC',
         'dhalia-pink-flower-wall-baby-shower-couple-photo-tampa.jpg',
         'convert'),
        ('IMG_5328.HEIC',
         'dhalia-pink-flower-wall-baby-shower-group-photo-tampa.jpg',
         'convert'),
    ],
    'donna-champagne': [
        ('IMG_0210.HEIC',
         'donna-champagne-flower-wall-wedding-couple-mr-mrs-led-tampa.jpg',
         'convert'),
        ('IMG_0985.HEIC',
         'donna-champagne-flower-wall-wedding-reception-led-sign-tampa.jpg',
         'convert'),
        ('IMG_1003.HEIC',
         'donna-champagne-flower-wall-full-display-led-sign-tampa.jpg',
         'convert'),
        ('IMG_3063.HEIC',
         'donna-champagne-flower-wall-outdoor-lawn-display-tampa.jpg',
         'convert'),
        ('IMG_4330_tnjcbh.webp',
         'donna-champagne-flower-wall-photo-booth-venue-setup-tampa.jpg',
         'convert'),
    ],
    'flora-pink': [
        ('IMG_0612.HEIC',
         'flora-pink-flower-wall-indoor-blush-rose-display-tampa.jpg',
         'convert'),
        ('IMG_3075.HEIC',
         'flora-pink-flower-wall-outdoor-full-display-tampa.jpg',
         'convert'),
        ('IMG_3081.HEIC',
         'flora-pink-flower-wall-closeup-blush-roses-tampa.jpg',
         'convert'),
        ('IMG_3929.HEIC',
         'flora-pink-flower-wall-birthday-party-balloon-decor-tampa.jpg',
         'convert'),
        ('IMG_3935.HEIC',
         'flora-pink-flower-wall-birthday-celebration-photo-tampa.jpg',
         'convert'),
    ],
    'the-aria': [
        ('greenery Hedge Flower Wall.jpg',
         'the-aria-flower-wall-greenery-hedge-closeup-tampa.jpg',
         'rename'),
        ('IMG_3986.HEIC',
         'the-aria-flower-wall-dinner-party-balloon-garland-tampa.jpg',
         'convert'),
        ('IMG_5550.HEIC',
         'the-aria-flower-wall-outdoor-floral-arch-topper-tampa.jpg',
         'convert'),
    ],
    'the-pearl': [
        ('IMG_0491.PNG',
         'the-pearl-flower-wall-wedding-selfie-mr-mrs-sign-tampa.jpg',
         'convert'),
        ('IMG_0492.PNG',
         'the-pearl-flower-wall-wedding-bridal-party-photo-tampa.jpg',
         'convert'),
        ('IMG_0496.PNG',
         'the-pearl-flower-wall-wedding-party-group-photo-tampa.jpg',
         'convert'),
        ('IMG_1382.HEIC',
         'the-pearl-flower-wall-sweetheart-table-led-sign-tampa.jpg',
         'convert'),
        ('IMG_7858.HEIC',
         'the-pearl-flower-wall-graduation-party-celebration-tampa.jpg',
         'convert'),
    ],
    'veronicas-garden': [
        ('Copy of IMG_2300.HEIC',
         'veronicas-garden-flower-wall-outdoor-tropical-display-tampa.jpg',
         'convert'),
        ('Copy of IMG_2305.HEIC',
         'veronicas-garden-flower-wall-backyard-party-setup-tampa.jpg',
         'convert'),
        ('Copy of IMG_4356.HEIC',
         'veronicas-garden-flower-wall-birthday-party-balloon-decor-tampa.jpg',
         'convert'),
        ('Copy of IMG_8174.HEIC',
         'veronicas-garden-flower-wall-birthday-group-photo-tampa.jpg',
         'convert'),
    ],
}


def main():
    converted = 0
    renamed = 0
    errors = 0

    for slug, items in sorted(CONVERSIONS.items()):
        product_dir = os.path.join(BASE, slug)
        print(f'\n[{slug}]')

        for src_name, dst_name, action in items:
            src_path = os.path.join(product_dir, src_name)
            dst_path = os.path.join(product_dir, dst_name)

            if not os.path.exists(src_path):
                print(f'  SKIP (not found): {src_name}')
                errors += 1
                continue

            try:
                if action == 'rename':
                    size = rename_jpg(src_path, dst_path)
                    renamed += 1
                else:
                    size = convert_image(src_path, dst_path)
                    os.remove(src_path)
                    converted += 1

                print(f'  OK: {src_name}')
                print(f'      -> {dst_name} ({size // 1024}KB)')
            except Exception as e:
                print(f'  FAIL: {src_name} -> {e}')
                errors += 1

    print(f'\n--- Summary ---')
    print(f'Converted: {converted}')
    print(f'Renamed:   {renamed}')
    print(f'Errors:    {errors}')
    print(f'Total:     {converted + renamed} files processed')


if __name__ == '__main__':
    main()
