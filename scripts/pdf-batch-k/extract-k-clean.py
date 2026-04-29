"""
Regenerate k-clean.txt from k.pdf (PyMuPDF). Same extract used by publish-k-batch.mjs.

Usage (repo root):
  python scripts/pdf-batch-k/extract-k-clean.py

Requires: pip install pymupdf
"""
from __future__ import annotations

import pathlib

try:
    import fitz  # PyMuPDF
except ImportError as e:
    raise SystemExit("Install PyMuPDF: pip install pymupdf") from e

HERE = pathlib.Path(__file__).resolve().parent
PDF = HERE / "k.pdf"
OUT = HERE / "k-clean.txt"


def main() -> None:
    if not PDF.is_file():
        raise SystemExit(f"Missing {PDF}")
    doc = fitz.open(PDF)
    parts: list[str] = []
    for page in doc:
        parts.append(page.get_text())
    text = "\n".join(parts)
    OUT.write_text(text, encoding="utf-8")
    print(f"Wrote {OUT} ({len(text)} chars, {len(doc)} pages)")


if __name__ == "__main__":
    main()
