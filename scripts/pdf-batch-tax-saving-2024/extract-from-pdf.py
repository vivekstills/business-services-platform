"""Extract tax-saving-articles.pdf → tax-saving-clean.txt (PyMuPDF)."""

from __future__ import annotations

import pathlib

try:
    import fitz  # PyMuPDF
except ImportError as e:
    raise SystemExit("pip install pymupdf") from e

HERE = pathlib.Path(__file__).resolve().parent
PDF = HERE / "tax-saving-articles.pdf"
OUT = HERE / "tax-saving-clean.txt"


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
