import re
from pathlib import Path

# Map old -> new
REPLS = [
    (r"#f3f4f6\b", "#fffff2"),
    (r"#f9fafb\b", "#fafbee"),
    (r"#111827\b", "#140194"),
    (r"#1f2937\b", "#0f0170"),
    (r"#2563eb\b", "#b3c805"),
    (r"#1d4ed8\b", "#98aa04"),
    (r"#60a5fa\b", "#f7ff28"),
    (r"#4b5563\b", "#665ab9"),
    (r"#6b7280\b", "#8a80ca"),
    (r"#e5e7eb\b", "#e8eeb4"),
    (r"#d1d5db\b", "#d0ccea"),
    (r"#b91c1c\b", "#fc3b41"),
    (r"#059669\b", "#b3c805"),
    (r"#fff\b", "#ffffff"),
]

RGBA_REPLS = [
    (r"rgba\(\s*37\s*,\s*99\s*,\s*235\s*,\s*0\.25\s*\)", "rgba(179,200,5,0.25)"),
    (r"rgba\(\s*37\s*,\s*99\s*,\s*235\s*,\s*0\.35\s*\)", "rgba(179,200,5,0.35)"),
    (r"rgba\(\s*37\s*,\s*99\s*,\s*235\s*,\s*0\.42\s*\)", "rgba(179,200,5,0.42)"),
    (r"rgba\(\s*15\s*,\s*23\s*,\s*42\s*,\s*0\.08\s*\)", "rgba(20,1,148,0.08)"),
    (r"rgba\(\s*17\s*,\s*24\s*,\s*39\s*,\s*0\.55\s*\)", "rgba(20,1,148,0.55)"),
]

# Inline legacy colors / non-tailwind ones
EXTRA_REPLS = [
    (r"#eee\b", "#e8eeb4"),
    (r"#555\b", "#665ab9"),
    (r"#666\b", "#8a80ca"),
    (r"#f9f9f9\b", "#fafbee"),
    (r"color\s*:\s*green\b", "color:#b3c805"),
    (r"color\s*:\s*orange\b", "color:#f7ff28"),
]

TARGET_FILES = [
    Path('facont/facont.css'),
    Path('facont/content-list.html'),
    Path('facont/content-review.html'),
    Path('facont/profile.html'),
    Path('facont/reset-password.html'),
    Path('facont/stories-text.html'),
    Path('facont/js/content/content.js'),
    Path('facont/js/auth/auth.js'),
]


def apply_all(text: str) -> str:
    out = text
    for pat, rep in REPLS:
        out = re.sub(pat, rep, out, flags=re.IGNORECASE)
    for pat, rep in RGBA_REPLS:
        out = re.sub(pat, rep, out)
    for pat, rep in EXTRA_REPLS:
        out = re.sub(pat, rep, out, flags=re.IGNORECASE)
    return out


def main() -> int:
    changed = []
    for p in TARGET_FILES:
        if not p.exists():
            continue
        orig = p.read_text(encoding='utf-8')
        updated = apply_all(orig)
        if updated != orig:
            p.write_text(updated, encoding='utf-8')
            changed.append(str(p))

    print('Changed files:')
    for c in changed:
        print(' -', c)
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
