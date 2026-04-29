"""One-off: extract plain text from DOCX (India Tax Saving Articles)."""
import re
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path

NS = {"w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main"}


def paragraphs_from_docx(path: str) -> list[str]:
    z = zipfile.ZipFile(path)
    root = ET.fromstring(z.read("word/document.xml"))
    out: list[str] = []
    for p in root.findall(".//w:p", NS):
        texts = [t.text or "" for t in p.findall(".//w:t", NS)]
        line = "".join(texts).strip()
        if line:
            out.append(line)
    return out


def main():
    path = Path(
        r"c:/Users/iamza/AppData/Roaming/Cursor/User/workspaceStorage/"
        r"cfc4d3c214b0d8a26c0d2b0b2a0e826c/pdfs/6c2daff4-2836-4c69-a05b-74b66e3449e2/"
        r"India_Tax_Saving_Articles_2024-25 (2).pdf"
    )
    paras = paragraphs_from_docx(str(path))
    full = "\n".join(paras)
    repo = Path(__file__).resolve().parent.parent
    out = repo / "data" / "_extracted_tax_articles_raw.txt"
    out.write_text(full, encoding="utf-8")
    print("wrote", out, "chars", len(full), "paras", len(paras))
    title_re = re.compile(
        r"^(Section |Home Loan|Personal Loan|Children Education|How to Save Tax|Health Security)",
        re.I,
    )
    for i, p in enumerate(paras):
        if title_re.search(p) and len(p) < 220:
            print(i, p[:100])


if __name__ == "__main__":
    main()
