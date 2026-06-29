"""Remove only outer background from icon.png (edge flood-fill), preserving interior whites."""
from __future__ import annotations

from collections import deque
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT.parent / "icon.png"
OUT = ROOT / "public" / "icon.png"
PUBLIC = ROOT / "public"
THRESHOLD = 45
ALPHA_MIN = 20
PAD = 8
FAVICON_SIZES = (16, 32, 48)


def _is_background(rgb: tuple[int, int, int], bg: tuple[int, int, int], threshold: int) -> bool:
    r, g, b = rgb
    if r > 245 and g > 245 and b > 245:
        return True
    dist = sum((a - b) ** 2 for a, b in zip(rgb, bg)) ** 0.5
    return dist < threshold


def _background_color(pixels, w: int, h: int) -> tuple[int, int, int]:
    corners = [
        pixels[0, 0][:3],
        pixels[w - 1, 0][:3],
        pixels[0, h - 1][:3],
        pixels[w - 1, h - 1][:3],
    ]
    return tuple(sum(c[i] for c in corners) // 4 for i in range(3))


def remove_outer_background(img: Image.Image, threshold: int = THRESHOLD) -> Image.Image:
    """Flood-fill from image edges through background-colored pixels only."""
    rgba = img.convert("RGBA")
    pixels = rgba.load()
    w, h = rgba.size
    bg = _background_color(pixels, w, h)

    for y in range(h):
        for x in range(w):
            r, g, b, _a = pixels[x, y]
            pixels[x, y] = (r, g, b, 255)

    remove = [[False] * w for _ in range(h)]
    queue: deque[tuple[int, int]] = deque()

    def try_seed(x: int, y: int) -> None:
        if remove[y][x]:
            return
        if _is_background(pixels[x, y][:3], bg, threshold):
            remove[y][x] = True
            queue.append((x, y))

    for x in range(w):
        try_seed(x, 0)
        try_seed(x, h - 1)
    for y in range(h):
        try_seed(0, y)
        try_seed(w - 1, y)

    while queue:
        x, y = queue.popleft()
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nx, ny = x + dx, y + dy
            if 0 <= nx < w and 0 <= ny < h and not remove[ny][nx]:
                if _is_background(pixels[nx, ny][:3], bg, threshold):
                    remove[ny][nx] = True
                    queue.append((nx, ny))

    for y in range(h):
        for x in range(w):
            if remove[y][x]:
                r, g, b, _a = pixels[x, y]
                pixels[x, y] = (r, g, b, 0)

    return rgba


def keep_largest_component(img: Image.Image, min_alpha: int = ALPHA_MIN) -> Image.Image:
    """Drop disconnected fringe speckles outside the badge."""
    pixels = img.load()
    w, h = img.size
    visited = [[False] * w for _ in range(h)]
    best: list[tuple[int, int]] = []

    for sy in range(h):
        for sx in range(w):
            if visited[sy][sx] or pixels[sx, sy][3] < min_alpha:
                visited[sy][sx] = True
                continue
            component: list[tuple[int, int]] = []
            queue: deque[tuple[int, int]] = deque([(sx, sy)])
            visited[sy][sx] = True
            while queue:
                x, y = queue.popleft()
                if pixels[x, y][3] < min_alpha:
                    continue
                component.append((x, y))
                for dx in (-1, 0, 1):
                    for dy in (-1, 0, 1):
                        if dx == 0 and dy == 0:
                            continue
                        nx, ny = x + dx, y + dy
                        if 0 <= nx < w and 0 <= ny < h and not visited[ny][nx]:
                            visited[ny][nx] = True
                            if pixels[nx, ny][3] >= min_alpha:
                                queue.append((nx, ny))
            if len(component) > len(best):
                best = component

    keep = set(best)
    for y in range(h):
        for x in range(w):
            if pixels[x, y][3] >= min_alpha and (x, y) not in keep:
                r, g, b, _a = pixels[x, y]
                pixels[x, y] = (r, g, b, 0)

    return img


def _crop_to_content(img: Image.Image, pad: int = PAD) -> Image.Image:
    pixels = img.load()
    w, h = img.size
    xs: list[int] = []
    ys: list[int] = []
    for y in range(h):
        for x in range(w):
            if pixels[x, y][3] > 10:
                xs.append(x)
                ys.append(y)
    if not xs:
        raise ValueError("No visible pixels found after background removal")
    x0, x1 = max(0, min(xs) - pad), min(w, max(xs) + pad + 1)
    y0, y1 = max(0, min(ys) - pad), min(h, max(ys) + pad + 1)
    return img.crop((x0, y0, x1, y1))


def _square_favicon(img: Image.Image, size: int) -> Image.Image:
    """Fit icon on a transparent square canvas (preserves alpha for favicons)."""
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    thumb = img.copy()
    thumb.thumbnail((size, size), Image.Resampling.LANCZOS)
    ox = (size - thumb.width) // 2
    oy = (size - thumb.height) // 2
    canvas.paste(thumb, (ox, oy), thumb)
    return canvas


def _write_favicons(icon: Image.Image) -> None:
    PUBLIC.mkdir(parents=True, exist_ok=True)
    frames = [_square_favicon(icon, size) for size in FAVICON_SIZES]
    for size, frame in zip(FAVICON_SIZES, frames):
        frame.save(PUBLIC / f"favicon-{size}.png", "PNG", optimize=True)
    # Browsers request /favicon.ico by default; serve the 32px PNG (modern browsers accept this).
    frames[1].save(PUBLIC / "favicon.ico", "PNG", optimize=True)


def main() -> None:
    source = SRC if SRC.exists() else OUT
    opened = Image.open(source)
    result = _crop_to_content(keep_largest_component(remove_outer_background(opened)))
    OUT.parent.mkdir(parents=True, exist_ok=True)
    result.save(OUT, "PNG")
    _write_favicons(result)
    if SRC.exists():
        result.save(SRC, "PNG")
    print(f"Wrote {OUT} ({result.size[0]}x{result.size[1]} RGBA)")
    print(f"Wrote favicon-{FAVICON_SIZES[0]}.png … favicon-{FAVICON_SIZES[-1]}.png")


if __name__ == "__main__":
    main()
