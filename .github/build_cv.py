#!/usr/bin/env python3
"""
Convert cv.md → cv.pdf (single page, print-optimised).
Usage: python build_cv.py [--input cv.md] [--output cv.pdf]
"""

import argparse
import re
import sys
from pathlib import Path

import markdown
from weasyprint import HTML, CSS


# ── Markdown → HTML ──────────────────────────────────────────────────────────

def md_to_html(md_path: Path) -> str:
    text = md_path.read_text(encoding="utf-8")
    body = markdown.markdown(text, extensions=["extra", "nl2br"])
    # Wrap inline-code tags that follow a <br> into a tech-pill span
    body = re.sub(r"<code>([^<]+)</code>", r'<span class="tag">\1</span>', body)
    return body


# ── CSS ───────────────────────────────────────────────────────────────────────

STYLE = CSS(string="""
@page {
    size: A4;
    margin: 11mm 13mm 11mm 13mm;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

body {
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-size: 8.4pt;
    line-height: 1.35;
    color: #1a1a2e;
}

/* ── Header (h1 = name) ─────────────────────────────────────────── */
h1 {
    font-size: 18pt;
    font-weight: 700;
    letter-spacing: -0.3pt;
    color: #0f3460;
    margin-bottom: 2pt;
}

/* Bold meta line directly under h1 */
h1 + p {
    font-size: 8pt;
    color: #444;
    margin-bottom: 5pt;
}

hr {
    border: none;
    border-top: 1.2pt solid #0f3460;
    margin: 5pt 0 5pt 0;
}

/* ── Section headings (h2) ──────────────────────────────────────── */
h2 {
    font-size: 9pt;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.8pt;
    color: #0f3460;
    margin-top: 6pt;
    margin-bottom: 3pt;
    border-bottom: 0.5pt solid #c8d6e5;
    padding-bottom: 1pt;
}

/* ── Entry headings (h3) ────────────────────────────────────────── */
h3 {
    font-size: 8.2pt;
    font-weight: 700;
    color: #1a1a2e;
    margin-top: 4pt;
    margin-bottom: 1pt;
}

/* ── Body paragraphs ────────────────────────────────────────────── */
p {
    margin-bottom: 2pt;
}

/* ── Lists ──────────────────────────────────────────────────────── */
ul {
    padding-left: 12pt;
    margin-bottom: 2pt;
}

li {
    margin-bottom: 1pt;
}

/* ── Tech / tag pills ───────────────────────────────────────────── */
.tag {
    display: inline-block;
    background: #e8eef7;
    color: #0f3460;
    border-radius: 2pt;
    padding: 0.5pt 3.5pt;
    font-size: 7pt;
    font-weight: 600;
    margin: 1pt 1.5pt 1pt 0;
    white-space: nowrap;
}

/* ── Two-column layout for Certifications + Languages + Contact ─── */
/* We rely on the section order: single-column by default */

/* keep code/pre from restyling */
code, pre { font-family: inherit; }

/* subtle link style */
a { color: #0f3460; text-decoration: none; }
""")


# ── HTML template ────────────────────────────────────────────────────────────

HTML_TEMPLATE = """\
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>CV</title>
</head>
<body>
{body}
</body>
</html>
"""


# ── Main ─────────────────────────────────────────────────────────────────────

def build(input_path: Path, output_path: Path) -> None:
    print(f"Reading {input_path} …")
    body_html = md_to_html(input_path)
    full_html = HTML_TEMPLATE.format(body=body_html)

    print("Rendering PDF …")
    HTML(string=full_html, base_url=str(input_path.parent)).write_pdf(
        str(output_path),
        stylesheets=[STYLE],
        uncompressed_pdf=False,
    )
    print(f"✓  Written to {output_path}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Build a single-page CV PDF from Markdown.")
    parser.add_argument("--input",  default="cv.md",  help="Source Markdown file (default: cv.md)")
    parser.add_argument("--output", default="cv.pdf",  help="Output PDF file (default: cv.pdf)")
    args = parser.parse_args()

    inp = Path(args.input)
    out = Path(args.output)

    if not inp.exists():
        print(f"Error: '{inp}' not found.", file=sys.stderr)
        sys.exit(1)

    build(inp, out)


if __name__ == "__main__":
    main()