# GST e-way bill

## Overview

The **e-way bill** (Parts A and B) is a digital document for movement of goods, generated on the national e-way portal. **Rule 138** of the **CGST Rules** sets the framework. For a consignment above **₹50,000** in value, an e-way bill is generally required for movement by road, rail, air, or ship, subject to the notification list and state-specific rules (some states have different intra-state thresholds for certain years). The consignment value is typically taken to include **GST**; confirm your invoice structure with your adviser. Part A is the document and supply data; Part B is vehicle and transporter data. A unique **EBN** must be in order before the goods start moving in normal compliance. If there is no valid e-way, or the bill is wrong or expired, officers may act under **section 129** of the **CGST Act** (seizure and penalty patterns as per law and facts).

## Key features

- Central portal, **12-digit** EBN, and validity linked to distance in the usual case (one day for every 200 km on the road, with extensions in genuine delay).
- Part A can be created first; **Part B** (vehicle) must be updated for actual movement; transporters can update B.
- **Consolidated** e-way (CEWB) for one vehicle, multiple invoices, where the flow fits.
- **Cancellation** of an unused e-way within 24 hours of generation.
- **Exemptions** for listed goods, some job-work movements within 50 km intra-state, non-motorised cart, and other CBIC and state items (verify each time).

## Benefits

- Reduces ad hoc stoppage when data matches invoice and GSTR-1.
- Digital trail for enforcement and for your own audit of logistics.

## Process

1. Register on the e-way bill portal; integrate via API for high volume.
2. Generate **Part A** with document type, supplier and recipient **GSTIN**, HSN, value, and line items as the form requires.
3. Add **Part B** with transporter id or vehicle number before or as the consignment departs, as the rule expects.
4. The driver or transporter keeps the EBN (print or app); update B if the vehicle or transporter changes, including transhipment.
5. Extend validity in time for long routes or use the extension after exceptional delay as the portal allows.
6. If nothing moves, cancel within 24 hours.

## Documents

| Item | For |
|------|-----|
| Tax invoice, bill of supply, or **delivery challan** (e.g. job work, stock transfer) | Part A data |
| Supplier and recipient **GSTIN** | Validation |
| HSN, quantity, and consignment value | Part A |
| Transporter id or **vehicle** number | Part B |
| Bill of entry or customs lane | Import-linked movement where applicable |

## Fees (indicative)

| Item | |
|------|--|
| E-way on government portal | Nil |
| Set-up, training, or API integration (professional) | ₹2,000 – ₹50,000+ |
| Compliance audit, dispute on detention | ₹5,000 – ₹15,000+; seizure matters higher |

| Penalty (pattern) | |
|-------------------|--|
| No or invalid e-way in scope | **₹10,000** or **tax** **due,** **whichever** is **higher,** in common framing under section 129, plus follow-on release steps |

Professional fees are often excl. GST at 18%.

## Applicability

B2B, B2C, export, **SEZ**, job work, and branch and stock transfer between **GSTINs** of the same company, when the value and goods are in scope. Re-check the exempted goods notification and the state for intra-state threshold.

## Common mistakes (short)

- E-way generated only after the vehicle has left.
- HSN on e-way that does not match the invoice.
- Part B not filled when goods are in transit.
- E-way expired; no extension; treated like no e-way.
- Forgetting e-way for **inter-state** **stock** or **dealer** and **dealer** **moves** above **50,000** in value.

## Frequently asked questions

**Is value with GST?** The threshold is on the consignment. If your invoice total (taxable + tax) is above ₹50,000, the typical commercial reading is to treat it as in scope, even if the pre-tax part is less.

**Who generates in marketplace sales?** Depends on who causes the movement and the platform SOP. Bill-to / ship-to models have CBIC discussion; use the process your marketplace and counsel agree to.

**Vehicle changed mid-route?** Update Part B on the portal before the new vehicle runs a long open stretch; old vehicle number on a live truck is a red flag for officers.

**Job work?** Use delivery challan and e-way in line with the rules; 50 km principal–job worker relaxation exists in a narrow set of intra-state cases (check the state notification).

**Expired in flood?** Use extension in portal where possible, keep **force** **majeure** **evidence,** and document any detention for representation.

*All service content is for informational purposes. Specific GST advice should be obtained from qualified practitioners based on your business facts, transactions, and the law in force.*
