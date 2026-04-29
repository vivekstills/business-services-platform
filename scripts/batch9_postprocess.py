#!/usr/bin/env python3
"""Post-process batch-9 generated .md: tables, Process ol, FAQ bullets, spacing."""
from __future__ import annotations

import re
from pathlib import Path

DIR = Path("src/data/service-about/income-tax-batch-9")


def fix_process_section(text: str) -> str:
    def rep(m: re.Match) -> str:
        body = m.group(1)
        lines = [ln for ln in body.split("\n") if ln.strip()]
        out: list[str] = []
        for j, ln in enumerate(lines, start=1):
            s = ln.strip()
            if re.match(r"^Step \d+ —", s, re.I):
                out.append(f"{j}. {s}")
            else:
                out.append(f"{j}. {s}")
        return "\n## Process\n\n" + "\n".join(out) + "\n"

    return re.sub(
        r"## Process\n+((?:Step \d+ —[^\n]+(?:\n(?![#\n])[^\n]+)*?)+)",
        rep,
        text,
        flags=re.I | re.S,
    )


def two_col_table_after(header_pat: str, h1: str, h2: str, text: str) -> str:
    def rep(m: re.Match) -> str:
        pre = m.group(1)
        rest = m.group(2)
        rlines = rest.splitlines()
        rows: list[str] = []
        i = 0
        if not rlines:
            return m.group(0)
        if rlines[0].strip() == h1 and len(rlines) > 1 and rlines[1].strip() == h2:
            i = 2
        elif rlines[0].strip() == h1 and len(rlines) > 0:
            i = 1
        while i + 1 < len(rlines):
            a, b = rlines[i].strip(), rlines[i + 1].strip()
            if not a and not b:
                i += 1
                continue
            if a.startswith("##") or a.startswith("###") or a.startswith("Professional ") or a.startswith("Government ") or a.startswith("Late "):
                break
            if a in ("Obligation", "Category", "Service", "Government Fee", "Month", "Government Additional Tax", "Rate", "TDS Certificate Issuance", "TDS return due date (Section 234E)"):
                break
            if a.startswith("- ") or a.startswith("**"):
                break
            rows.append(f"| {a} | {b} |")
            i += 2
        if not rows:
            return m.group(0)
        table = f"| {h1} | {h2} |\n| --- | --- |\n" + "\n".join(rows)
        tail = "\n" + "\n".join(rlines[i:]) if i < len(rlines) else ""
        return f"{pre}{table}{tail}"

    return re.sub(
        rf"(## {header_pat}\n\n)(?!\| )(.+?)(?=\n## |\n### |$)",
        rep,
        text,
        flags=re.S,
    )


def fix_faq(text: str) -> str:
    def rep(m: re.Match) -> str:
        block = m.group(1)
        out = ["## Frequently asked questions", ""]
        for raw in block.strip().splitlines():
            t = raw.strip()
            if not t:
                continue
            m2 = re.match(r"^(\d+)\.\s+(.+)$", t, re.S)
            if not m2:
                out.append(f"- {t}")
                continue
            rest = m2.group(2).strip()
            # Last "? " before the answer (avoid first ? in e.g. "e.g. ...?")
            qm = re.match(r"^(.*\?)\s+(.+)$", rest, re.S)
            if qm:
                out.append(f"- **{qm.group(1).strip()}** {qm.group(2).strip()}")
            else:
                out.append(f"- {rest}")
        return "\n".join(out) + "\n"

    return re.sub(
        r"## Frequently [Aa]sked [Qq]uestions\n\n(.+?)(?=\n---\n|\Z)",
        rep,
        text,
        flags=re.S,
    )


def fix_itr1_applicability_table(text: str) -> str:
    if "itr-1" not in str(DIR) and "ITR-1" not in text[:500]:
        pass
    return re.sub(
        r"(ITR-1 can be filed by individuals who meet ALL of the following:)\nCriterion\nRequirement\n",
        r"\1\n\n| Criterion | Requirement |\n| --- | --- |\n",
        text,
    )


def fix_not_required_bullets(text: str) -> str:
    out = []
    in_nr = False
    for line in text.splitlines():
        if line.strip() == "**Not required for:**" or line.strip() == "Not required for:":
            in_nr = True
            out.append(line)
            continue
        if in_nr and line.strip() and not line.strip().startswith("-") and not line.strip().startswith("|"):
            if line.strip().startswith("##") or line.strip().startswith("**Applicable"):
                in_nr = False
                out.append(line)
            else:
                out.append(f"- {line.strip()}")
        else:
            if line.strip().startswith("##") or (in_nr and line.strip().startswith("Applicable pan-India")):
                in_nr = False
            out.append(line)
    return "\n".join(out)


def ensure_blank_before_h2(text: str) -> str:
    return re.sub(r"([^\n])\n(## )", r"\1\n\n\2", text)


def move_fees_footer_out_of_table(t: str) -> str:
    return re.sub(
        r"\n\|  \| (Professional fees exclusive[^\n|]+) \|",
        r"\n\n\1",
        t,
    )


def fix_errors_section(t: str) -> str:
    def rep(m: re.Match) -> str:
        body = m.group(1)
        lines = [ln.strip() for ln in body.splitlines() if ln.strip() and not ln.strip().startswith("##")]
        bul = [f"- {ln}" for ln in lines if ln]
        return "## Errors\n\n" + "\n".join(bul) + "\n\n"

    return re.sub(
        r"## Errors\n\n((?:[^\n#][^\n]*\n?)+?)(?=\n## |\Z)",
        rep,
        t,
        flags=re.S,
    )


def run_file(p: Path) -> None:
    t = p.read_text(encoding="utf-8")
    t = fix_itr1_applicability_table(t)
    t = fix_not_required_bullets(t)
    t = two_col_table_after("Fees", "Service", "Estimated Professional Fee", t)
    t = two_col_table_after("Fees", "Service", "Government Fee", t)  # PAN has Gov / Prof split
    t = two_col_table_after("Deadlines", "Obligation", "Deadline", t)
    t = two_col_table_after("Deadlines", "Category", "Due Date", t)
    t = two_col_table_after("Deadlines", "Assessment Year", "ITR-U Filing Deadline (4-year window)", t)
    t = two_col_table_after("Deadlines", "Activity", "Deadline / Note", t)
    t = two_col_table_after("Deadlines", "Quarter", "TDS Return Due Date", t)
    t = two_col_table_after("Deadlines", "TDS Certificate Issuance", "Due Date", t)
    t = move_fees_footer_out_of_table(t)
    t = fix_errors_section(t)
    t = fix_faq(t)
    # Re-process: split Process that starts with "Step" lines into ol
    t = re.sub(
        r"## Process\n\n((?:Step \d+ —[^\n]+\n?)+)",
        lambda m: "## Process\n\n"
        + "\n".join(
            f"{i+1}. {ln.strip()}"
            for i, ln in enumerate(m.group(1).strip().splitlines())
        )
        + "\n\n",
        t,
    )
    t = ensure_blank_before_h2(t)
    p.write_text(t, encoding="utf-8")
    print("postprocessed", p.name)


def main() -> None:
    for p in sorted(DIR.glob("*.md")):
        if p.name.startswith("_"):
            continue
        run_file(p)


if __name__ == "__main__":
    main()
