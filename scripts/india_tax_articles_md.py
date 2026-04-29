#!/usr/bin/env python3
"""Build GFM markdown for 8 India Tax Saving DOCX articles. Run from repo root."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
RAW = ROOT / "data" / "_extracted_tax_articles_raw.txt"
OUT = ROOT / "data" / "_tax_article_markdown_generated.json"

SECTION_H = re.compile(r"^\d+\.\s+[A-Za-z]")
QA_START = re.compile(r"^Q\d+\.\s+")
FAQ_SECTION_H = re.compile(r"^\d+\.\s+Frequently\s+Asked\s+Questions\s*$", re.I)


def pair_table(item_label: str, amount_label: str, pairs: list[tuple[str, str]]) -> str:
    return gfm([item_label, amount_label], [[a, b] for a, b in pairs])


def gfm(headers: list[str], rows: list[list[str]]) -> str:
    def e(c: str) -> str:
        return c.replace("\n", " ").strip()

    lines = [
        "| " + " | ".join(e(h) for h in headers) + " |",
        "| " + " | ".join(["---"] * len(headers)) + " |",
    ]
    for row in rows:
        pad = row + [""] * len(headers)
        lines.append("| " + " | ".join(e(pad[j]) for j in range(len(headers))) + " |")
    return "\n".join(lines)


def bullets(items: list[str]) -> str:
    return "\n".join(f"- {x.strip()}" for x in items if x.strip())


def faq(lines: list[str]) -> str:
    """First line of each block is the full question (may contain multiple ?)."""
    out = []
    i = 0
    while i < len(lines):
        if not QA_START.match(lines[i]):
            i += 1
            continue
        m = re.match(r"^(Q\d+\.\s+.*)$", lines[i].strip())
        if not m:
            i += 1
            continue
        q_line = m.group(1).strip()
        i += 1
        ans: list[str] = []
        while i < len(lines) and not QA_START.match(lines[i]):
            ans.append(lines[i])
            i += 1
        answer = "\n\n".join(a.strip() for a in ans if a.strip())
        out.append(f"**{q_line}**")
        if answer:
            out.append("\n\n" + answer)
        out.append("\n\n")
    return "".join(out).strip() + "\n"


def tbl_4(seg: list[str]) -> tuple[str | None, list[list[str]]]:
    """If seg starts with 4-cell header rows, consume table; else (None, [])."""
    if len(seg) < 8:
        return None, []
    h = seg[:4]
    rest = seg[4:]
    if not (
        "/" in h[0]
        or "Investment" in h[0]
        or ("Section" in h[0] and "What It Covers" in h[1] and len(h) >= 3)
        or ("Parameter" == h[0] and len(h) == 2)
    ):
        pass
    if not all(len(x.strip()) > 1 for x in h):
        return None, []
    rows = []
    for j in range(0, len(rest), 4):
        chunk = rest[j : j + 4]
        if len(chunk) < 4:
            break
        # stop if next section
        if SECTION_H.match(chunk[0]) or QA_START.match(chunk[0]):
            break
        rows.append(chunk)
    if not rows:
        return None, []
    used = 4 + 4 * len(rows)
    return "\n".join(seg[:used]), rows


def tbl_3(seg: list[str]) -> tuple[str | None, list[list[str]]]:
    if len(seg) < 6:
        return None, []
    h = seg[:3]
    rest = seg[3:]
    rows = []
    for j in range(0, len(rest), 3):
        chunk = rest[j : j + 3]
        if len(chunk) < 3:
            break
        if SECTION_H.match(chunk[0]) or QA_START.match(chunk[0]):
            break
        rows.append(chunk)
    if not rows:
        return None, []
    used = 3 + 3 * len(rows)
    return "\n".join(seg[:used]), rows


def section_body(heading: str, seg: list[str]) -> str:
    s = "\n".join(seg)

    # ----- Save-tax article tabular extracts -----
    if heading.startswith("1. Overview") and any(x == "Regime" for x in seg[:12]):
        try:
            ri = seg.index("Regime")
        except ValueError:
            pass
        else:
            pre = seg[:ri]
            chunk = seg[ri : ri + 15]
            if len(chunk) >= 15:
                hdr = chunk[:5]
                rows_st = [chunk[5:10], chunk[10:15]]
                tail = seg[ri + 15 :]
                out = ("\n\n".join(pre).strip() + "\n\n") if pre else ""
                out += gfm(hdr, rows_st)
                if tail:
                    out += "\n\n" + "\n\n".join(tail).strip()
                return out.strip() + "\n\n"

    if heading.startswith("3. Tax at Each Income Level") and seg[:4] == [
        "Income Level",
        "Applicable Slab Rate (New Regime)",
        "Approx. Tax Without Deductions",
        "Benefit of Rebate u/s 87A",
    ]:
        hdr = seg[:4]
        rest = seg[4:]
        rows_st = []
        i = 0
        while i + 4 <= len(rest):
            if SECTION_H.match(rest[i]):
                break
            rows_st.append(rest[i : i + 4])
            i += 4
        tail = rest[i:] if i < len(rest) else []
        out = gfm(hdr, rows_st).strip()
        if tail:
            out += "\n\n" + "\n\n".join(tail).strip()
        return out + "\n\n"

    # 4-col: Investment / Expenditure
    if (
        heading.startswith("3. Eligible Investments")
        and "Investment / Expenditure" in s
        and "Lock-in Period" in s
    ):
        idx = seg.index("Investment / Expenditure")
        sub = seg[idx:]
        end = next((k for k, ln in enumerate(sub) if ln.startswith("4. Example")), len(sub))
        block = sub[:end]
        hdr = block[:4]
        data = block[4:]
        rows = [data[i : i + 4] for i in range(0, len(data), 4)]
        pre = "\n\n".join(seg[: idx + 1 - 1]).replace(
            seg[idx - 1] + "\n" + seg[idx], seg[idx - 1]
        )
        # pre = text before table (paragraph)
        para = seg[:idx]
        return "\n\n".join(para).strip() + "\n\n" + gfm(hdr, rows) + "\n\n"

    # 4-col: Section / What It Covers / Max / Condition — home loan
    if heading.startswith("3. Deduction Limits") and "Condition" in (seg[:6] + [""]):
        try:
            idx = seg.index("Section")
        except ValueError:
            return "\n\n".join(seg) + "\n\n"
        block = seg[idx:]
        end = next((k for k, ln in enumerate(block) if ln.startswith("4. Example")), len(block))
        block = block[:end]
        if len(block) >= 8 and block[3] == "Condition":
            hdr = block[:4]
            data = block[4:]
            rows = [data[i : i + 4] for i in range(0, len(data), 4)]
            pre = seg[:idx]
            return "\n\n".join(pre).strip() + "\n\n" + gfm(hdr, rows) + "\n\n"

    # 3-col 80CCD
    if heading.startswith("3. Deduction Limits") and seg[:3] == ["Section", "What It Covers", "Maximum Deduction (Rs.)"]:
        block = seg
        note_idx = next((k for k, ln in enumerate(block) if ln.startswith("Note:")), len(block))
        main = block[:note_idx]
        note = block[note_idx:]
        hdr = main[:3]
        data = main[3:]
        rows_m = [data[i : i + 3] for i in range(0, len(data), 3)]
        return (
            gfm(hdr, rows_m).rstrip()
            + ("\n\n" + ("\n\n".join(note).strip()) if note else "")
            + "\n\n"
        )

    # 80GGC Parameter table (2 col)
    if heading.startswith("3. Deduction Limits") and "Parameter" in seg[:2]:
        idx = seg.index("Parameter")
        block = seg[idx:]
        end = next((k for k, ln in enumerate(block) if ln.startswith("4. Example")), len(block))
        block = block[:end]
        hdr = block[:2]
        data = block[2:]
        rows_raw = [data[i : i + 2] for i in range(0, len(data), 2)]
        prose = ""
        rows = []
        for r in rows_raw:
            if r[0].startswith("There is no cap"):
                prose = r[0] + ((" " + r[1]) if len(r) > 1 and r[1].strip() else "")
            else:
                rows.append(r)
        pre = seg[:idx]
        return (
            ("\n\n".join(pre).strip() + "\n\n" if pre else "")
            + gfm(hdr, rows)
            + ("\n\n" + prose if prose else "")
            + "\n\n"
        )

    # Personal loan 3-col purpose
    if (
        heading.startswith("2. Eligibility")
        and seg[:3] == ["Purpose of Loan", "Applicable Section", "Who Can Claim"]
    ):
        block = seg
        end = next((k for k, ln in enumerate(block) if ln.startswith("3. Scenarios")), len(block))
        main = block[:end]
        tail = block[end:]
        hdr = main[:3]
        data = main[3:]
        rows = [data[i : i + 3] for i in range(0, len(data), 3)]
        return gfm(hdr, rows) + "\n\n" + "\n\n".join(tail).strip() + "\n\n"

    if heading.startswith("3. Scenarios and Deduction Limits") and seg[:3] == [
        "Scenario",
        "Deductible Component",
        "Maximum Deduction",
    ]:
        idx = next((k for k, ln in enumerate(seg) if ln.startswith("4. Example")), len(seg))
        main = seg[:idx]
        tail = seg[idx:]
        hdr = main[:3]
        data = main[3:]
        rows_grid = [data[i : i + 3] for i in range(0, len(data), 3)]
        out = gfm(hdr, rows_grid) + "\n\n"
        tl = tail[1:] if tail and tail[0].startswith("4. Example Calculation") else tail  # noqa: E501
        joined = tl
        if "Scenario A:" in "\n".join(joined):
            sa_i = next(i for i, ln in enumerate(joined) if ln.startswith("Scenario A:"))
            sb_i = next(
                (i for i, ln in enumerate(joined) if ln.startswith("Scenario B:")),
                len(joined),
            )
            preamble = joined[:sa_i]
            blk_a = joined[sa_i:sb_i]
            blk_b = joined[sb_i:]
            pre_text = "\n\n".join(preamble).strip()
            scenario_a_intro = blk_a[0]
            idx_item = blk_a.index("Item")
            pairs_a = []
            j = idx_item + 2
            while j + 1 < len(blk_a):
                if blk_a[j].startswith("Scenario B"):
                    break
                pairs_a.append((blk_a[j], blk_a[j + 1]))
                j += 2
            out += pre_text + "\n\n" if pre_text else ""
            out += scenario_a_intro + "\n\n"
            kiran_para = "\n\n".join(blk_a[1:idx_item]).strip()
            if kiran_para:
                out += kiran_para + "\n\n"
            out += gfm(["Item", "Amount (Rs.)"], pairs_a) + "\n\n"
            if blk_b:
                out += "\n\n".join(blk_b).strip() + "\n\n"
        else:
            out += "\n\n".join(tail).strip() + "\n\n"
        return out

    # CEA Benefit Type 4-col
    if heading.startswith("3. Deduction Limits") and seg[:4] == [
        "Benefit Type",
        "Section",
        "Exemption / Deduction Limit",
        "Number of Children Covered",
    ]:
        note_idx = next((k for k, ln in enumerate(seg) if ln.startswith("Note:")), len(seg))
        main = seg[:note_idx]
        note = seg[note_idx:]
        hdr = main[:4]
        data = main[4:]
        rows = [data[i : i + 4] for i in range(0, len(data), 4)]
        return (
            gfm(hdr, rows)
            + "\n\n"
            + ("\n\n".join(note).strip() + "\n\n" if note else "")
        )

    # 80DD disability 3-col
    if heading.startswith("3. Deduction Limits") and seg[:3] == [
        "Disability Category",
        "Disability Percentage",
        "Flat Deduction (Rs.)",
    ]:
        idx = next((k for k, ln in enumerate(seg) if ln.startswith("4. Example")), len(seg))
        main = seg[:idx]
        tail = seg[idx:]
        hdr = main[:3]
        data = main[3:]
        rows = []
        if len(data) >= 6:
            rows.extend([data[0:3], data[3:6]])
        extra = []
        if len(data) > 6:
            extra = data[6:]
        out = gfm(hdr, rows)
        if extra:
            out += "\n\n" + " ".join(extra)
        return out + "\n\n" + "\n\n".join(tail).strip() + "\n\n"

    # 80CCD example — Deduction Head / Amount pairs
    if heading.startswith("4. Example Calculation") and "Rajesh is a freelance" in s:
        try:
            ip = seg.index("Deduction Head")
        except ValueError:
            pass
        else:
            if ip + 1 < len(seg) and seg[ip + 1] == "Amount (Rs.)":
                hdr0, hdr1 = seg[ip], seg[ip + 1]
                pairs_m: list[tuple[str, str]] = []
                j = ip + 2
                while j + 1 < len(seg):
                    if seg[j].startswith("By simply"):
                        break
                    pairs_m.append((seg[j], seg[j + 1]))
                    j += 2
                pre = "\n\n".join(seg[:ip]).strip()
                tail = seg[j:] if j < len(seg) else []
                return (
                    pre
                    + "\n\n"
                    + pair_table(hdr0, hdr1, pairs_m)
                    + "\n\n"
                    + "\n\n".join(tail).strip()
                    + "\n\n"
                )

    # Home loan Example — Annual Break-up
    if heading.startswith("4. Example Calculation") and "Annual Break-up" in s:
        ip = seg.index("Annual Break-up")
        pairs_m: list[tuple[str, str]] = []
        if ip + 1 < len(seg) and seg[ip + 1] == "Amount (Rs.)":
            j = ip + 2
            while j + 1 < len(seg):
                if seg[j].startswith("Notice that"):
                    break
                pairs_m.append((seg[j], seg[j + 1]))
                j += 2
            pre = "\n\n".join(seg[:ip]).strip()
            tail = seg[j:] if j < len(seg) else []
            return (
                pre
                + "\n\n"
                + pair_table("Line item", "Amount (Rs.)", pairs_m)
                + "\n\n"
                + "\n\n".join(tail).strip()
                + "\n\n"
            )

    # Children edu Example — Tax Benefit Claimed by Ramesh
    if heading.startswith("4. Example Calculation") and "Tax Benefit Claimed by Ramesh" in s:
        ip = seg.index("Tax Benefit Claimed by Ramesh")
        if ip + 1 < len(seg) and seg[ip + 1] == "Amount (Rs.)":
            pairs_m = []
            j = ip + 2
            while j + 1 < len(seg):
                if seg[j].startswith("Additionally"):
                    break
                pairs_m.append((seg[j], seg[j + 1]))
                j += 2
            pre = "\n\n".join(seg[:ip]).strip()
            tail = seg[j:] if j < len(seg) else []
            return (
                pre
                + "\n\n"
                + pair_table("Line item", "Amount (Rs.)", pairs_m)
                + "\n\n"
                + "\n\n".join(tail).strip()
                + "\n\n"
            )

    # 80C example mini-table
    if heading.startswith("4. Example Calculation") and "Investment Made by Priya" in s:
        try:
            ip = seg.index("Investment Made by Priya")
            hdr = [seg[ip], seg[ip + 1]]
            i = ip + 2
            rows_m = []
            while i + 1 < len(seg) and not seg[i].startswith("Tax saved"):
                rows_m.append([seg[i], seg[i + 1]])
                i += 2
            pre = seg[:ip]
            post = seg[i:]
            return (
                "\n\n".join(pre).strip()
                + "\n\n"
                + gfm(hdr, rows_m)
                + "\n\n"
                + "\n\n".join(post).strip()
                + "\n\n"
            )
        except (ValueError, IndexError):
            pass

    # 80GGC example 2-col
    if heading.startswith("4. Example Calculation") and "Gross Taxable Income" in s:
        try:
            ip = next(i for i, ln in enumerate(seg) if ln == "Item")
        except StopIteration:
            return "\n\n".join(seg) + "\n\n"
        if ip + 1 < len(seg) and seg[ip + 1] == "Amount (Rs.)":
            hdr = [seg[ip], seg[ip + 1]]
            i = ip + 2
            rows_m = []
            while i + 1 < len(seg):
                rows_m.append([seg[i], seg[i + 1]])
                i += 2
            pre = seg[:ip]
            return ("\n\n".join(pre).strip() + "\n\n" + gfm(hdr, rows_m) + "\n\n")

    # 80DD deepak example — Item | Amount style
    if heading.startswith("4. Example Calculation") and seg[0].startswith("Scenario"):
        try:
            ip = seg.index("Item")
        except ValueError:
            return "\n\n".join(seg) + "\n\n"
        hdr = [seg[ip], seg[ip + 1]]
        rest = seg[ip + 2 :]
        rows_m = []
        k = 0
        while k + 1 < len(rest):
            if rest[k].startswith("Tax Saved"):
                break
            rows_m.append([rest[k], rest[k + 1]])
            k += 2
        pre = seg[:ip]
        post = rest[k:]
        return (
            "\n\n".join(pre).strip()
            + "\n\n"
            + gfm(hdr, rows_m)
            + "\n\n"
            + "\n\n".join(post).strip()
            + "\n\n"
        )

    # Tips / mistakes: colon-separated lines as list
    if heading.startswith(("5. Optimization Tips", "6. Mistakes to Avoid")):
        merged = []
        buf = ""
        for ln in seg:
            if buf and (ln[0].islower() if ln else False):
                buf += " " + ln.strip()
            else:
                if buf:
                    merged.append(buf)
                buf = ln.strip()
        if buf:
            merged.append(buf)
        return bullets(merged) + "\n\n"

    # Eligibility: multi-block with "For Section" subheads
    if heading.startswith("2. Eligibility"):
        return "\n\n".join(seg) + "\n\n"

    return "\n\n".join(seg) + "\n\n"


def build(title: str, body: list[str]) -> str:
    parts = [f"# {title}\n\n"]
    i = 0
    while i < len(body) and not SECTION_H.match(body[i]):
        i += 1
    intro = body[:i]
    parts.append("\n\n".join(intro).strip() + "\n\n")
    rest = body[i:]
    i = 0
    while i < len(rest):
        ln = rest[i]
        if FAQ_SECTION_H.match(ln):
            i += 1
            parts.append("## Frequently Asked Questions\n\n")
            parts.append(faq(rest[i:]))
            return "".join(parts)
        if QA_START.match(rest[i]):
            parts.append("\n## Frequently Asked Questions\n\n")
            parts.append(faq(rest[i:]))
            return "".join(parts)
        if not SECTION_H.match(ln):
            i += 1
            continue
        parts.append(f"## {ln}\n\n")
        i += 1
        sec: list[str] = []
        while (
            i < len(rest)
            and not SECTION_H.match(rest[i])
            and not QA_START.match(rest[i])
            and not FAQ_SECTION_H.match(rest[i])
        ):
            sec.append(rest[i])
            i += 1
        parts.append(section_body(ln, sec))
    return "".join(parts)


def main() -> None:
    lines = [ln.rstrip() for ln in RAW.read_text(encoding="utf-8").split("\n")]
    starts = [0, 103, 170, 243, 316, 401, 484, 565]
    ids = [
        "section-80c-cornerstone-tax-planning-india",
        "section-80ccd-1b-nps-extra-50000-deduction",
        "section-80dd-disabled-dependent-tax-relief",
        "section-80ggc-political-party-donation-deduction",
        "home-loan-tax-benefits-claim-2024-25",
        "personal-loan-tax-benefits-when-save-tax",
        "children-education-allowance-tax-benefits-parents-india",
        "save-tax-every-income-level-india-10l-to-1cr",
    ]
    out = {}
    for ix, start in enumerate(starts):
        end = starts[ix + 1] if ix + 1 < len(starts) else len(lines)
        chunk = lines[start:end]
        title = chunk[0]
        body = chunk[1:]
        out[ids[ix]] = build(title, body)
    OUT.write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")
    print("Wrote", OUT)


if __name__ == "__main__":
    main()
