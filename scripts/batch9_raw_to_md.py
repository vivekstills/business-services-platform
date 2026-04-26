#!/usr/bin/env python3
"""
Convert tmp/extracted-user-batches/batch-9-raw.txt (lines 1–~1635) into
12 income-tax service markdown files — structure preserved, wording from raw.
"""
from __future__ import annotations

import re
from pathlib import Path

RAW = Path("tmp/extracted-user-batches/batch-9-raw.txt")
OUT_DIR = Path("src/data/service-about/income-tax-batch-9")

# (service_index, h1, outfile) — h1 from source heading line
SERVICES: list[tuple[int, str, str]] = [
    (1, "Form 15CA & 15CB filing", "form-15ca-15cb.md"),
    (2, "ITR-U filing (updated return)", "itr-u-filing.md"),
    (3, "ITR-1 form filing (Sahaj)", "itr-1-filing.md"),
    (4, "ITR-2 form filing", "itr-2-filing.md"),
    (5, "ITR-3 form filing", "itr-3-filing.md"),
    (6, "ITR-4 form filing (Sugam)", "itr-4-filing.md"),
    (7, "ITR-5 form filing", "itr-5-filing.md"),
    (8, "ITR-6 form filing", "itr-6-filing.md"),
    (9, "ITR-7 form filing", "itr-7-filing.md"),
    (10, "PAN card application", "pan-card-application.md"),
    (11, "TAN registration", "tan-registration.md"),
    (12, "TDS return filing", "tds-return-filing.md"),
]

# Lines that start a new H2 (exact match, strip)
H2 = {
    "Overview",
    "Applicability",
    "Features",
    "Benefits",
    "Documents",
    "Process",
    "Fees",
    "Deadlines",
    "Errors",
    "Frequently Asked Questions",
}

H3 = {
    "The Relationship Between 15CA and 15CB:",
    "The Relationship between 15CA and 15CB:",  # tolerate
    "TDS Certificate Issuance",  # TDS: subsection under Deadlines
    "Key financial deterrent:",  # ITR-U – keep as line under overview, not h2
    "Types of TDS Return Forms:",  # TDS – inline before table; handled specially
    "ITR-3 vs. ITR-4:",  # itr-3
    "ITR-4 (Sugam) is applicable for:",  # duplicate label in ITR-4? skip
    "Standard PAN Application (Form 49A):",  # PAN process
    "Instant e-PAN (for Aadhaar-holding individuals):",  # PAN
    "Not applicable for:",
    "Not required for:",
    "Government and IEC-related fees",  # may appear
}

DISCLAIMER = (
    "All service content is for informational purposes. Specific income tax advice should be "
    "obtained from qualified Chartered Accountants or tax practitioners based on your individual "
    "financial situation, entity type, and applicable provisions."
)


def is_service_start(line: str) -> bool:
    """
    Distinguish '3. ITR-1 FORM FILING (SAHAJ)' from FAQ lines like
    '3. I filed my ITR-1 for AY 2023-24...'
    """
    m = re.match(r"^(\d{1,2})\.\s+(.+)$", line)
    if not m:
        return False
    t = m.group(2).strip()
    if t.startswith("FORM "):
        return True
    if t.startswith("ITR-") and "FILING" in t:
        return True
    if "TDS RETURN FILING" in t or "TAN REGISTRATION" in t or "PAN CARD" in t:
        return True
    return False


