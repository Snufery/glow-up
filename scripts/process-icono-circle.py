"""Recorta ICONO.png a un circulo con transparencia fuera del arco."""
from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "public" / "ICONO.png"


def main() -> None:
    img = Image.open(SOURCE).convert("RGBA")
    width, height = img.size
    center_x, center_y = width // 2, height // 2

    # Radio ajustado al arco verde/teal del icono (no al canvas rectangular).
    radius = int(height * 0.485)

    mask = Image.new("L", (width, height), 0)
    draw = ImageDraw.Draw(mask)
    draw.ellipse(
        (center_x - radius, center_y - radius, center_x + radius, center_y + radius),
        fill=255,
    )
    mask = mask.filter(ImageFilter.GaussianBlur(radius=1.2))

    masked = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    masked.paste(img, (0, 0), mask)

    left = center_x - radius
    top = center_y - radius
    cropped = masked.crop((left, top, left + radius * 2, top + radius * 2))

    cropped.save(SOURCE, optimize=True)
    print(f"Saved circular {SOURCE.name}: {cropped.size[0]}x{cropped.size[1]}")


if __name__ == "__main__":
    main()