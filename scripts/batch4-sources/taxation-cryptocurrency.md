# Taxation of Cryptocurrency & Virtual Digital Assets in India (FY 2025-26)

## Article summary

India introduced a dedicated tax framework for Virtual Digital Assets (VDAs) - including cryptocurrency, NFTs, and other digital tokens - through Finance Act 2022, effective from AY 2022-23. Income from VDAs is taxed at a flat 30% (plus surcharge and 4% cess) regardless of the holding period or the investor's income level. A 1% TDS under Section 194S applies on VDA transactions above Rs. 10,000 per year. Loss from one VDA cannot be set off against gains from another, and no deductions except the cost of acquisition are allowed. This article explains every aspect of India's VDA tax regime for FY 2025-26.

## What are Virtual Digital Assets (VDAs)?

Section 2(47A) of the Income Tax Act defines Virtual Digital Asset to include: any information or code or number or token generated through cryptographic means or otherwise (Bitcoin, Ethereum, and all other cryptocurrencies), non-fungible tokens (NFTs), and any other digital asset notified by the Central Government. Traditional currencies (including digital forms of fiat currency like the RBI's Digital Rupee / e-Rupee) and gift cards are excluded from the VDA definition. The term 'cryptocurrency' is not used in the Income Tax Act - the law uses 'Virtual Digital Asset' as the umbrella term. All VDAs - regardless of their specific technology, use case (currency, utility token, governance token), or underlying blockchain - are covered by the same tax regime under Section 115BBH.

## The flat 30% tax rate: Section 115BBH

| Feature | Rule under Section 115BBH |
| --- | --- |
| Tax rate on VDA income | 30% flat rate - regardless of the investor's income tax slab or total income |
| Surcharge applicable | Yes - at normal rates (10% if income > Rs. 50L; 15% if > Rs. 1 crore; etc.) |
| Health & Education Cess | 4% on tax + surcharge |
| Holding period matters? | No - whether held for 1 day or 10 years, tax is always 30% |
| New tax regime vs old? | No difference - 30% flat rate applies regardless of regime chosen |
| Set-off of VDA loss against other income | PROHIBITED - VDA losses cannot reduce salary, business, or other income |
| Set-off of loss from one VDA against gain from another | PROHIBITED - even within VDAs, inter-asset loss set-off is not allowed |
| Carry forward of VDA losses | NOT PERMITTED - VDA losses lapse in the same year; cannot be carried forward |

## Important

The complete loss set-off prohibition is one of the harshest aspects of VDA taxation. If a taxpayer makes Rs. 1,00,000 profit on Bitcoin and Rs. 80,000 loss on Ethereum in the same year, the full Rs. 1,00,000 Bitcoin profit is taxable at 30% - the Ethereum loss provides zero relief. Each VDA transaction is effectively taxed in isolation.

## What counts as a taxable VDA event?

| Transaction type | Taxable? | Taxable amount |
| --- | --- | --- |
| Sale of crypto for INR (fiat currency) | Yes | Sale price minus cost of acquisition |
| Sale of crypto for USDT or other stablecoin | Yes | INR value of USDT received minus cost of acquisition |
| Crypto-to-crypto swap (BTC to ETH) | Yes | Fair market value of received crypto in INR minus cost of sold crypto |
| Purchase of goods/services using crypto | Yes | Fair market value of goods/services received minus cost of crypto used |
| Mining income (receiving crypto as mining reward) | Yes, at receipt | Fair market value on date of receipt - taxed as income |
| Staking rewards received | Yes, at receipt | Fair market value on date of receipt |
| Airdrop of free tokens | Yes, at receipt | Fair market value on date of receipt |
| Gifting crypto to another person | Yes, for giver | FMV on date of gift minus acquisition cost |
| Holding crypto (no sale/transfer) | No | Unrealised gains are NOT taxable |
| Transfer between own wallets | No | Not a transfer to another person - not taxable |

## TDS under Section 194S: 1% on VDA transactions

Section 194S requires any person paying consideration for transfer of a VDA to deduct TDS at 1% before making the payment. This applies to:

| Buyer category | TDS threshold | TDS rate |
| --- | --- | --- |
| Individual/HUF whose business/professional income exceeds Rs. 1 crore / Rs. 50 lakh | Rs. 10,000 per year per seller | 1% TDS on the transaction value |
| Any other buyer (including exchanges) | Rs. 50,000 per year per seller | 1% TDS |
| Crypto exchanges (acting as intermediary) | Per transaction as platform deductor | 1% TDS on gross transaction value; buyer responsible if exchange fails to deduct |

## Cost of acquisition: the only deductible expense

Section 115BBH allows only one deduction from VDA income: the cost of acquisition. No other deductions are permitted - not internet charges, not exchange fees, not transaction gas fees, not electricity costs for mining, not depreciation on mining hardware, not interest on loans taken to buy crypto. This is significantly more restrictive than other capital assets where various expenses can be deducted. For crypto received as salary, mining income, staking rewards, or airdrops - the FMV on the date of receipt is the cost of acquisition for the purpose of computing gains when subsequently sold.

## Crypto tax calculation: FY 2025-26

```
Taxpayer: Arjun | Other income: Rs. 15,00,000 (salary)
VDA TRANSACTIONS:
  Jan 2026: Bought 0.1 BTC at Rs. 30,00,000 (cost: Rs. 3,00,000)
  Feb 2026: Sold 0.1 BTC at Rs. 40,00,000 (profit: Rs. 1,00,000)
  Feb 2026: Bought Ethereum worth Rs. 2,00,000
  Mar 2026: Sold Ethereum at Rs. 1,50,000 (loss: Rs. 50,000)
BITCOIN GAIN:                              Rs. 1,00,000
ETHEREUM LOSS:                             Rs.   50,000
Set-off of Ethereum loss vs BTC gain:      NOT ALLOWED
TAXABLE VDA INCOME:                        Rs. 1,00,000
Tax @ 30%:                                 Rs.   30,000
Surcharge (income > Rs. 50L? No):          Nil
Cess @ 4%:                                 Rs.    1,200
Total Tax on VDA:                          Rs.   31,200
```

Ethereum loss of Rs. 50,000 is lost - cannot offset or carry forward.

## Gifts of crypto: tax in giver's and receiver's hands

If crypto is gifted to another person: (1) In the giver's hands: the gift is treated as a 'transfer' and capital gains arise - FMV on date of gift minus the giver's cost of acquisition, taxed at 30% under Section 115BBH. (2) In the receiver's hands: crypto received as a gift is taxable as 'Income from Other Sources' under Section 56(2)(x) if the FMV exceeds Rs. 50,000 and the receiver is not a specified relative. If from a relative (as defined under gift tax provisions), it is exempt. See the gift tax article for the complete relatives list.

## VDA reporting in ITR: Schedule VDA

From AY 2022-23, ITR forms include a dedicated 'Schedule VDA' where all VDA transactions must be reported. Each transaction must be listed with: asset type, date of acquisition, cost of acquisition, date of transfer, and sale consideration. Taxpayers with significant VDA activity must use ITR-2 or ITR-3 (depending on other income sources). The AIS (Annual Information Statement) pulls data from crypto exchanges that report transactions to the IT department - always reconcile your Schedule VDA with the AIS before filing.

## Pro tip

Use a crypto portfolio tracker (CoinTracker, Koinly, or similar tools) that supports India's tax regime and generates Schedule VDA-compatible reports. These tools automatically compute FIFO-based cost of acquisition across hundreds of transactions across multiple wallets and exchanges - essential for accurate VDA tax compliance.

## Key takeaways

1. VDA income (crypto, NFTs) is taxed at a flat 30% under Section 115BBH - regardless of holding period, slab, or tax regime chosen.
2. Loss from one VDA CANNOT be set off against gains from another VDA or any other income head - losses lapse permanently.
3. Only deductible expense is the cost of acquisition - exchange fees, mining costs, gas fees, and hardware are NOT deductible.
4. Section 194S mandates 1% TDS on VDA transactions exceeding Rs. 10,000/Rs. 50,000 per year - credit available in Form 26AS.
5. Crypto-to-crypto swaps, staking rewards, airdrops, mining income, and purchase of goods with crypto are all taxable events.
6. Gifting crypto creates a taxable event for the giver (30% on gains) and may be taxable for the receiver under Section 56(2)(x).
7. All VDA transactions must be reported in Schedule VDA in ITR-2 or ITR-3 - reconcile with AIS data from exchanges.

## Frequently asked questions

**Q1.** I bought Bitcoin in 2019 and sold it in 2025. Is my gain taxed at LTCG rate or 30%? At 30% flat rate under Section 115BBH. The holding period is completely irrelevant for VDA taxation - there is no LTCG/STCG distinction. Whether you held Bitcoin for 1 day or 10 years, the gain is taxed at 30% plus cess. The LTCG/STCG framework that applies to shares, property, and gold does NOT apply to VDAs.

**Q2.** I received crypto salary from my foreign employer. How is it taxed? Crypto received as salary is taxable as 'Salaries' at the FMV on the date of credit in INR. The employer should have withheld TDS (or the equivalent in the home country). Subsequently, when you sell the crypto, the gain (sale price minus FMV at receipt, which is your cost of acquisition) is taxed at 30% under Section 115BBH. So crypto salary faces two tax events: receipt (at slab rate as salary) and sale (at 30% on the subsequent gain).

**Q3.** My crypto exchange is based outside India and does not deduct TDS. What are my obligations? You are responsible for paying the tax directly even if no TDS is deducted. Compute your VDA gains for the year, pay advance tax by March 15 (or self-assessment tax before filing), and file the ITR with Schedule VDA disclosing all transactions. CBDT has been expanding data-sharing agreements with overseas exchanges and using AIS data - undisclosed VDA income discovered in scrutiny attracts 30% tax plus 200% penalty under the Black Money Act if it involves foreign assets.

**Q4.** Can I claim deduction for the losses made in the previous year on crypto? No. VDA losses from prior years cannot be carried forward to offset VDA gains in subsequent years. This is explicitly prohibited under Section 115BBH. Each financial year's VDA losses are permanently extinguished. This is in sharp contrast to stock market STCG/LTCG losses, which can be carried forward for 8 years.

**Q5.** I use USDT (a stablecoin pegged to USD) only for trading - never converting to INR. Are my trades taxable? Yes. Each crypto-to-crypto trade - including trades involving stablecoins like USDT - is a taxable event. When you sell Bitcoin and receive USDT, you must compute the INR value of the USDT received on that date and compare it against your Bitcoin cost of acquisition. The gain/loss in INR terms is taxable under Section 115BBH. The fact that you never directly received INR does not exempt the transaction.