def convert_chunk(lines: list[str], service_idx: int) -> str:
    """lines: body without the '1. TITLE' line."""
    out: list[str] = []
    i = 0
    n = len(lines)

    def peek_table_3col() -> list[str] | None:
        nonlocal i
        if i + 8 > n:
            return None
        a, b, c = lines[i].strip(), lines[i + 1].strip(), lines[i + 2].strip()
        if a and b and c and not a.startswith("|"):
            j = i + 3
            rows: list[str] = []
            while j + 2 < n:
                r1, r2, r3 = (
                    lines[j].strip(),
                    lines[j + 1].strip(),
                    lines[j + 2].strip(),
                )
                if not r1 and not r2:  # end
                    break
                if re.match(r"^[A-Z][a-zA-Z /&(),.-]+:", lines[j + 1] if j + 1 < n else ""):
                    break
                if is_service_start(lines[j]) or (
                    j + 3 < n and lines[j] in H2
                ):  # next section
                    break
                # heuristic: 3 line row
                rows.append(
                    f"| {r1} | {r2} | {r3} |"
                )
                j += 3
            if len(rows) >= 2:
                block = [f"| {a} | {b} | {c} |", "| --- | --- | --- |", *rows]
                i = j
                return block
        return None

    def emit_table_2col_from_document_header() -> None:
        nonlocal i
        if i + 1 < n and lines[i].strip() == "Document" and lines[i + 1].strip() == "Details":
            out.append("| Document | Details |")
            out.append("| --- | --- |")
            i += 2
            while i + 1 < n:
                left = lines[i].strip()
                right = lines[i + 1].strip()
                if not left and not right:
                    i += 1
                    break
                if left in H2 or is_service_start(left):
                    break
                if re.match(r"^\d+\.\s", left):
                    break
                out.append(f"| {left} | {right} |")
                i += 2
                if i < n and lines[i].strip() == "" and i + 1 < n and lines[i + 1].strip() in H2:
                    i += 1
                    break
            return
        if i + 1 < n and lines[i].strip() == "Scenario" and "15CA" in lines[i + 2]:
            # special 15CA table already handled by h3 path
            pass

    while i < n:
        line = lines[i]
        s = line.strip()

        if not s:
            out.append("")
            i += 1
            continue

        if is_service_start(s):
            break

        if s == "The Relationship Between 15CA and 15CB:" and service_idx == 1:
            out.append("### The Relationship Between 15CA and 15CB:")
            out.append("")
            i += 1
            if i + 2 < n:
                a, b, c = (
                    lines[i].strip(),
                    lines[i + 1].strip(),
                    lines[i + 2].strip(),
                )
                if a == "Scenario" and b == "15CA Required" and c == "15CB Required":
                    out.append(f"| {a} | {b} | {c} |")
                    out.append("| --- | --- | --- |")
                    i += 3
                    while i + 2 < n:
                        r1, r2, r3 = (
                            lines[i].strip(),
                            lines[i + 1].strip(),
                            lines[i + 2].strip(),
                        )
                        if not r1 or r1 in H2:
                            break
                        out.append(f"| {r1} | {r2} | {r3} |")
                        i += 3
            out.append("")
            continue

        if s in H2:
            out.append(f"## {s}")
            out.append("")
            i += 1
            # Document / Details table
            if s == "Documents" and i < n and lines[i].strip() == "Document":
                emit_table_2col_from_document_header()
            continue

        if s == "Frequently Asked Questions":
            out.append("## Frequently asked questions")
            out.append("")
            i += 1
            # FAQ: numbered lines 1. Q ... 2. Q
            while i < n:
                t = lines[i].strip()
                if not t:
                    out.append("")
                    i += 1
                    continue
                if is_service_start(t) or t in H2:
                    break
                m = re.match(r"^(\d+)\.\s+(.+)$", t, re.S)
                if m:
                    rest = m.group(2).strip()
                    qm = re.match(r"^(.+?\?)\s+(.+)$", rest, re.S)
                    if qm:
                        out.append(
                            f"- **{qm.group(1).strip()}** {qm.group(2).strip()}"
                        )
                    else:
                        out.append(f"- {rest}")
                else:
                    out.append(f"- {t}")
                i += 1
            continue

        # ITR-U key financial: paragraph with following table
        if s == "Key financial deterrent:" and service_idx == 2:
            out.append(
                f"Key financial deterrent: ITR-U is not penalty-free — an additional tax is levied as a "
                f"deterrent against using it as a routine filing tool:"
            )
            out.append("")
            i += 1
            # expect Filing Period table
            if i < n and lines[i].strip() == "Filing Period":
                out.append("| Filing Period | Additional Tax on Underpaid Tax |")
                out.append("| --- | --- |")
                i += 1
                while i + 1 < n:
                    a, b = lines[i].strip(), lines[i + 1].strip()
                    if not a or a in H2:
                        break
                    if a == "Applicability":
                        break
                    out.append(f"| {a} | {b} |")
                    i += 2
            out.append("")
            continue

        # TDS: "Types of TDS Return Forms:" block
        if s.startswith("Types of TDS") and service_idx == 12:
            out.append("Types of TDS Return Forms:")
            out.append("")
            i += 1
            if i < n and lines[i].strip() == "Form":
                out.append("| Form | Nature of TDS/TCS | Filed By |")
                out.append("| --- | --- | --- |")
                i += 1
                while i + 2 < n:
                    a, b, c = (
                        lines[i].strip(),
                        lines[i + 1].strip(),
                        lines[i + 2].strip(),
                    )
                    if a == "The TDS return ecosystem" or a in H2 or not a:
                        break
                    if a == "Form" or a.startswith("The "):
                        break
                    if "Form" not in a and not a.startswith("Form"):
                        break
                    out.append(f"| {a} | {b} | {c} |")
                    i += 3
            out.append("")
            continue

        if s in ("Document",) and i + 1 < n and lines[i + 1].strip() == "Details":
            emit_table_2col_from_document_header()
            continue

        if s == "Filing Period" and i + 1 < n and "Additional" in lines[i + 1]:
            out.append("| Filing Period | Additional Tax on Underpaid Tax |")
            out.append("| --- | --- |")
            out.append(f"| {lines[i].strip()} | {lines[i+1].strip()} |")
            i += 2
            while i + 1 < n:
                a, b = lines[i].strip(), lines[i + 1].strip()
                if not a or a in H2:
                    break
                if a.startswith("Types ") or a == "Overview":
                    break
                out.append(f"| {a} | {b} |")
                i += 2
            out.append("")
            continue

        if s in ("Obligation", "Category", "Service", "Assessment Year", "Activity", "Quarter", "TDS/TCS Obligation", "Form", "Entity Type", "Entity / Activity", "Criterion", "Income Source", "Professional Service", "Government Fee", "Stage", "Applicant Type", "Applicant Category", "Income Source", "Entity Type", "The most common ITR-7 filers are:", "TDS Return Filing is mandatory for:", "TAN is mandatory for any person/entity who:", "ITR-4 (Sugam) is applicable for:", "Section", "ITR-5 is applicable for:", "ITR-6 is mandatory for:", "ITR-7 is applicable for:", "PAN is mandatory for:", "ITR-2 is applicable for:", "ITR-3 is applicable for:", "ITR-4 (Sugam) is applicable for:"):
            pass  # table header — fall through to generic table

        # Default: treat as paragraph or bullet list
        if s in (
            "Not required for:",
            "Not applicable for:",
            "ITR-U CANNOT be filed to:",
            "ITR-1 CANNOT be used if:",
            "ITR-2 CANNOT be used if:",
            "ITR-4 CANNOT be used if:",
        ):
            out.append(f"**{s}**" if s.endswith(":") else s)
            out.append("")
            i += 1
            continue

        if s in (
            "Form 15CA and 15CB are required for:",
            "ITR-U can be filed by:",
        ):
            out.append(f"{s}")
            out.append("")
            i += 1
            while i < n:
                t = lines[i].strip()
                if not t:
                    i += 1
                    if i < n and (lines[i].strip() in H2 or is_service_start(lines[i])):
                        break
                    out.append("")
                    break
                if t in H2 or t.startswith("ITR-U CANNOT") or t.startswith("Not "):
                    break
                if t.startswith("Applicable pan-India") or t.startswith("Applicable "):
                    out.append(t)
                    out.append("")
                    i += 1
                    break
                out.append(f"- {t}")
                i += 1
            continue

        out.append(s)
        i += 1
        if i < n and not lines[i].strip() and s.endswith("."):
            out.append("")

    return "\n".join(out) + "\n"


