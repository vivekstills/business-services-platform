export type FAQ = { q: string; a: string };
export type FAQMap = Record<string, FAQ[]>;

const FAQS: FAQMap = {

  // ─── REGISTRATION ──────────────────────────────────────────────────────────

  'gst-registration': [
    {
      q: 'Who is required to register for GST mandatorily?',
      a: 'Any business whose aggregate turnover exceeds ₹20 Lakhs (₹10 Lakhs for hilly and North-Eastern states) in a financial year must register under GST. Additionally, businesses engaged in inter-state supply, e-commerce operators, casual taxable persons, and those required to pay tax under reverse charge must register regardless of turnover.',
    },
    {
      q: 'Can a business register for GST voluntarily even if below the threshold?',
      a: 'Yes. Voluntary GST Registration is permitted for any business, regardless of turnover. Voluntary registration allows you to claim Input Tax Credit (ITC) on your purchases and enhances credibility with clients and vendors.',
    },
    {
      q: 'What documents are required for GST Registration?',
      a: 'You will need: PAN card of the business/proprietor, Aadhaar card, proof of business registration (incorporation certificate, partnership deed, etc.), address proof of place of business (electricity bill, rent agreement), bank account details, and passport-size photograph of the authorised signatory.',
    },
    {
      q: 'How long does GST Registration take?',
      a: 'After submission of a complete application, GST Registration is typically granted within 3–7 working days. In case of deficiencies or queries raised by the officer, it may take up to 30 days.',
    },
    {
      q: 'What is the GST Registration number (GSTIN)?',
      a: 'GSTIN is a 15-digit unique identification number assigned to every GST-registered business. The first 2 digits represent the state code, the next 10 are the PAN, followed by entity number, Z by default, and a check digit.',
    },
    {
      q: 'Can a single PAN have multiple GST Registrations?',
      a: 'Yes. A business operating in multiple states must obtain a separate GST Registration for each state. Within the same state, a business with multiple verticals can optionally obtain separate registrations for each vertical.',
    },
  ],

  'professional-tax-registration': [
    {
      q: 'Which states levy Professional Tax in India?',
      a: 'Professional Tax is levied by Karnataka, West Bengal, Andhra Pradesh, Maharashtra, Tamil Nadu, Gujarat, Assam, Chhattisgarh, Kerala, Meghalaya, Orissa, Tripura and Madhya Pradesh. The rates, slabs and compliance timelines differ across these states.',
    },
    {
      q: 'What is the difference between PTEC and PTRC in Maharashtra?',
      a: 'PTEC (Professional Tax Enrolment Certificate) is obtained by a business entity or self-employed professional on their own account. PTRC (Professional Tax Registration Certificate) is obtained by employers who are liable to deduct and pay Professional Tax from salaries of their employees. Most businesses in Maharashtra need both.',
    },
    {
      q: 'Is Professional Tax applicable to Partnership Firms and LLPs?',
      a: 'In Maharashtra, Partnership Firms (including LLPs) are exempt from PTEC but must obtain PTRC if they employ any person — even part-time or contractual workers.',
    },
    {
      q: 'What is the maximum Professional Tax that can be charged?',
      a: 'The Constitution of India caps the maximum Professional Tax at ₹2,500 per year per person. Each state sets its own slab rates within this ceiling.',
    },
    {
      q: 'When must Professional Tax Returns be filed?',
      a: 'Filing frequency varies by state and category. In Maharashtra, PTRC return frequency (monthly or annually) depends on the annual liability. PTEC is typically paid annually. Non-filing attracts penalties and interest.',
    },
  ],

  'tan-registration': [
    {
      q: 'What is TAN and who needs it?',
      a: 'TAN (Tax Deduction and Collection Account Number) is a 10-character alphanumeric number required by every entity that is liable to deduct TDS (Tax Deducted at Source) or collect TCS (Tax Collected at Source) while making payments such as salaries, professional fees, contractor payments or rent above prescribed thresholds.',
    },
    {
      q: 'Is TAN mandatory for individuals?',
      a: 'Individuals and HUFs are not required to deduct TDS (and hence do not need TAN) unless their accounts are subject to tax audit under Section 44AB — i.e., their business turnover exceeds ₹2 crore or professional receipts exceed ₹50 lakhs.',
    },
    {
      q: 'What happens if TDS is deducted without TAN?',
      a: 'TDS deducted without a valid TAN cannot be deposited through a challan, TDS certificates cannot be issued, and TDS Returns cannot be filed. A penalty of up to ₹10,000 may be levied for failure to apply for TAN.',
    },
    {
      q: 'Can one entity have multiple TANs?',
      a: 'No. An entity is required to hold only one TAN. If a person has been allotted more than one TAN inadvertently, the extra TANs must be surrendered to the Income Tax Department.',
    },
    {
      q: 'How long does TAN Registration take?',
      a: 'TAN is usually allotted within 7–10 working days of submitting a complete application in Form 49B.',
    },
  ],

  'pf-registration': [
    {
      q: 'Which establishments are mandatorily required to register for PF?',
      a: 'All establishments employing 20 or more persons are mandatorily required to register under the Employees\' Provident Funds & Miscellaneous Provisions Act, 1952. Certain hazardous industries must register even with fewer employees.',
    },
    {
      q: 'Can an establishment with fewer than 20 employees register voluntarily?',
      a: 'Yes. Establishments with fewer than 20 employees can voluntarily register with EPFO. However, once registered voluntarily, all the statutory compliances under the Act become mandatory.',
    },
    {
      q: 'What is the rate of PF contribution?',
      a: 'Both the employer and employee contribute 12% of the employee\'s Basic Salary + Dearness Allowance + Retaining Allowance each. The employer\'s 12% is split — 3.67% goes to the EPF account and 8.33% goes to the EPS (Employees\' Pension Scheme).',
    },
    {
      q: 'What is the UAN (Universal Account Number)?',
      a: 'UAN is a 12-digit unique number allotted to each EPF member by EPFO. It remains the same throughout the employee\'s career, even when changing jobs. All PF accounts of an employee are linked under one UAN.',
    },
    {
      q: 'What is the wage ceiling for mandatory PF contribution?',
      a: 'Employees drawing wages up to ₹15,000 per month are mandatorily covered. Employees earning above ₹15,000 can opt-in with the employer\'s consent. Once a member, contributions continue even if salary rises above the ceiling.',
    },
    {
      q: 'When must PF contributions be deposited?',
      a: 'PF contributions must be deposited by the 15th of every month for the preceding month. Late deposits attract damages at 5% to 25% per annum and interest at 12% per annum.',
    },
  ],

  'esi-registration': [
    {
      q: 'Who is covered under the ESI scheme?',
      a: 'Employees earning wages up to ₹21,000 per month (₹25,000 for persons with disability) working in establishments with 10 or more employees are covered. The scheme applies to factories, shops, restaurants, hotels, cinemas, road transport and other establishments as notified.',
    },
    {
      q: 'What are the ESI contribution rates?',
      a: 'The employer contributes 3.25% of the employee\'s wages and the employee contributes 0.75% — totalling 4% of wages. Employees earning less than ₹176 per day are exempt from their own contribution but the employer still contributes.',
    },
    {
      q: 'What benefits do ESI-registered employees receive?',
      a: 'Covered employees and their dependents are entitled to: full medical care at ESI hospitals and dispensaries, sickness cash benefit (70% of wages for up to 91 days), maternity benefit (100% wages for 26 weeks), disablement benefit, dependent benefit (family pension on work-related death), and unemployment allowance.',
    },
    {
      q: 'When must ESI contributions be deposited?',
      a: 'ESI contributions must be deposited within 21 days of the end of the month to which they relate. Returns must be filed half-yearly (April–September and October–March).',
    },
    {
      q: 'Is ESI registration required if all employees are above ₹21,000 salary?',
      a: 'If all employees genuinely earn above ₹21,000, they fall outside the coverage wage ceiling. However, if even one employee earns ₹21,000 or below, the establishment must register and contribute for that employee.',
    },
  ],

  'import-export-code': [
    {
      q: 'Is IEC mandatory for all import/export businesses?',
      a: 'Yes, IEC is mandatory for every person or entity engaging in the import or export of goods. No person can import or export without a valid IEC, except for certain exempted categories such as government departments and personal use imports below a threshold.',
    },
    {
      q: 'What is the validity of an IEC?',
      a: 'IEC has lifetime validity and does not need to be renewed. However, it must be updated (details verified/confirmed) annually on the DGFT portal between April and June each year, failing which it may be deactivated.',
    },
    {
      q: 'Can a single person/company have multiple IECs?',
      a: 'No. Only one IEC is issued per PAN. A business entity can have only one IEC irrespective of the number of branches, divisions or locations.',
    },
    {
      q: 'Is IEC required for export of services?',
      a: 'IEC is not mandatory for export of services unless the service exporter wishes to avail benefits under the Foreign Trade Policy (FTP) such as SEIS, MEIS, etc. For goods export, IEC is always required.',
    },
    {
      q: 'How long does it take to get an IEC?',
      a: 'IEC is typically issued within 2–5 working days of submitting a complete online application on the DGFT portal with the required documents and payment of the government fee.',
    },
  ],

  'fssai-registration': [
    {
      q: 'Who needs FSSAI Registration?',
      a: 'Any person or business involved in the manufacturing, processing, storage, distribution, sale or import of food products requires an FSSAI licence or registration. This includes home bakers, cloud kitchens, restaurants, hotels, food processors and food importers.',
    },
    {
      q: 'What is the difference between FSSAI Registration, State Licence and Central Licence?',
      a: 'FSSAI Registration applies to small food businesses with annual turnover below ₹12 Lakhs. State Licence is for medium businesses with turnover between ₹12 Lakhs and ₹20 Crores. Central Licence is for large food businesses with turnover above ₹20 Crores, importers, and food businesses with operations in multiple states.',
    },
    {
      q: 'What is the validity of an FSSAI Licence?',
      a: 'FSSAI Registration/Licence is valid for 1 to 5 years as chosen by the applicant at the time of application. It must be renewed before expiry; operating with an expired licence is a punishable offence.',
    },
    {
      q: 'What are the penalties for operating without FSSAI Registration?',
      a: 'Operating a food business without FSSAI registration can attract a penalty of up to ₹5 Lakhs. Manufacturing or selling sub-standard or unsafe food carries penalties up to ₹10 Lakhs or imprisonment depending on the severity.',
    },
    {
      q: 'Does a home baker or small tiffin service need FSSAI Registration?',
      a: 'Yes. Any food business, including home-based ones, requires at minimum a Basic FSSAI Registration if annual turnover is below ₹12 Lakhs. Even if the business is run from home, it must comply with FSSAI regulations.',
    },
  ],

  'trade-license': [
    {
      q: 'What is a Trade Licence and why is it required?',
      a: 'A Trade Licence (also called Shop & Establishment Licence or Gumasta Licence in Maharashtra) is issued by the local municipal authority and permits a business to carry out trade or commerce in its jurisdiction. It regulates working hours, employment conditions, safety requirements and public health standards.',
    },
    {
      q: 'Is Trade Licence the same as GST Registration?',
      a: 'No. Trade Licence is a local body/municipal licence for operating a business premises. GST Registration is a central tax registration for levying and collecting Goods and Services Tax. Both are separate requirements and most businesses need both.',
    },
    {
      q: 'How long is a Trade Licence valid?',
      a: 'Trade Licences are typically valid for one financial year (April–March) and must be renewed annually before 31st March. Some states allow multi-year licences.',
    },
    {
      q: 'What documents are needed for a Trade Licence?',
      a: 'Typically required: identity and address proof of proprietor/directors, proof of business address (rent agreement/ownership documents), NOC from property owner, establishment photos, layout plan, and any sector-specific approvals (e.g. fire NOC for restaurants).',
    },
    {
      q: 'Does every type of business require a Trade Licence?',
      a: 'Most commercial establishments, retail shops, restaurants, manufacturing units and service businesses require a Trade Licence. Home-based businesses may be exempt in some states but should verify local municipal rules.',
    },
  ],

  'digital-signature': [
    {
      q: 'What is a Digital Signature Certificate (DSC)?',
      a: 'A DSC is an electronic form of a signature that authenticates the identity of the signer and ensures that the document has not been tampered with after signing. It is the digital equivalent of a physical signature and is legally recognised in India under the IT Act, 2000.',
    },
    {
      q: 'What is the difference between Class 2 and Class 3 DSC?',
      a: 'Class 2 DSC is used for filing returns with MCA, Income Tax, GST and other government portals. Class 3 DSC provides a higher level of security and is required for e-tendering, e-auctions, import-export DGFT filings and other high-security transactions.',
    },
    {
      q: 'What is a USB token and is it mandatory?',
      a: 'A USB token is a hardware device (like a pen drive) that stores the DSC securely. It is mandatory for using a DSC; the private key cannot be extracted from the token, ensuring security. The token must be inserted into the computer every time you sign a document.',
    },
    {
      q: 'What is the validity of a DSC?',
      a: 'DSCs are issued with a validity of 1 year or 2 years. They must be renewed before expiry. If a DSC expires, all signings become invalid until a new one is obtained.',
    },
    {
      q: 'Can one person hold multiple DSCs?',
      a: 'Yes. A person can hold multiple DSCs of different classes or for different purposes (e.g., one for MCA filings and one for DGFT). Each DSC is stored on a separate USB token.',
    },
  ],

  'health-license': [
    {
      q: 'Which businesses typically require a Health Licence?',
      a: 'Health Licences are typically required for eating establishments (restaurants, dhabas, canteens), meat shops, bakeries, dairy units, pan shops, hair salons, laundry services and other businesses that deal with food, public health or hygiene as notified under state municipal laws.',
    },
    {
      q: 'Is a Health Licence different from a Trade Licence?',
      a: 'Yes. A Trade Licence is a general permission to operate a business in a municipal area. A Health Licence is specifically required for establishments that deal with food, beverages or public hygiene. Many food businesses need both.',
    },
    {
      q: 'Who issues the Health Licence?',
      a: 'The Health Licence is issued by the Municipal Commissioner or the local body (municipal corporation/council/panchayat) in whose jurisdiction the business operates. The issuing authority and applicable rules vary by state and city.',
    },
    {
      q: 'How often must a Health Licence be renewed?',
      a: 'Health Licences are typically renewed annually. The renewal must be done before the expiry date to avoid penalties or closure orders from municipal health inspectors.',
    },
  ],

  // ─── FORM NEW BUSINESS ─────────────────────────────────────────────────────

  'proprietorship': [
    {
      q: 'What is a Proprietorship business?',
      a: 'A Proprietorship (or Sole Proprietorship) is a business owned and managed by a single individual. There is no legal distinction between the owner and the business. The proprietor is personally liable for all debts and obligations of the business.',
    },
    {
      q: 'Is a Proprietorship a separate legal entity?',
      a: 'No. A Proprietorship is not a separate legal entity. The business and the owner are the same person in the eyes of the law, meaning the proprietor has unlimited personal liability for all business debts.',
    },
    {
      q: 'What registrations does a Proprietorship need?',
      a: 'A Proprietorship should obtain: MSME/Udyog Aadhaar Registration (to establish business identity), GST Registration (if applicable), TAN (if required to deduct TDS), Trade Licence (if applicable in your city/trade), and a current account in the business name from a bank.',
    },
    {
      q: 'Can a Proprietorship be converted into a company later?',
      a: 'Yes. A Proprietorship can be converted into an OPC (One Person Company), a Private Limited Company or an LLP as the business grows. This allows access to better funding, limited liability and a more structured governance.',
    },
    {
      q: 'What is the tax treatment of a Proprietorship?',
      a: 'The income of a Proprietorship is taxed as the personal income of the proprietor at individual income tax slab rates. There is no separate tax return for the business — the proprietor files their own ITR (typically ITR-3 or ITR-4) and includes business income.',
    },
  ],

  'partnership': [
    {
      q: 'What is a Partnership firm and how many partners can it have?',
      a: 'A Partnership firm is formed when two or more persons agree to carry on a business together and share profits/losses. Under the Partnership Act, 1932, a banking business can have up to 10 partners and any other business can have up to 20 partners.',
    },
    {
      q: 'Is it mandatory to register a Partnership firm?',
      a: 'Registration of a Partnership firm is not compulsory under the Partnership Act, 1932. However, an unregistered firm cannot file a suit against third parties to enforce rights arising from a contract. It is strongly advisable to register.',
    },
    {
      q: 'What is a Partnership Deed?',
      a: 'A Partnership Deed is the written agreement between the partners that governs the firm. It covers the name and address of the firm, capital contributions, profit/loss sharing ratio, management responsibilities, bank account operation, admission/retirement of partners, and dissolution procedure.',
    },
    {
      q: 'Are partners personally liable for the firm\'s debts?',
      a: 'Yes. In a traditional Partnership firm, all partners have unlimited personal liability. Each partner is jointly and severally liable for all debts and obligations of the firm, including those arising from the actions of other partners.',
    },
    {
      q: 'How is a Partnership firm taxed?',
      a: 'A Partnership firm is taxed as a separate entity at a flat rate of 30% plus applicable surcharge and cess on its profits. Partners\' remuneration and interest on capital (within prescribed limits) are deductible and taxed in the hands of the partners.',
    },
  ],

  'one-person-company': [
    {
      q: 'What is a One Person Company (OPC)?',
      a: 'An OPC is a type of private limited company with only one shareholder (member). It was introduced by the Companies Act, 2013 to allow solo entrepreneurs to operate a formal, limited liability company without needing a second shareholder.',
    },
    {
      q: 'Who is eligible to form an OPC?',
      a: 'Only a natural person who is an Indian citizen and resident in India (has stayed in India for at least 120 days in the preceding financial year) can incorporate an OPC. A person can be the member of only one OPC at a time.',
    },
    {
      q: 'What is a Nominee in an OPC?',
      a: 'Every OPC must nominate a person who will become the sole member of the OPC in the event of the current member\'s death or incapacity. The nominee must also be an Indian citizen and resident.',
    },
    {
      q: 'Can an OPC be converted into a Private Limited Company?',
      a: 'Yes. An OPC must mandatorily convert into a Private Limited Company if its paid-up capital exceeds ₹50 Lakhs or its annual turnover exceeds ₹2 Crores. Voluntary conversion is also permitted at any time.',
    },
    {
      q: 'What are the compliance requirements for an OPC?',
      a: 'OPCs have lighter compliance than private limited companies. They are not required to hold an Annual General Meeting (AGM), and the Board\'s Report requirements are simplified. However, they must file annual returns and financial statements with the ROC and file income tax returns.',
    },
  ],

  'llp-registration': [
    {
      q: 'What is an LLP and how is it different from a Partnership firm?',
      a: 'An LLP (Limited Liability Partnership) is a hybrid entity combining the flexibility of a partnership with limited liability like a company. Unlike a traditional partnership firm, each partner\'s liability in an LLP is limited to their agreed contribution, and partners are not liable for other partners\' wrongful acts.',
    },
    {
      q: 'What is the minimum number of partners in an LLP?',
      a: 'An LLP must have at least 2 partners. There is no maximum limit on the number of partners. At least 2 partners must be designated partners (DPs), and at least one DP must be a resident of India.',
    },
    {
      q: 'Is an LLP a separate legal entity?',
      a: 'Yes. An LLP is a separate legal entity distinct from its partners. It can own property, enter into contracts, sue and be sued in its own name. It has perpetual succession, meaning it continues to exist regardless of changes in partners.',
    },
    {
      q: 'What is an LLP Agreement?',
      a: 'An LLP Agreement is the charter document that governs the mutual rights and duties of partners and between the partners and the LLP. It covers capital contributions, profit-sharing, management rights, admission of new partners and dissolution procedures.',
    },
    {
      q: 'What are the annual compliance requirements for an LLP?',
      a: 'LLPs must file: Form 8 (Statement of Account & Solvency) within 30 days of 6 months of financial year end, and Form 11 (Annual Return) within 60 days of the end of financial year. Income Tax Return must also be filed annually. LLPs with turnover above ₹40 Lakhs or capital above ₹25 Lakhs must also get accounts audited.',
    },
  ],

  'private-limited-company': [
    {
      q: 'What is a Private Limited Company?',
      a: 'A Private Limited Company is a company held privately by up to 200 members. It restricts the right to transfer shares and prohibits public subscription to its shares. It offers limited liability to shareholders and is a separate legal entity distinct from its owners.',
    },
    {
      q: 'What are the minimum requirements to incorporate a Private Limited Company?',
      a: 'You need: minimum 2 Directors (at least 1 must be a resident Indian), minimum 2 Shareholders (who can be the same as directors), a registered office address in India, DIN (Director Identification Number) for each director, and DSC (Digital Signature Certificate) for the proposed directors.',
    },
    {
      q: 'What are the annual compliance requirements?',
      a: 'A Private Limited Company must: hold Board Meetings (minimum 4 per year), file Annual Return (MGT-7) and Financial Statements (AOC-4) with ROC, get accounts audited by a Chartered Accountant, file Income Tax Return, and file other event-based forms as and when applicable.',
    },
    {
      q: 'Can a Private Limited Company raise funding from investors?',
      a: 'Yes. A Private Limited Company can raise funding through equity shares from angel investors, venture capital firms or private equity. It can issue shares, convertible notes and debentures. It cannot, however, invite the general public to subscribe to its shares.',
    },
    {
      q: 'What is the minimum paid-up capital required?',
      a: 'As per the Companies Act, 2013, there is no minimum paid-up capital requirement for a Private Limited Company. The company can start with any amount. However, authorised capital must be declared at the time of incorporation.',
    },
  ],

  'public-limited-company': [
    {
      q: 'How is a Public Limited Company different from a Private Limited Company?',
      a: 'A Public Limited Company can invite the general public to subscribe to its shares, has no restriction on share transferability, requires a minimum of 7 members and 3 directors (vs 2 each for a private company), and must issue a Prospectus. It has higher compliance requirements but greater access to capital.',
    },
    {
      q: 'What is the minimum paid-up capital for a Public Limited Company?',
      a: 'The minimum paid-up capital prescribed for a Public Limited Company is ₹5 Lakhs. The authorised capital at the time of incorporation should be at least this amount.',
    },
    {
      q: 'Can a Public Limited Company be listed on a stock exchange?',
      a: 'Yes, a Public Limited Company can apply for listing on BSE, NSE or other recognized stock exchanges after meeting SEBI and exchange-specific listing requirements. However, being a public limited company does not automatically mean it is listed.',
    },
    {
      q: 'What is a Prospectus?',
      a: 'A Prospectus is a formal document issued by a Public Limited Company when inviting the public to invest in its shares or debentures. It contains complete information about the company\'s financials, management, objectives and risks. SEBI regulates the issuance of prospectuses.',
    },
    {
      q: 'What are the additional compliance requirements compared to a Private Company?',
      a: 'Public Limited Companies must: hold mandatory AGM, comply with SEBI regulations if listed, maintain an index of members, have mandatory Audit Committee and other board committees if above a certain size, and comply with enhanced disclosure norms.',
    },
  ],

  'nidhi-company': [
    {
      q: 'What is a Nidhi Company?',
      a: 'A Nidhi Company is a type of Non-Banking Financial Company (NBFC) under Section 406 of the Companies Act, 2013. Its sole business is accepting deposits from and lending to its members, promoting thrift and savings among them. It operates on the principle of mutual benefit.',
    },
    {
      q: 'What are the minimum requirements to incorporate a Nidhi Company?',
      a: 'Minimum requirements: 7 shareholders, 3 directors, minimum net owned fund of ₹10 Lakhs, and within 1 year of incorporation it must have at least 200 members and maintain unencumbered term deposits of at least 10% of outstanding deposits.',
    },
    {
      q: 'Can a Nidhi Company accept deposits from non-members?',
      a: 'No. A Nidhi Company can only deal with its members. It cannot accept deposits from or lend to non-members. This is the fundamental principle that distinguishes it from a regular NBFC or bank.',
    },
    {
      q: 'Does a Nidhi Company require RBI approval?',
      a: 'No. Nidhi Companies do not require a licence from the Reserve Bank of India (RBI). However, they are regulated by the Ministry of Corporate Affairs (MCA) under the Companies Act and must comply with the Nidhi Rules, 2014.',
    },
    {
      q: 'What are the restrictions on a Nidhi Company?',
      a: 'A Nidhi Company cannot issue preference shares or debentures, carry on chit fund or hire-purchase activities, open current accounts for members, acquire other companies, advertise for deposits, and pay commission or brokerage for mobilising deposits.',
    },
  ],

  'producer-company': [
    {
      q: 'Who can form a Producer Company?',
      a: 'A Producer Company can be formed by: 10 or more individual producers (farmers, artisans, etc.), two or more producer institutions (farmer cooperatives, etc.), or a combination of both. All members must be involved in primary production activities.',
    },
    {
      q: 'What activities can a Producer Company undertake?',
      a: 'A Producer Company can carry out: production, harvesting, procurement, grading, pooling, handling, marketing, selling and export of primary produce of members; processing including preserving, drying and packaging; and supply of machinery, equipment or consumables to members.',
    },
    {
      q: 'What is the minimum capital required for a Producer Company?',
      a: 'The minimum paid-up share capital for a Producer Company is ₹5 Lakhs. Each equity share must have a minimum face value of ₹10.',
    },
    {
      q: 'How is a Producer Company taxed?',
      a: 'Producer Companies registered under the Companies Act are taxed as companies at the applicable corporate tax rate. However, income from certain agricultural activities may qualify for specific exemptions under the Income Tax Act.',
    },
    {
      q: 'Can a Producer Company become a public limited company?',
      a: 'No. A Producer Company can never be converted into or become a public limited company. It is always treated as a private limited company regardless of the number of members.',
    },
  ],

  'section-8-company': [
    {
      q: 'What is a Section 8 Company?',
      a: 'A Section 8 Company is a not-for-profit company registered under the Companies Act, 2013, whose objective is to promote commerce, science, arts, religion, charity, sports, education, social welfare or environment protection. Profits must be reinvested for these purposes and cannot be distributed as dividends.',
    },
    {
      q: 'What are the tax benefits of a Section 8 Company?',
      a: 'A Section 8 Company can apply for tax exemption under Section 12A and Section 80G of the Income Tax Act. Section 12A provides income tax exemption on surplus income. Section 80G allows donors to claim deduction on their donations to the company.',
    },
    {
      q: 'Does a Section 8 Company need a minimum share capital?',
      a: 'No. Unlike other companies, Section 8 Companies are specifically exempt from the minimum paid-up capital requirement under the Companies Act, 2013.',
    },
    {
      q: 'Who issues the licence for a Section 8 Company?',
      a: 'The licence for a Section 8 Company is issued by the Regional Director (RD) of the Ministry of Corporate Affairs. The licence can be revoked if the company contravenes its objects or violates the terms of the licence.',
    },
    {
      q: 'Can a Section 8 Company pay salaries to its employees and directors?',
      a: 'Yes. A Section 8 Company can pay reasonable salaries and remuneration to its employees and working directors. What it cannot do is distribute profits as dividends to its members. All income must be applied towards the stated charitable objectives.',
    },
  ],

  'indian-subsidiary-foreign-company': [
    {
      q: 'What is an Indian Subsidiary of a Foreign Company?',
      a: 'When a foreign company invests in and holds majority equity (more than 50%) in an Indian company, the Indian entity becomes its subsidiary. If the foreign company holds 100% equity, it is called a Wholly Owned Subsidiary (WOS).',
    },
    {
      q: 'What is the FDI automatic route?',
      a: 'Under the automatic route, foreign direct investment does not require prior approval from the RBI or the Government of India. For sectors where 100% FDI is permitted under the automatic route, a foreign company can directly invest in India by simply filing a post-investment notification with the RBI.',
    },
    {
      q: 'What documents are needed for foreign directors/shareholders?',
      a: 'Foreign nationals must provide: a notarised and apostilled Passport copy, proof of address (utility bill or bank statement notarised and apostilled/certified by Indian Consulate), and a signed copy of their consent to act as director/shareholder.',
    },
    {
      q: 'Is there any requirement to have an Indian director?',
      a: 'Yes. Under the Companies Act, 2013, every company incorporated in India must have at least one director who has stayed in India for a total of at least 182 days during the financial year.',
    },
    {
      q: 'What are the FEMA compliance requirements for an Indian subsidiary?',
      a: 'An Indian subsidiary receiving FDI must file: Form FC-GPR with the RBI within 30 days of allotment of shares, Annual Return on Foreign Liabilities and Assets (FLA), and other FEMA-related filings when repatriating dividends or making downstream investments.',
    },
  ],

  // ─── RETURN FILING ─────────────────────────────────────────────────────────

  'itr-1-filing': [
    {
      q: 'Who should file ITR-1 (SAHAJ)?',
      a: 'ITR-1 can be used by a resident individual (other than not-ordinarily resident) whose total income includes: salary or pension, income from one house property (without brought-forward losses), and income from other sources excluding winnings from lottery, race horses and certain special incomes. Total income must not exceed ₹50 Lakhs.',
    },
    {
      q: 'Can a salaried person with a home loan file ITR-1?',
      a: 'Yes, a salaried person with one house property (even with a home loan and interest deduction) can file ITR-1, as long as there is no brought-forward loss from house property and total income is within ₹50 Lakhs.',
    },
    {
      q: 'What is the due date for filing ITR-1?',
      a: 'For individuals not subject to audit, the due date is typically 31st July of the Assessment Year. If you miss this date, you can file a belated return by 31st December of the Assessment Year with a late fee of ₹1,000 to ₹5,000.',
    },
    {
      q: 'Is it mandatory to file ITR if income is below the taxable limit?',
      a: 'Filing is not mandatory if your income is below the basic exemption limit and you have no tax liability. However, filing is advisable for visa applications, loan processing, and claiming refunds of TDS deducted on bank interest etc.',
    },
    {
      q: 'What is Form 16 and do I need it to file ITR-1?',
      a: 'Form 16 is a TDS certificate issued by your employer showing your salary income and tax deducted. It is the primary document needed for ITR-1 filing by salaried individuals. Your employer must provide Form 16 by 15th June each year.',
    },
  ],

  'itr-2-filing': [
    {
      q: 'Who should file ITR-2?',
      a: 'ITR-2 should be used by individuals and HUFs who are not eligible for ITR-1 and do not have income from business or profession. It is for taxpayers with: income from more than one house property, capital gains (short or long term), foreign income or assets, or income exceeding ₹50 Lakhs.',
    },
    {
      q: 'Is capital gains income from selling shares covered in ITR-2?',
      a: 'Yes. Long-term capital gains (LTCG) and short-term capital gains (STCG) from sale of listed/unlisted shares, mutual funds, property and other assets are reported in ITR-2.',
    },
    {
      q: 'Can I claim foreign tax credit in ITR-2?',
      a: 'Yes. If you have paid taxes in a foreign country on income earned there, you can claim Foreign Tax Credit under Section 90/91 in ITR-2. You need to file Form 67 before filing the ITR to claim this credit.',
    },
    {
      q: 'Do I need to disclose foreign assets in ITR-2?',
      a: 'Yes. If you are a resident (and not not-ordinarily resident) and hold any foreign assets — bank accounts, investments, immovable property, ESOPs from foreign employers — you must disclose them in Schedule FA of ITR-2. Non-disclosure attracts heavy penalties under the Black Money Act.',
    },
  ],

  'itr-3-filing': [
    {
      q: 'Who must file ITR-3?',
      a: 'ITR-3 must be filed by individuals and HUFs who have income under the head "Profits or Gains of Business or Profession" and are not eligible to use ITR-4 (SUGAM). This includes professionals like doctors, lawyers and consultants, and business owners who maintain books of accounts.',
    },
    {
      q: 'What is the difference between ITR-3 and ITR-4?',
      a: 'ITR-4 (SUGAM) is for taxpayers opting for the presumptive taxation scheme under Sections 44AD, 44ADA or 44AE. ITR-3 is for all other business/professional income where actual books of accounts are maintained. If turnover exceeds ₹2 crore (business) or ₹50 lakhs (profession), ITR-3 is mandatory.',
    },
    {
      q: 'Is a tax audit required for ITR-3?',
      a: 'A tax audit under Section 44AB is required if: business turnover exceeds ₹1 crore (or ₹10 crore if 95%+ transactions are digital), or professional receipts exceed ₹50 lakhs. If audit is required, the audit report (Form 3CA/3CB + 3CD) must be filed before the ITR.',
    },
    {
      q: 'What is the due date for ITR-3 for business/professional income?',
      a: 'For taxpayers not requiring audit, the due date is 31st July. For taxpayers requiring a tax audit, the due date is 31st October of the Assessment Year (dates may be extended by government notifications).',
    },
  ],

  'itr-4-filing': [
    {
      q: 'What is the presumptive taxation scheme under Section 44AD?',
      a: 'Under Section 44AD, an eligible small business with turnover up to ₹3 crore (if 95%+ receipts are digital) can declare income at 8% of gross receipts (6% for digital receipts) without maintaining detailed books of accounts or undergoing audit.',
    },
    {
      q: 'Who is eligible to file ITR-4 (SUGAM)?',
      a: 'ITR-4 can be filed by individuals, HUFs and partnership firms (not LLPs) who opt for presumptive taxation under Sections 44AD, 44ADA or 44AE, and whose total income does not exceed ₹50 Lakhs, excluding income from capital gains, foreign assets, multiple house properties or speculative business.',
    },
    {
      q: 'What is Section 44ADA for professionals?',
      a: 'Under Section 44ADA, specified professionals (doctors, lawyers, architects, engineers, accountants, consultants, etc.) with gross receipts up to ₹75 Lakhs can declare 50% of their gross receipts as net income without maintaining books or audit.',
    },
    {
      q: 'If I opt for presumptive taxation, can I declare lower income?',
      a: 'Yes, but with consequences. If you declare income lower than the presumptive percentage, you must maintain books of accounts and get them audited under Section 44AB. Also, you cannot opt back for presumptive taxation for the next 5 years.',
    },
  ],

  'itr-5-filing': [
    {
      q: 'Who must file ITR-5?',
      a: 'ITR-5 must be filed by firms (registered or unregistered), LLPs, AOPs (Association of Persons), BOIs (Body of Individuals), artificial juridical persons, cooperative societies and registered societies — excluding those required to file under Section 139(4A) to 139(4D).',
    },
    {
      q: 'Is an LLP required to file ITR-5?',
      a: 'Yes. All LLPs must file their income tax return in Form ITR-5. The filing is mandatory irrespective of whether the LLP has income or a loss, and even if no tax is payable.',
    },
    {
      q: 'When must ITR-5 be filed?',
      a: 'For firms and LLPs not requiring audit, the due date is 31st July. For those requiring audit under Section 44AB, the due date is 31st October. For firms requiring transfer pricing audit, the due date is 30th November.',
    },
    {
      q: 'Can a firm with a loss file ITR-5?',
      a: 'Yes. It is important to file ITR-5 even in a loss year to carry forward the business loss for set-off against future years\' income. A loss cannot be carried forward if the return is filed after the due date.',
    },
  ],

  'itr-6-filing': [
    {
      q: 'Which companies must file ITR-6?',
      a: 'All companies registered in India must file ITR-6, except companies that claim exemption under Section 11 (income of religious and charitable trusts). This includes Private Limited Companies, Public Limited Companies, One Person Companies, Nidhi Companies, Producer Companies and Section 8 Companies (those not claiming Section 11 exemption).',
    },
    {
      q: 'Is e-filing with a digital signature mandatory for companies?',
      a: 'Yes. Companies are mandatorily required to file ITR-6 electronically using a Digital Signature Certificate (DSC). The return cannot be filed without a valid DSC of an authorised signatory.',
    },
    {
      q: 'What is the Minimum Alternate Tax (MAT) applicable to companies?',
      a: 'Companies whose tax liability is less than 15% of their book profits are required to pay MAT at 15% of book profits (plus surcharge and cess). The excess MAT paid over normal tax can be carried forward as MAT Credit for up to 15 years.',
    },
    {
      q: 'What is the due date for filing ITR-6?',
      a: 'The due date for companies requiring audit is 31st October of the Assessment Year. Companies requiring transfer pricing certification must file by 30th November. These dates may be extended by CBDT notifications.',
    },
  ],

  'itr-7-filing': [
    {
      q: 'Who must file ITR-7?',
      a: 'ITR-7 must be filed by entities required to file return under Sections 139(4A) to 139(4F) — including: trusts or institutions claiming exemption under Sections 11/12, political parties, research associations, news agencies, colleges and universities, mutual funds, infrastructure debt funds and other specified institutions.',
    },
    {
      q: 'What is the due date for filing ITR-7?',
      a: 'Entities requiring audit must file by 31st October. Those not requiring audit file by 31st July. Political parties must file by 31st October. Extensions may be granted by CBDT.',
    },
    {
      q: 'What happens if a trust does not file ITR-7?',
      a: 'Failure to file ITR-7 can result in: loss of tax exemption, penalty of ₹1,000 to ₹10,000, prosecution for wilful failure, and exposure of accumulated income to taxation at maximum marginal rate.',
    },
  ],

  'tds-return-filing': [
    {
      q: 'What is TDS and why must returns be filed?',
      a: 'TDS (Tax Deducted at Source) is tax deducted by the payer at the time of making certain payments. The deductor is required to deposit TDS with the government and file quarterly TDS Returns (Form 24Q for salary, 26Q for non-salary, 27Q for payments to non-residents) detailing the deductions made.',
    },
    {
      q: 'What are the due dates for filing TDS Returns?',
      a: 'Q1 (April–June): 31st July; Q2 (July–September): 31st October; Q3 (October–December): 31st January; Q4 (January–March): 31st May. Late filing attracts a fee of ₹200 per day under Section 234E (capped at the TDS amount) plus penalties.',
    },
    {
      q: 'What is Form 16 and Form 16A?',
      a: 'Form 16 is the TDS certificate issued by employers to employees for tax deducted on salary. Form 16A is the TDS certificate for non-salary payments (professional fees, rent, interest, etc.). These are generated from the TRACES portal after the TDS Return is filed and verified.',
    },
    {
      q: 'What happens if TDS is deducted but not deposited?',
      a: 'Non-deposit of TDS after deduction is a serious offence. It attracts: interest at 1.5% per month, penalty equal to the TDS amount, and prosecution with rigorous imprisonment of 3 months to 7 years under Section 276B of the Income Tax Act.',
    },
    {
      q: 'What is the TDS on rent under Section 194I?',
      a: 'TDS at 10% must be deducted on rent payments exceeding ₹2,40,000 per year for land/building/furniture/fittings (lower rates for plant and machinery). This applies to all persons (other than individuals/HUFs not subject to audit) paying such rent.',
    },
  ],

  // ─── GST SERVICES ──────────────────────────────────────────────────────────

  'gst-return-filing': [
    {
      q: 'Which GST returns must a regular taxpayer file?',
      a: 'A regular GST taxpayer must file: GSTR-1 (monthly/quarterly — details of outward supplies), GSTR-3B (monthly/quarterly summary return and tax payment), and GSTR-9 (annual return). Composition dealers file GSTR-4 annually.',
    },
    {
      q: 'What is the QRMP scheme?',
      a: 'The Quarterly Return Monthly Payment (QRMP) scheme allows taxpayers with aggregate turnover up to ₹5 crore to file GSTR-1 and GSTR-3B quarterly while paying tax monthly through a challan (PMT-06).',
    },
    {
      q: 'What is the penalty for late filing of GST returns?',
      a: 'Late fee for GSTR-3B is ₹50 per day (₹20 per day for nil return filers), capped at ₹10,000 per return. Interest at 18% per annum is charged on the outstanding tax. Late fee for GSTR-1 is ₹50 per day (₹20 for nil returns).',
    },
    {
      q: 'What is Input Tax Credit (ITC) and can I claim it if my supplier hasn\'t filed their return?',
      a: 'ITC is the credit you get for GST paid on purchases, which can be used to offset your output tax liability. ITC can only be claimed if: the supplier has filed their GSTR-1, the invoice appears in GSTR-2B, and you have received the goods/services and paid the invoice.',
    },
  ],

  'gst-refund': [
    {
      q: 'In which cases can a GST refund be claimed?',
      a: 'GST refunds can be claimed in cases of: export of goods/services (with payment of IGST), deemed exports, inverted duty structure (input tax rate higher than output tax rate), excess cash in electronic cash ledger, supplies to SEZ units/developers, and refund arising from assessment/appeal orders.',
    },
    {
      q: 'What is the time limit for claiming a GST refund?',
      a: 'A GST refund application must be filed within 2 years from the relevant date. The relevant date varies — for exports it is the date of export, for excess payment it is the date of payment.',
    },
    {
      q: 'How long does the GST refund process take?',
      a: 'GST refunds are to be processed within 60 days of the complete application. For exporters, provisional refund of 90% must be granted within 7 working days. Interest at 6% p.a. is payable if refund is delayed beyond 60 days.',
    },
  ],

  // ─── TRADEMARK ─────────────────────────────────────────────────────────────

  'trademark-registration': [
    {
      q: 'What can be registered as a Trademark?',
      a: 'A trademark can be any word, name, letter, numeral, device, brand, heading, label, combination of colours, shape, sound, or any combination thereof that is capable of distinguishing the goods/services of one business from another.',
    },
    {
      q: 'How long does Trademark Registration take in India?',
      a: 'After filing, a trademark application is typically examined within 3–6 months. If no objections are raised and no opposition is filed, registration is granted in approximately 12–18 months. Objections or oppositions can extend the process to 3–4 years.',
    },
    {
      q: 'What protection does a TM Registration provide?',
      a: 'A registered trademark gives you the exclusive right to use the mark for the goods/services it is registered for, the right to take legal action for infringement, and the ability to license or sell the mark. You can use the ® symbol only after registration.',
    },
    {
      q: 'What is the validity of a Trademark?',
      a: 'A registered trademark is valid for 10 years from the date of application. It can be renewed indefinitely for successive 10-year periods. If not renewed, the mark is removed from the register.',
    },
    {
      q: 'What is a Trademark class?',
      a: 'Trademark applications are filed under one or more of 45 classes defined under the Nice Classification. Classes 1–34 cover goods and classes 35–45 cover services. You must select the appropriate class(es) based on the nature of your business.',
    },
    {
      q: 'Can a trademark be used before it is registered?',
      a: 'Yes. You can use a mark and put the ™ symbol from the date of application. The ® symbol can only be used after registration. An unregistered mark may still get protection under common law, but registration provides stronger statutory rights.',
    },
  ],

  'trademark-objection': [
    {
      q: 'What is a Trademark Examination Report (Objection)?',
      a: 'After filing, the Trademark Registry examines the application. If the examiner finds grounds for objection — such as the mark being too similar to existing marks, being descriptive, or lacking distinctiveness — they issue an Examination Report (Objection) to the applicant.',
    },
    {
      q: 'How much time do I have to respond to a trademark objection?',
      a: 'You have 30 days from the date of receipt of the Examination Report to file a reply. If no reply is filed, the application is treated as abandoned.',
    },
    {
      q: 'What happens if my reply to the objection is not accepted?',
      a: 'If the examiner is not satisfied with your reply, a hearing is scheduled. You (or your trademark attorney) can appear before the Registrar and make oral arguments. If the Registrar is still not convinced, the application may be refused, which can be appealed to the IPAB/High Court.',
    },
  ],

  'trademark-renewal': [
    {
      q: 'When should a Trademark be renewed?',
      a: 'A trademark must be renewed within 6 months before its expiry date. The Registry also allows renewal within 6 months after expiry with an additional surcharge (this period is called the "within the period"). If not renewed, the mark is removed from the register.',
    },
    {
      q: 'What happens if a trademark is not renewed on time?',
      a: 'If renewal is not done within 12 months of expiry, the mark is removed from the register. Restoration is possible within 1 year from the date of removal by filing a restoration application with additional fees, but it is not guaranteed.',
    },
    {
      q: 'Is the renewal fee the same as the registration fee?',
      a: 'No. Renewal fees are prescribed by the Trademark Rules and differ from the original registration fees. Fees differ for individuals/start-ups/small enterprises versus others.',
    },
  ],

  // ─── LEGAL COMPLIANCE ──────────────────────────────────────────────────────

  'private-ltd-annual-compliance': [
    {
      q: 'What are the mandatory annual compliances for a Private Limited Company?',
      a: 'A Private Limited Company must: hold at least 4 Board Meetings per year, hold an Annual General Meeting within 6 months of year-end, file AOC-4 (Financial Statements) with ROC within 30 days of AGM, file MGT-7 (Annual Return) within 60 days of AGM, and file Income Tax Return by the due date.',
    },
    {
      q: 'What is the penalty for not filing annual returns with ROC?',
      a: 'Failure to file ROC annual returns attracts additional fees (₹100 per day per form after the due date), penalty on the company and its directors, and can lead to the company being struck off the register as a defunct company.',
    },
    {
      q: 'Is a statutory audit mandatory for Private Limited Companies?',
      a: 'Yes. Every Private Limited Company must get its financial statements audited by a practising Chartered Accountant every financial year, regardless of its turnover or profit/loss.',
    },
  ],

  'llp-annual-compliance': [
    {
      q: 'What annual filings must an LLP make?',
      a: 'An LLP must file: Form 11 (Annual Return) within 60 days of the end of financial year (by 30th May), Form 8 (Statement of Account and Solvency) within 30 days of the close of 6 months of the financial year (by 30th October), and Income Tax Return by the applicable due date.',
    },
    {
      q: 'Is a statutory audit compulsory for all LLPs?',
      a: 'An LLP is required to get its accounts audited only if its turnover exceeds ₹40 Lakhs or its capital contribution exceeds ₹25 Lakhs in any financial year. Below these thresholds, audit is not mandatory (though voluntary audit is advisable).',
    },
    {
      q: 'What is the penalty for not filing LLP annual returns?',
      a: 'Failure to file attracts additional fees of ₹100 per day per form. Persistent non-compliance can lead to penalties on the LLP and Designated Partners and action by the ROC.',
    },
  ],

  'name-change-company': [
    {
      q: 'What is the process for changing a company\'s name?',
      a: 'The process involves: checking availability of the new name on MCA, passing a Special Resolution by shareholders, filing Form MGT-14 (resolution) and INC-24 (name change application) with the ROC. If approved, a new Certificate of Incorporation is issued with the new name.',
    },
    {
      q: 'Can a company change its name to anything?',
      a: 'No. The new name must comply with the Companies Act naming guidelines — it must not be identical or too similar to any existing company/LLP, must not be prohibited/undesirable, and must contain the appropriate suffix (Pvt Ltd, Ltd, LLP, etc.).',
    },
    {
      q: 'Does a name change affect PAN, TAN or GST?',
      a: 'Yes. After the name change, you must update PAN, TAN, GST Registration, bank accounts, contracts, letterheads and all statutory registrations to reflect the new name.',
    },
  ],

};

export default FAQS;