def main() -> None:
    text = RAW.read_text(encoding="utf-8", errors="replace")
    # strip junk after disclaimer
    if "All service content is for informational purposes" in text:
        text = text.split("All service content is for informational purposes", 1)[0]
    lines = text.splitlines()
    # remove leading <user_query> etc
    if lines and "BATCH 9" not in lines[0]:
        for i, ln in enumerate(lines):
            if ln.strip().startswith("BATCH 9:"):
                lines = lines[i:]
                break
    if lines[0].strip() == "BATCH 9: INCOME TAX SERVICES — Service Page Content":
        lines = lines[1:]

    starts: list[int] = []
    for i, ln in enumerate(lines):
        if is_service_start(ln):
            starts.append(i)

    OUT_DIR.mkdir(parents=True, exist_ok=True)

    for k, (idx, h1, fn) in enumerate(SERVICES):
        si = starts[k]
        end = starts[k + 1] if k + 1 < len(starts) else len(lines)
        title_line = lines[si]
        body = lines[si + 1 : end]
        body_md = convert_chunk([x.rstrip() for x in body], service_idx=idx)
        with open(OUT_DIR / fn, "w", encoding="utf-8") as f:
            f.write(f"# {h1}\n\n")
            f.write(body_md)
        if fn == "tds-return-filing.md":
            with open(OUT_DIR / fn, "a", encoding="utf-8") as f:
                f.write(f"\n---\n\n{DISCLAIMER}\n")

    print("Wrote", len(SERVICES), "files to", OUT_DIR)


if __name__ == "__main__":
    main()
