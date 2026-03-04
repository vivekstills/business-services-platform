export type ServicePackage = {
  name: string;
  price: string;
  description: string;
};

export type Service = {
  id: string;
  name: string;
  mainHead: string; // e.g. REGISTRATION, FORM NEW BUSINESS, RETURN FILING
  categoryId: string; // used for top navigation grouping
  shortDescription?: string;
  content: string;
  packages: ServicePackage[];
};

export type ServiceCategory = {
  id: string;
  title: string;
  description: string;
};

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: 'registration',
    title: 'Registration',
    description: 'Core business registrations like GST, Trade, FSSAI, IEC and statutory licenses.'
  },
  {
    id: 'new-business',
    title: 'Form New Business',
    description: 'End‑to‑end support to set up proprietorships, partnerships, LLPs and companies.'
  },
  {
    id: 'return-filing',
    title: 'Return Filing',
    description: 'Income tax and TDS return filing for individuals and businesses.'
  },
  {
    id: 'hr-compliance',
    title: 'PF & ESI',
    description: 'Employee‑related PF and ESI registration and compliance.'
  },
  {
    id: 'gst-services',
    title: 'GST Services',
    description: 'GST registrations, returns, advisory, refunds, LUT and related services.'
  },
  {
    id: 'income-tax',
    title: 'Income Tax',
    description: 'PAN/TAN assistance and income tax compliance for individuals and entities.'
  },
  {
    id: 'ngo-registrations',
    title: 'NGO & Trusts',
    description: 'Trust, society and NGO‑related registrations and tax exemptions.'
  },
  {
    id: 'international-incorporations',
    title: 'International Incorporations',
    description: 'Company formation in USA, UK, Dubai, Singapore and other jurisdictions.'
  },
  {
    id: 'trademark-ip',
    title: 'Trademark & IP',
    description: 'Trademark, copyright, design and patent protection services.'
  },
  {
    id: 'legal-compliance',
    title: 'Legal & Corporate',
    description: 'Annual, corporate, conversion and other legal compliance services.'
  },
  {
    id: 'liquor-licenses',
    title: 'Liquor Licenses',
    description: 'Excise and liquor licensing for events, shops, clubs and restaurants.'
  },
  {
    id: 'mandatory-licenses',
    title: 'Mandatory Licenses',
    description: 'Factory, labour, environment and other statutory operating licences.'
  },
  {
    id: 'web-digital',
    title: 'Web & Digital',
    description: 'Website, app development, SEO and ongoing maintenance services.'
  }
];

export const SERVICES: Service[] = [
  // REGISTRATION – GST Registration
  {
    id: 'gst-registration',
    name: 'GST Registration',
    mainHead: 'REGISTRATION',
    categoryId: 'registration',
    shortDescription:
      'Mandatory and voluntary GST registration support with ongoing compliance options.',
    content:
      'GST Registration is mandatory for all the businesses engaged in supply of goods or services exceeding the aggregate turnover of Rs.20 Lakhs (Rs.10 Lakhs for Hilly & North Eastern States). GST is the biggest tax reform in the indirect tax structure of India and has replaced various state and central indirect taxes since 01/07/2017. From 01/04/2019, the threshold for mandatory registration has been doubled by the GST Council.\n\nThere are also categories of businesses which require compulsory GST registration irrespective of the aggregate turnover limits. Businesses can additionally opt for voluntary registration to enhance their credibility, discharge GST liabilities by filing returns and claim input tax credit on eligible purchases from GST registered dealers. If a business is not registered, tax paid on purchases becomes a cost instead of credit.\n\nWe provide expert guidance and end‑to‑end support for obtaining smooth GST Registration and managing various GST compliances for your business.',
    packages: [
      {
        name: 'Standard',
        price: '₹4,500',
        description:
          'Full expert support and guidance until receipt of GST Registration along with MSME Registration for Micro, Small & Medium Enterprises. All‑inclusive fees and applicable taxes.'
      },
      {
        name: 'Deluxe',
        price: '₹7,500',
        description:
          'Everything in Standard plus filing of GST Returns for 3 months along with MSME Registration. All‑inclusive fees and applicable taxes.'
      },
      {
        name: 'Premium',
        price: '₹10,500',
        description:
          'Everything in Standard plus filing of GST Returns for 6 months along with MSME Registration. All‑inclusive fees and applicable taxes.'
      }
    ]
  },

  // REGISTRATION – Professional Tax Registration
  {
    id: 'professional-tax-registration',
    name: 'Professional Tax Registration',
    mainHead: 'REGISTRATION',
    categoryId: 'registration',
    shortDescription:
      'State‑specific Professional Tax registration including PTEC and PTRC where applicable.',
    content:
      'Professional Tax is a tax levied by various state governments on trades, professions, callings and employments. States such as Karnataka, West Bengal, Andhra Pradesh, Maharashtra, Tamil Nadu, Gujarat, Assam, Chhattisgarh, Kerala, Meghalaya, Orissa, Tripura and Madhya Pradesh levy Professional Tax with their own rules and slab structures.\n\nFor example, an entity operating in Maharashtra may need two registrations – PTEC (Professional Tax Enrolment Certificate) and PTRC (Professional Tax Registration Certificate) when it employs staff. PTEC is exempt for certain entities like partnership firms (including LLP) and HUF, but PTRC is compulsory once any employee is appointed, whether part‑time, full‑time or on wages.\n\nWe provide expert guidance on applicability, state‑wise rules and full support in obtaining Professional Tax registrations for your business.',
    packages: [
      {
        name: 'Standard',
        price: '₹8,500',
        description:
          'Expert support until receipt of Professional Tax Registration Certificates for up to 3 additional places of business in the state and up to 4 directors.'
      },
      {
        name: 'Deluxe',
        price: '₹11,500',
        description:
          'Everything in Standard for up to 10 additional places of business and up to 8 directors, plus filing of Professional Tax Returns for 3 months.'
      },
      {
        name: 'Premium',
        price: '₹15,500',
        description:
          'Everything in Standard for up to 20 additional places of business and up to 12 directors, plus filing of Professional Tax Returns for 6 months.'
      }
    ]
  },

  // REGISTRATION – TAN Registration
  {
    id: 'tan-registration',
    name: 'TAN Registration',
    mainHead: 'REGISTRATION',
    categoryId: 'registration',
    shortDescription:
      'TAN registration for TDS/TCS compliance on salaries, professional fees, rent and other payments.',
    content:
      'TAN stands for Tax Deduction and Collection Account Number. It is mandatory for proprietorships and other entities such as firms, HUFs and companies that are required to deduct Tax Deducted at Source (TDS) or collect Tax Collected at Source (TCS) on specified payments like salaries, professional fees, contractor payments, rent, etc., beyond prescribed thresholds.\n\nWithout a valid TAN, an entity cannot properly deduct or deposit TDS/TCS or issue valid certificates to deductees within the timelines mandated under the Income Tax Act.\n\nWe offer expert guidance and complete support for obtaining TAN Registration quickly and correctly.',
    packages: [
      {
        name: 'Standard',
        price: '₹2,500',
        description: 'Full support and guidance until receipt of TAN Registration.'
      },
      {
        name: 'Deluxe',
        price: '₹8,500',
        description:
          'Standard package plus filing of one year of TDS Returns for your TAN.'
      },
      {
        name: 'Premium',
        price: '₹15,500',
        description:
          'Standard package plus one year of TDS Returns, PAN Registration and GST Registration.'
      }
    ]
  },

  // REGISTRATION – PF Registration
  {
    id: 'pf-registration',
    name: 'PF Registration',
    mainHead: 'REGISTRATION',
    categoryId: 'hr-compliance',
    shortDescription:
      'EPF registration for establishments with 20 or more employees or voluntary coverage.',
    content:
      'The Employees’ Provident Fund (EPF) framework is governed by the Employees’ Provident Funds & Miscellaneous Provisions Act, 1952 and administered by the Employees’ Provident Fund Organisation (EPFO) under the Ministry of Labour and Employment, Government of India.\n\nPF Registration is compulsory for establishments employing 20 or more persons, though voluntary registration is also permitted. Once registered, all statutory compliances under the Act must be followed. PF contributions are calculated on the basic salary (including DA and retaining allowance). Employers and employees each contribute 12% in aggregate, which is deposited into the 12‑digit Universal Account Number (UAN) of each employee.\n\nWe provide expert support for assessing applicability and obtaining PF Registration for your establishment.',
    packages: [
      {
        name: 'Standard',
        price: '₹8,500',
        description:
          'PF Registration support for businesses having fewer than 25 employees.'
      },
      {
        name: 'Deluxe',
        price: '₹16,500',
        description:
          'PF Registration support for businesses having fewer than 50 employees.'
      },
      {
        name: 'Premium',
        price: '₹30,000',
        description:
          'PF Registration support for businesses having more than 50 employees.'
      }
    ]
  },

  // REGISTRATION – ESI Registration
  {
    id: 'esi-registration',
    name: 'ESI Registration',
    mainHead: 'REGISTRATION',
    categoryId: 'hr-compliance',
    shortDescription:
      'ESI registration for eligible establishments and employees under the ESI Act, 1948.',
    content:
      'Employees’ State Insurance (ESI) is a self‑financing social security and health insurance scheme for Indian workers, managed by the Employees’ State Insurance Corporation (ESIC) under the ESI Act, 1948. Initially applicable to factories, it now extends to establishments employing 10 or more workers.\n\nFor employees earning up to Rs.21,000 per month, the employer contributes 4% of wages and the employee contributes 1%, making a total of 5%. Registered employees and their dependents are entitled to medical treatment, cash benefits, maternity benefits, unemployment benefits, disablement benefits and family pensions, through a large network of ESI hospitals, dispensaries and centers.\n\nWe provide expert guidance and complete support in obtaining ESI Registration tailored to your establishment and workforce.',
    packages: [
      {
        name: 'Standard',
        price: '₹8,500',
        description:
          'ESI Registration support for businesses having fewer than 25 employees.'
      },
      {
        name: 'Deluxe',
        price: '₹16,500',
        description:
          'ESI Registration support for businesses having fewer than 50 employees.'
      },
      {
        name: 'Premium',
        price: '₹30,000',
        description:
          'ESI Registration support for businesses having more than 50 employees.'
      }
    ]
  },

  // REGISTRATION – Import Export Code
  {
    id: 'import-export-code',
    name: 'Import Export Code (IEC)',
    mainHead: 'REGISTRATION',
    categoryId: 'registration',
    shortDescription:
      'IEC code registration for businesses engaged in import and export of goods.',
    content:
      'Import Export Code (IEC) is mandatory for every business in India engaged in the import or export of goods. It is issued by the Directorate General of Foreign Trade (DGFT) through its regional offices and generally has lifetime validity.\n\nIEC must be quoted on all import/export documents at the time of customs clearance and is also required by banks when processing import/export transactions for an enterprise.\n\nWe provide expert guidance and end‑to‑end support in obtaining Import Export Code for your business.',
    packages: [
      {
        name: 'Standard',
        price: '₹5,000',
        description:
          'Full support until receipt of IEC without Digital Signature.'
      },
      {
        name: 'Deluxe',
        price: '₹7,500',
        description:
          'IEC with a 2‑year Class 2 Digital Signature for online filings.'
      },
      {
        name: 'Premium',
        price: '₹10,000',
        description:
          'IEC with a 1‑year Class 3 Digital Signature for high‑security filings.'
      }
    ]
  },

  // REGISTRATION – FSSAI Registration
  {
    id: 'fssai-registration',
    name: 'FSSAI Registration',
    mainHead: 'REGISTRATION',
    categoryId: 'registration',
    shortDescription:
      'Food business registration and licensing (Registration, State and Central License).',
    content:
      'The Food Safety and Standards Authority of India (FSSAI) is an autonomous body under the Ministry of Health & Family Welfare, established under the Food Safety and Standards Act, 2006. FSSAI is responsible for protecting and promoting public health through the regulation and supervision of food safety in India.\n\nFSSAI issues three types of licenses based on the nature and turnover of a food business: Registration for turnover below Rs.12 Lakhs, State License for turnover between Rs.12 Lakhs and Rs.20 Crores, and Central License for turnover above Rs.20 Crores. Additional criteria such as business location and number of outlets are also considered.\n\nWe provide expert guidance and support in identifying the correct category and obtaining the FSSAI Registration or License for your food business.',
    packages: [
      {
        name: 'Standard',
        price: '₹12,500',
        description:
          'Support until receipt of State FSSAI Registration for food manufacturers, hotels, restaurants, milk processing units and similar businesses.'
      },
      {
        name: 'Deluxe',
        price: '₹16,500',
        description:
          'Support until receipt of Central FSSAI Registration for large food manufacturers, large units, export units and large food businesses.'
      },
      {
        name: 'Premium',
        price: '₹20,500',
        description:
          'Central FSSAI Registration plus Import Export Code for eligible food businesses.'
      }
    ]
  },

  // REGISTRATION – Trade License
  {
    id: 'trade-license',
    name: 'Trade License',
    mainHead: 'REGISTRATION',
    categoryId: 'registration',
    shortDescription:
      'Municipal trade/shop license (e.g. Gumasta) for local business operations.',
    content:
      'Trade License is required to undertake business within the municipal limits of a particular state or city. It is usually issued by the Municipal Commissioner where the establishment is located and is mandatory for many establishments, restaurants and eating houses, subject to state‑wise exemptions.\n\nRules around working hours, employment conditions, record‑keeping, safety standards and employer‑employee obligations are governed by state‑specific Shops and Establishments or municipal laws. Trade License (e.g. Gumasta License in Maharashtra) ensures that businesses comply with these regulations.\n\nWe provide Trade License services across India for all types of businesses, handling documentation, applications and coordination with authorities.',
    packages: [
      {
        name: 'Standard',
        price: '₹10,500',
        description:
          'Full support until receipt of Trade License for one business location.'
      },
      {
        name: 'Deluxe',
        price: '₹15,500',
        description:
          'Trade License for one business location along with GST Registration.'
      },
      {
        name: 'Premium',
        price: '₹18,500',
        description:
          'Trade License for one business location plus GST Registration and GST Return filing for 3 months.'
      }
    ]
  },

  // REGISTRATION – Digital Signature
  {
    id: 'digital-signature',
    name: 'Digital Signature Certificate (DSC)',
    mainHead: 'REGISTRATION',
    categoryId: 'registration',
    shortDescription:
      'Class II and Class III Digital Signature Certificates with USB tokens.',
    content:
      'A Digital Signature is a cryptographic mechanism used to verify the authenticity and integrity of digital documents and messages. Properly implemented digital signatures provide strong assurance that a message was created by a known sender and was not altered in transit, and can offer non‑repudiation and time‑stamping benefits.\n\nIn India, Class II and Class III Digital Signature Certificates (DSC) are commonly used. Class III DSCs are typically required for e‑tendering, e‑auctions and certain high‑security online filings, including some import‑export documentation.\n\nWe provide fast issuance of DSCs along with USB tokens, ensuring compatibility with government portals and secure workflows.',
    packages: [
      {
        name: 'Standard',
        price: '₹1,150',
        description:
          'Class II DSC valid for 2 years along with USB token and full support until issuance.'
      },
      {
        name: 'Deluxe',
        price: '₹2,000',
        description:
          'Class III DSC valid for 1 year along with USB token and end‑to‑end support.'
      },
      {
        name: 'Premium',
        price: '₹2,400',
        description:
          'DSC for DGFT filing valid for 1 year along with USB token and support.'
      }
    ]
  },

  // REGISTRATION – Health License
  {
    id: 'health-license',
    name: 'Health License',
    mainHead: 'REGISTRATION',
    categoryId: 'registration',
    shortDescription:
      'Municipal Health License for specified trades and activities in addition to Trade License.',
    content:
      'Health License is required for certain specified trades, processes and commodities as notified under state and municipal health regulations. It is issued by the Municipal Commissioner having jurisdiction over the business location and is often required in addition to a Trade License.\n\nNot every business requires a Health License, as applicability depends on the nature of activities and state‑specific laws. We assess applicability for your business and location and manage the entire application and liaison process.\n\nWe provide expert support in obtaining Health Licenses as per the laws and regulations of your state and local authority.',
    packages: [
      {
        name: 'Standard',
        price: '₹13,000',
        description:
          'Support until receipt of Health License for one business entity.'
      },
      {
        name: 'Deluxe',
        price: '₹17,500',
        description:
          'Health License for one business plus GST Registration.'
      },
      {
        name: 'Premium',
        price: '₹19,000',
        description:
          'Health License for one business plus GST Registration and Class II DSC valid for 2 years.'
      }
    ]
  },

  // FORM NEW BUSINESS – Proprietorship
  {
    id: 'proprietorship',
    name: 'Proprietorship',
    mainHead: 'FORM NEW BUSINESS',
    categoryId: 'new-business',
    shortDescription:
      'Simple proprietorship setup with MSME, TAN and optional GST & GST filing.',
    content:
      'Proprietorship is the simplest form of business in India, owned and managed by a single individual (the proprietor) who retains all profits. It is typically suited for micro, small and medium enterprises in the unorganised sector.\n\nTo establish business identity, a proprietorship should obtain Udyog Aadhaar / MSME Registration; without it, banks and other stakeholders may not recognise the entity as a formal business. Trade License (where applicable) and TAN Registration for TDS/TCS on payments may also be required.\n\nWe provide expert support and guidance for forming a proprietorship in your desired business name and obtaining the necessary registrations.',
    packages: [
      {
        name: 'Standard',
        price: '₹2,500',
        description:
          'Support until receipt of MSME and TAN Registration for the proprietorship.'
      },
      {
        name: 'Deluxe',
        price: '₹6,000',
        description:
          'Everything in Standard plus GST Registration for the proprietorship.'
      },
      {
        name: 'Premium',
        price: '₹12,000',
        description:
          'Everything in Deluxe plus GST Return filing for 6 months.'
      }
    ]
  },

  // FORM NEW BUSINESS – Partnership
  {
    id: 'partnership',
    name: 'Partnership',
    mainHead: 'FORM NEW BUSINESS',
    categoryId: 'new-business',
    shortDescription:
      'Formation and registration of partnership firms with deed drafting and GST options.',
    content:
      'A partnership business is a more organised form of business than a proprietorship and is governed by the Partnership Act, 1932. Two or more partners come together to carry on business and typically execute a Partnership Deed which governs profit‑sharing, management, banking operations, admission and retirement of partners and other key terms.\n\nWe provide comprehensive support in drafting a robust Partnership Deed and registering your partnership firm with the concerned authorities, along with optional GST setup and compliance.',
    packages: [
      {
        name: 'Standard',
        price: '₹6,000',
        description:
          'Expert support in drafting the Partnership Deed and registering your partnership business.'
      },
      {
        name: 'Deluxe',
        price: '₹12,000',
        description:
          'Everything in Standard plus obtaining GST Registration for the partnership firm.'
      },
      {
        name: 'Premium',
        price: '₹18,000',
        description:
          'Everything in Deluxe plus GST Return filing for 6 months for the partnership firm.'
      }
    ]
  },

  // FORM NEW BUSINESS – One Person Company
  {
    id: 'one-person-company',
    name: 'One Person Company (OPC)',
    mainHead: 'FORM NEW BUSINESS',
    categoryId: 'new-business',
    shortDescription:
      'Incorporation of One Person Company with DSC, DIN, PAN, TAN, GST and more.',
    content:
      'A One Person Company (OPC) combines the benefits of a private limited company with the simplicity of a single owner structure. It offers separate legal entity status, limited liability, easier funding options and eligibility for benefits available to small scale industries.\n\nKey advantages include minimum compliance compared to larger companies, single ownership with quick decision‑making, limited liability protection, eligibility for SSI benefits such as easier bank funding and concessional interest, and enhanced trust and prestige. OPCs require at least one shareholder, one director (who can be the same person), one nominee and must suffix “(OPC) Private Limited” to their name.\n\nWe provide complete support in forming an OPC in line with your preferred name and MCA requirements.',
    packages: [
      {
        name: 'Standard',
        price: '₹12,000',
        description:
          'Formation of OPC with authorised capital up to ₹1 Lakh, 2 DSC, 1 DIN, 1 name approval, Certificate of Incorporation, PAN, TAN and GST Registration (government fees and stamp duty extra).'
      },
      {
        name: 'Deluxe',
        price: '₹15,000',
        description:
          'Formation of OPC with authorised capital up to ₹10 Lakhs, 2 DSC, 1 DIN, 1 name approval, Incorporation Certificate, PAN, share certificates, TAN and GST Registration (government fees and stamp duty extra).'
      },
      {
        name: 'Premium',
        price: '₹18,000',
        description:
          'Everything in Deluxe plus MSME Registration and GST Return filing for 3 months (government fees and stamp duty extra).'
      }
    ]
  },

  // FORM NEW BUSINESS – LLP
  {
    id: 'llp',
    name: 'Limited Liability Partnership (LLP)',
    mainHead: 'FORM NEW BUSINESS',
    categoryId: 'new-business',
    shortDescription:
      'Incorporation of LLP with DSC, LLP agreement, PAN, TAN and optional GST & TDS filing.',
    content:
      'A Limited Liability Partnership (LLP) is a hybrid business structure combining features of a company and a traditional partnership. It provides limited liability to partners while allowing operational flexibility through an LLP Agreement.\n\nAn LLP is a separate legal entity with perpetual succession. Partners’ liability is generally limited to their agreed contribution, and they are insulated from liabilities arising out of other partners’ wrongful acts or misconduct. Compared to companies, LLPs enjoy more contractual flexibility, a simpler governance structure and lower compliance burden.\n\nWe provide end‑to‑end support in forming LLPs, drafting LLP Agreements, obtaining approvals and setting up tax registrations and compliance.',
    packages: [
      {
        name: 'Standard',
        price: '₹8,000',
        description:
          'Formation of LLP with DSC, LLP Deed drafting, name approval, government incorporation fees, PAN and TAN Registration.'
      },
      {
        name: 'Deluxe',
        price: '₹14,000',
        description:
          'Everything in Standard plus TDS Return filing for 1 year.'
      },
      {
        name: 'Premium',
        price: '₹18,000',
        description:
          'Standard package plus PAN, GST and TAN Registration along with TDS Return filing for 1 year.'
      }
    ]
  },

  // FORM NEW BUSINESS – Private Limited Company
  {
    id: 'private-limited-company',
    name: 'Private Limited Company',
    mainHead: 'FORM NEW BUSINESS',
    categoryId: 'new-business',
    shortDescription:
      'Incorporation of private limited companies with DSCs, DINs, PAN, TAN, GST and MSME.',
    content:
      'A Private Limited Company is a widely used corporate structure in India, offering separate legal entity status, limited liability, perpetual succession and better access to funding. Shares are privately held and transfer is restricted, with a cap on the number of members as per the Companies Act, 2013.\n\nKey characteristics include minimum 2 members and 2 directors, limited liability for shareholders, perpetual succession irrespective of changes in ownership, no need to issue a public prospectus and flexibility in internal governance. Private companies must use “Private Limited” in their name.\n\nWe provide expert guidance and complete support in forming Private Limited Companies aligned with your preferred name and MCA norms.',
    packages: [
      {
        name: 'Standard',
        price: '₹9,500',
        description:
          'Formation of a Private Limited Company with 3 Class II DSC, 2 DIN, 1 name approval, incorporation fees, PAN and TAN Registration with authorised capital up to ₹10 Lakhs (stamp duty extra; additional charges for foreign directors).'
      },
      {
        name: 'Deluxe',
        price: '₹13,000',
        description:
          'Standard package plus GST Registration (stamp duty extra; additional charges for foreign directors).'
      },
      {
        name: 'Premium',
        price: '₹16,000',
        description:
          'Deluxe package plus MSME Registration and GST Return filing for 3 months (stamp duty extra; additional charges for foreign directors).'
      }
    ]
  },

  // FORM NEW BUSINESS – Public Limited Company
  {
    id: 'public-limited-company',
    name: 'Public Limited Company',
    mainHead: 'FORM NEW BUSINESS',
    categoryId: 'new-business',
    shortDescription:
      'Incorporation of public limited companies with higher capital and compliance needs.',
    content:
      'A Public Limited Company is a corporate form that allows raising capital from the public and provides limited liability to its shareholders. It requires at least 7 members and 3 directors and must comply with stricter regulatory norms compared to private companies.\n\nPublic companies enjoy advantages such as unrestricted number of members, easier transferability of shares and enhanced transparency. They must use “Limited” in their name and typically issue a prospectus for inviting public subscription.\n\nWe offer complete support in forming Public Limited Companies including approvals, documentation and tax registrations.',
    packages: [
      {
        name: 'Standard',
        price: '₹29,500',
        description:
          'Formation of Public Limited Company with 10 Class II DSC, 3 DIN, 1 name approval, incorporation fees, PAN, GST and TAN Registration with authorised capital of ₹5 Lakhs (stamp duty extra).'
      },
      {
        name: 'Deluxe',
        price: '₹35,000',
        description:
          'Standard package with authorised capital of ₹10 Lakhs (stamp duty extra).'
      },
      {
        name: 'Premium',
        price: '₹45,000',
        description:
          'Deluxe package plus GST Return filing for 6 months (stamp duty extra).'
      }
    ]
  },

  // FORM NEW BUSINESS – Nidhi Company
  {
    id: 'nidhi-company',
    name: 'Nidhi Company',
    mainHead: 'FORM NEW BUSINESS',
    categoryId: 'new-business',
    shortDescription:
      'Formation of Nidhi companies for mutual benefit deposits and loans among members.',
    content:
      'A Nidhi Company is a type of non‑banking financial company (NBFC) recognised under Section 406 of the Companies Act, 2013. Its primary business is accepting deposits from and lending to its members for their mutual benefit. Common examples include permanent funds and mutual benefit funds.\n\nNidhi Companies focus on supporting small and medium income groups and operate on principles of mutual assistance. They must comply with specific requirements around number of members, net owned funds, unencumbered term deposits and share issuance, and can only deal with members.\n\nWe provide end‑to‑end support in forming Nidhi Companies including documentation, incorporation and initial share allotment.',
    packages: [
      {
        name: 'Standard',
        price: '₹36,500',
        description:
          'Formation of Nidhi Company with 10 Class II DSC, 3 DIN, 1 name approval, incorporation fees, PAN and TAN Registration plus company kit.'
      },
      {
        name: 'Deluxe',
        price: '₹50,000',
        description:
          'Standard package plus share certificates and share allotment for up to 200 shareholders.'
      },
      {
        name: 'Premium',
        price: '₹60,000',
        description:
          'Deluxe package plus GST or Trademark Registration as required.'
      }
    ]
  },

  // FORM NEW BUSINESS – Producer Company
  {
    id: 'producer-company',
    name: 'Producer Company',
    mainHead: 'FORM NEW BUSINESS',
    categoryId: 'new-business',
    shortDescription:
      'Formation of producer companies for primary producers and agribusinesses.',
    content:
      'A Producer Company is a company registered under the Companies Act to carry on activities relating to production, harvesting, procurement, grading, pooling, handling, marketing, selling and export of primary produce of members, or import of goods and services for their benefit. It may also process produce and supply machinery, equipment or consumables to members.\n\nProducer Companies are treated as private limited companies with no cap on the number of members and cannot be converted into public companies. They are particularly suited for farmer collectives, agri‑businesses and producer institutions.\n\nWe provide complete support in forming Producer Companies including name approval, incorporation, issue of shares and initial compliance.',
    packages: [
      {
        name: 'Standard',
        price: '₹70,000',
        description:
          'Formation of Producer Company with 10 Class II DSC, 10 DIN, 1 name approval, incorporation fees, PAN and TAN Registration, company kit and share certificates.'
      },
      {
        name: 'Deluxe',
        price: '₹75,000',
        description:
          'Standard package plus one year of TDS Return filing.'
      },
      {
        name: 'Premium',
        price: '₹80,000',
        description:
          'Deluxe package plus Trademark Registration.'
      }
    ]
  },

  // FORM NEW BUSINESS – Section 8 Company
  {
    id: 'section-8-company',
    name: 'Section 8 Company',
    mainHead: 'FORM NEW BUSINESS',
    categoryId: 'new-business',
    shortDescription:
      'Formation of not‑for‑profit Section 8 companies for charitable and social objectives.',
    content:
      'Section 8 Companies are not‑for‑profit entities registered under the Companies Act, 2013, with the primary objective of promoting arts, commerce, science, research, education, sports, charity, social welfare, religion, environment protection and similar causes. They apply their profits solely towards furthering their objects and do not distribute dividends to members.\n\nThese companies enjoy several privileges and exemptions due to their charitable nature and do not require a minimum share capital. Famous examples include FICCI and CII.\n\nWe provide expert guidance and support in forming Section 8 Companies, including licensing from the Central Government and all related compliances.',
    packages: [
      {
        name: 'Standard',
        price: '₹30,000',
        description:
          'Formation of Section 8 Company with 3 Class II DSC, 2 DIN, 1 name approval, MOA & AOA, RD License, PAN and TAN Registration plus company kit.'
      },
      {
        name: 'Deluxe',
        price: '₹36,000',
        description:
          'Standard package plus GST Registration and GST Return filing for 3 months.'
      },
      {
        name: 'Premium',
        price: '₹45,000',
        description:
          'Deluxe package plus GST Return filing for 6 months and TDS Return filing for 1 year.'
      }
    ]
  },

  // FORM NEW BUSINESS – Indian Subsidiary of Foreign Company
  {
    id: 'indian-subsidiary-foreign-company',
    name: 'Indian Subsidiary of Foreign Company',
    mainHead: 'FORM NEW BUSINESS',
    categoryId: 'new-business',
    shortDescription:
      'Formation of Indian subsidiaries and wholly owned subsidiaries of foreign companies.',
    content:
      'A subsidiary company is controlled by a parent (holding) company, which may be incorporated outside India. When a foreign company owns at least 50% of the equity in an Indian entity, the latter becomes its subsidiary; if it owns 100%, it becomes a wholly owned subsidiary.\n\nWholly owned subsidiaries of foreign companies in India are often set up through the automatic route where 100% FDI is permitted and no prior RBI or government approval is required. Such subsidiaries are separate legal entities and must comply with Indian company law and tax regulations.\n\nWe provide comprehensive support in forming Indian subsidiaries of foreign companies, including documentation for foreign promoters, regulatory compliance and ongoing tax filings.',
    packages: [
      {
        name: 'Standard',
        price: '₹55,000',
        description:
          'Formation of Indian subsidiary with 2 Class II DSC, 2 DIN, 1 name approval, share certificates, incorporation fees, PAN and TAN Registration plus company kit.'
      },
      {
        name: 'Deluxe',
        price: '₹70,000',
        description:
          'Standard package plus one year of TDS Return filing and annual tax filing.'
      },
      {
        name: 'Premium',
        price: '₹1,00,000',
        description:
          'Deluxe package plus auditor appointment and full first‑year tax and TDS compliance.'
      }
    ]
  },

  // RETURN FILING – ITR-1
  {
    id: 'itr-1-filing',
    name: 'ITR‑1 (SAHAJ) Filing',
    mainHead: 'RETURN FILING',
    categoryId: 'return-filing',
    shortDescription:
      'ITR‑1 filing for resident individuals with income from salary, one house property and other sources.',
    content:
      'ITR‑1 (SAHAJ) is to be used by a resident individual (other than not ordinarily resident) whose total income includes salary/pension, income from one house property (without loss carry‑forward) and income from other sources (excluding lottery, race horses and certain special incomes). It is not applicable where total income exceeds ₹50 Lakhs or where the individual has foreign assets, foreign income, business/professional income, capital gains or other excluded categories.\n\nWe review your income profile, ensure correct selection of form and file your ITR‑1 with appropriate tax planning recommendations for future years.',
    packages: [
      {
        name: 'Standard',
        price: '₹1,000',
        description:
          'Online filing of ITR‑1 for individuals with salary income up to ₹5 Lakhs.'
      },
      {
        name: 'Deluxe',
        price: '₹2,500',
        description:
          'Online filing of ITR‑1 for individuals with salary income up to ₹15 Lakhs.'
      },
      {
        name: 'Premium',
        price: '₹4,000',
        description:
          'Online filing of ITR‑1 for individuals with salary income above ₹10 Lakhs.'
      }
    ]
  },

  // RETURN FILING – ITR-2
  {
    id: 'itr-2-filing',
    name: 'ITR‑2 Filing',
    mainHead: 'RETURN FILING',
    categoryId: 'return-filing',
    shortDescription:
      'ITR‑2 filing for individuals and HUFs not having business/professional income.',
    content:
      'ITR‑2 is to be used by individuals and HUFs who are not eligible to file ITR‑1 (SAHAJ) and who do not have income under the head “Profits or Gains of Business or Profession”. It is suitable for taxpayers with multiple house properties, capital gains, foreign income/assets and certain other categories.\n\nWe help you determine eligibility, collate all income details and file ITR‑2 accurately, including disclosures for foreign assets and capital gains.',
    packages: [
      {
        name: 'Standard',
        price: '₹2,000',
        description:
          'Online filing of ITR‑2 for individuals with income from more than one house property.'
      },
      {
        name: 'Deluxe',
        price: '₹3,500',
        description:
          'Online filing of ITR‑2 for individuals with foreign income or assets.'
      },
      {
        name: 'Premium',
        price: '₹5,000',
        description:
          'Online filing of ITR‑2 for individuals with capital gains income.'
      }
    ]
  },

  // RETURN FILING – ITR-3
  {
    id: 'itr-3-filing',
    name: 'ITR‑3 Filing',
    mainHead: 'RETURN FILING',
    categoryId: 'return-filing',
    shortDescription:
      'ITR‑3 filing for individuals and HUFs having business or professional income.',
    content:
      'ITR‑3 is to be used by individuals and HUFs having income under the head “Profits or Gains of Business or Profession” and who are not eligible to file ITR‑4 (SUGAM). It covers regular business/professional income situations including audit and non‑audit cases.\n\nWe assist with compiling your financial statements, ensuring correct computation of taxable income and filing ITR‑3 in line with the latest regulations.',
    packages: [
      {
        name: 'Standard',
        price: '₹4,000',
        description:
          'Online filing of ITR‑3 for taxpayers with taxable income less than ₹10 Lakhs.'
      },
      {
        name: 'Deluxe',
        price: '₹7,500',
        description:
          'Online filing of ITR‑3 for taxpayers with taxable income less than ₹20 Lakhs.'
      },
      {
        name: 'Premium',
        price: '₹11,500',
        description:
          'Online filing of ITR‑3 for taxpayers with taxable income between ₹20 Lakhs and ₹40 Lakhs.'
      }
    ]
  },

  // RETURN FILING – ITR-4
  {
    id: 'itr-4-filing',
    name: 'ITR‑4 (SUGAM) Filing',
    mainHead: 'RETURN FILING',
    categoryId: 'return-filing',
    shortDescription:
      'Presumptive taxation return filing for eligible small businesses and professionals.',
    content:
      'ITR‑4 (SUGAM) is to be used by individuals, HUFs and partnership firms (other than LLPs) whose total income includes business income under sections 44AD or 44AE, professional income under section 44ADA, salary/pension, income from one house property and income from other sources (with certain exclusions). It is not applicable where there are multiple house properties, capital gains, foreign assets/income, speculative income, commission or brokerage income, or where books are maintained and audited.\n\nWe help you evaluate eligibility for presumptive schemes and file ITR‑4 or the appropriate regular form after optimising your tax position.',
    packages: [
      {
        name: 'Standard',
        price: '₹3,000',
        description:
          'Online filing of ITR‑4 for taxpayers with taxable income less than ₹10 Lakhs.'
      },
      {
        name: 'Deluxe',
        price: '₹6,500',
        description:
          'Online filing of ITR‑4 for taxpayers with taxable income less than ₹20 Lakhs.'
      },
      {
        name: 'Premium',
        price: '₹10,000',
        description:
          'Online filing of ITR‑4 for taxpayers with taxable income more than ₹25 Lakhs.'
      }
    ]
  },

  // RETURN FILING – ITR-5
  {
    id: 'itr-5-filing',
    name: 'ITR‑5 Filing',
    mainHead: 'RETURN FILING',
    categoryId: 'return-filing',
    shortDescription:
      'ITR‑5 filing for firms, LLPs, AOPs, BOIs, co‑operative societies and certain other entities.',
    content:
      'ITR‑5 is applicable to firms, LLPs, AOPs, BOIs, artificial juridical persons, co‑operative societies, registered societies and local authorities that are not required to file returns under sections 139(4A) to 139(4F) for charitable, political or specified institutions.\n\nWe assist with preparation and e‑filing of ITR‑5 along with uploading tax audit and other mandatory reports where applicable.',
    packages: [
      {
        name: 'Standard',
        price: '₹7,500',
        description:
          'Online filing of ITR‑5 for taxpayers with taxable income less than ₹15 Lakhs.'
      },
      {
        name: 'Deluxe',
        price: '₹12,500',
        description:
          'Online filing of ITR‑5 for taxpayers with taxable income less than ₹30 Lakhs.'
      },
      {
        name: 'Premium',
        price: '₹15,000',
        description:
          'Online filing of ITR‑5 for taxpayers with taxable income exceeding ₹30 Lakhs.'
      }
    ]
  },

  // RETURN FILING – ITR-6
  {
    id: 'itr-6-filing',
    name: 'ITR‑6 Filing',
    mainHead: 'RETURN FILING',
    categoryId: 'return-filing',
    shortDescription:
      'ITR‑6 filing for companies not claiming exemption under section 11.',
    content:
      'ITR‑6 is to be used by companies (other than those claiming exemption under section 11) for filing their income tax returns. It must be furnished electronically under digital signature.\n\nWe manage full‑cycle ITR‑6 filing for companies, including computation of book profits, MAT/AMT implications, tax audits and e‑filing with digital signature.',
    packages: [
      {
        name: 'Standard',
        price: '₹11,500',
        description:
          'Online filing of ITR‑6 for companies with taxable income less than ₹10 Lakhs.'
      },
      {
        name: 'Deluxe',
        price: '₹18,500',
        description:
          'Online filing of ITR‑6 for companies with taxable income less than ₹25 Lakhs.'
      },
      {
        name: 'Premium',
        price: '₹25,000',
        description:
          'Online filing of ITR‑6 for companies with taxable income exceeding ₹25 Lakhs.'
      }
    ]
  },

  // RETURN FILING – ITR-7
  {
    id: 'itr-7-filing',
    name: 'ITR‑7 Filing',
    mainHead: 'RETURN FILING',
    categoryId: 'return-filing',
    shortDescription:
      'ITR‑7 filing for entities required to file under sections 139(4A) to 139(4F).',
    content:
      'ITR‑7 is applicable to persons, including companies, required to furnish returns under sections 139(4A) to 139(4F), such as charitable/religious trusts, political parties, research associations, news agencies, colleges and universities and other specified institutions.\n\nWe handle ITR‑7 filing including preparation and e‑filing of mandatory audit reports and certificates, ensuring compliance with exemption conditions.',
    packages: [
      {
        name: 'Standard',
        price: 'Custom',
        description:
          'Pricing based on the nature of trust/institution and reporting requirements. Contact us for a tailored quote.'
      }
    ]
  },

  // RETURN FILING – TDS Return
  {
    id: 'tds-return-filing',
    name: 'TDS Return Filing',
    mainHead: 'RETURN FILING',
    categoryId: 'return-filing',
    shortDescription:
      'TDS return preparation and e‑filing for all quarters and sections.',
    content:
      'Tax Deducted at Source (TDS) is an indirect mechanism of tax collection at the point of income generation. Deductors must deposit TDS with the government and file quarterly TDS Returns containing details of deductions and challans. TAN (Tax Deduction and Collection Account Number) is mandatory for all deductors.\n\nWe provide end‑to‑end TDS compliance services including computation, challan payments, return preparation, e‑filing and support in responding to notices.',
    packages: [
      {
        name: 'Standard',
        price: '₹1,800',
        description:
          'TDS Return filing for one quarter across applicable sections.'
      },
      {
        name: 'Deluxe',
        price: '₹3,000',
        description:
          'TDS Return filing for two quarters in a financial year.'
      },
      {
        name: 'Premium',
        price: '₹5,500',
        description:
          'TDS Return filing for all four quarters of a financial year.'
      }
    ]
  },

  // NEW BUSINESS – Other business registrations (from master list)
  {
    id: 'partnership-registration',
    name: 'Partnership Registration',
    mainHead: 'FORM NEW BUSINESS',
    categoryId: 'new-business',
    shortDescription:
      'Formation and registration of partnership firms with a legally drafted partnership deed.',
    content:
      'We handle end‑to‑end Partnership Registration including partner onboarding, drafting of the partnership deed, stamping/registration where applicable and support with related tax registrations as per state‑specific rules.',
    packages: [
      {
        name: 'Custom',
        price: 'On request',
        description:
          'Pricing depends on partner count, capital and state requirements. Contact us for a tailored quote.'
      }
    ]
  },
  {
    id: 'llp-registration',
    name: 'LLP Registration',
    mainHead: 'FORM NEW BUSINESS',
    categoryId: 'new-business',
    shortDescription:
      'End‑to‑end Limited Liability Partnership registration with MCA.',
    content:
      'We provide complete support for LLP formation from DSCs and name reservation to filing incorporation forms, drafting the LLP Agreement and obtaining PAN/TAN for the new entity.',
    packages: [
      {
        name: 'Custom',
        price: 'On request',
        description:
          'Price varies with partner count and capital contribution. Share your details for an exact quote.'
      }
    ]
  },
  {
    id: 'indian-subsidiary',
    name: 'Indian Subsidiary',
    mainHead: 'FORM NEW BUSINESS',
    categoryId: 'new-business',
    shortDescription:
      'Formation of Indian subsidiary entities for resident groups and foreign parents.',
    content:
      'We help you evaluate the right structure, prepare shareholders/directors documentation and complete incorporation formalities with the MCA and tax departments for Indian subsidiaries.',
    packages: [
      {
        name: 'Custom',
        price: 'On request',
        description:
          'Quotation based on capital structure, number of shareholders and foreign participation.'
      }
    ]
  },

  // NGO REGISTRATIONS
  {
    id: 'trust-registration',
    name: 'Trust Registration',
    mainHead: 'REGISTRATION',
    categoryId: 'ngo-registrations',
    shortDescription:
      'Creation and registration of public charitable or private trusts.',
    content:
      'We support you in drafting trust deeds, identifying suitable trustees, getting registration with the appropriate authority and aligning the trust object clauses with future tax‑exemption needs.',
    packages: [
      {
        name: 'Custom',
        price: 'On request',
        description:
          'Fees depend on state, type of trust and level of advisory required.'
      }
    ]
  },
  {
    id: 'society-registration',
    name: 'Society Registration',
    mainHead: 'REGISTRATION',
    categoryId: 'ngo-registrations',
    shortDescription:
      'Registration of societies for charitable, educational and social objectives.',
    content:
      'We assist with drafting the memorandum and rules and regulations, arranging promoters, filing with the registrar of societies and obtaining the registration certificate for your society.',
    packages: [
      {
        name: 'Custom',
        price: 'On request',
        description:
          'Pricing based on state, promoter count and drafting complexity.'
      }
    ]
  },
  {
    id: 'section-12a-registration',
    name: 'Section 12A Registration',
    mainHead: 'INCOME TAX',
    categoryId: 'ngo-registrations',
    shortDescription:
      'Section 12A registration for income tax exemption of charitable entities.',
    content:
      'We help trusts and societies apply for Section 12A registration with the Income Tax Department so that their income from property held under trust for charitable or religious purposes can be exempt, subject to conditions.',
    packages: [
      {
        name: 'Custom',
        price: 'On request',
        description:
          'Includes preparation of application, collation of documents and responding to department queries.'
      }
    ]
  },
  {
    id: 'section-80g-registration',
    name: 'Section 80G Registration',
    mainHead: 'INCOME TAX',
    categoryId: 'ngo-registrations',
    shortDescription:
      '80G approval so donors can claim deduction on donations to your NGO.',
    content:
      'We prepare and file 80G applications for eligible NGOs so that their donors can claim deductions on eligible donations, including support with documentation and liaison with authorities.',
    packages: [
      {
        name: 'Custom',
        price: 'On request',
        description:
          'Quote depends on the complexity of activities and years of operation.'
      }
    ]
  },

  // INTERNATIONAL INCORPORATIONS
  {
    id: 'incorporation-usa',
    name: 'Incorporation in USA',
    mainHead: 'FORM NEW BUSINESS',
    categoryId: 'international-incorporations',
    shortDescription:
      'Company incorporation in popular US states (DE, WY, etc.).',
    content:
      'We coordinate with local partners to incorporate entities in the United States, advise on suitable states (like Delaware, Wyoming), and arrange EIN and basic compliance setup.',
    packages: [
      {
        name: 'Custom',
        price: 'On request',
        description:
          'Pricing varies by state, entity type and add‑on services like EIN and bank account support.'
      }
    ]
  },
  {
    id: 'incorporation-china',
    name: 'Incorporation in China',
    mainHead: 'FORM NEW BUSINESS',
    categoryId: 'international-incorporations',
    shortDescription:
      'Support for setting up entities and WFOEs in China.',
    content:
      'We facilitate China company formation through specialist partners, including choice of city, documentation, regulatory approvals and basic post‑incorporation compliance guidance.',
    packages: [
      {
        name: 'Custom',
        price: 'On request',
        description:
          'Quotes are customised based on industry, location and capital structure.'
      }
    ]
  },
  {
    id: 'incorporation-singapore',
    name: 'Incorporation in Singapore',
    mainHead: 'FORM NEW BUSINESS',
    categoryId: 'international-incorporations',
    shortDescription:
      'Private limited company incorporation and relocation‑friendly structures in Singapore.',
    content:
      'We assist with Singapore company incorporation, local director arrangements through partners, bank introductions and basic tax and compliance briefing.',
    packages: [
      {
        name: 'Custom',
        price: 'On request',
        description:
          'Fee depends on need for local director, office address and compliance add‑ons.'
      }
    ]
  },
  {
    id: 'incorporation-dubai',
    name: 'Incorporation in Dubai',
    mainHead: 'FORM NEW BUSINESS',
    categoryId: 'international-incorporations',
    shortDescription:
      'Mainland and free‑zone business setup in Dubai and UAE.',
    content:
      'We work with UAE associates to set up mainland and free‑zone companies in Dubai and other emirates, including trade licence applications, visa quotas and basic banking assistance.',
    packages: [
      {
        name: 'Custom',
        price: 'On request',
        description:
          'Package is based on free‑zone choice, visa needs and activity type.'
      }
    ]
  },
  {
    id: 'incorporation-malaysia',
    name: 'Incorporation in Malaysia',
    mainHead: 'FORM NEW BUSINESS',
    categoryId: 'international-incorporations',
    shortDescription:
      'Company registration and local regulatory setup in Malaysia.',
    content:
      'We coordinate with Malaysian professionals to register your company, arrange local secretarial support and guide you on compliance timelines.',
    packages: [
      {
        name: 'Custom',
        price: 'On request',
        description:
          'Fees depend on shareholding pattern and nature of business activity.'
      }
    ]
  },
  {
    id: 'incorporation-uk',
    name: 'Incorporation in UK',
    mainHead: 'FORM NEW BUSINESS',
    categoryId: 'international-incorporations',
    shortDescription:
      'UK limited company incorporation with Companies House.',
    content:
      'We support UK incorporation including name reservation, filing incorporation documents, registered office arrangements via partners and basic accounting/tax guidance.',
    packages: [
      {
        name: 'Custom',
        price: 'On request',
        description:
          'Pricing depends on need for local address, nominee services and compliance support.'
      }
    ]
  },
  {
    id: 'incorporation-australia',
    name: 'Incorporation in Australia',
    mainHead: 'FORM NEW BUSINESS',
    categoryId: 'international-incorporations',
    shortDescription:
      'Company registration with ASIC and basic tax setup in Australia.',
    content:
      'We work with Australian partners to obtain ACN, register companies and arrange TFN/GST registrations as needed, along with compliance guidance.',
    packages: [
      {
        name: 'Custom',
        price: 'On request',
        description:
          'Quote tailored to state of registration and structure (Pty Ltd, etc.).'
      }
    ]
  },
  {
    id: 'incorporation-hongkong',
    name: 'Incorporation in Hong Kong',
    mainHead: 'FORM NEW BUSINESS',
    categoryId: 'international-incorporations',
    shortDescription:
      'Hong Kong private company formation for trade and regional HQs.',
    content:
      'We assist with Hong Kong incorporation, company secretary, registered address and basic bank introductions through local providers.',
    packages: [
      {
        name: 'Custom',
        price: 'On request',
        description:
          'Costs depend on secretary services, address and banking assistance required.'
      }
    ]
  },
  {
    id: 'incorporation-germany',
    name: 'Incorporation in Germany',
    mainHead: 'FORM NEW BUSINESS',
    categoryId: 'international-incorporations',
    shortDescription:
      'Company formation in Germany for EU market access.',
    content:
      'We coordinate German entity formation via specialist counsel, including notary, bank and registration formalities and high‑level tax/compliance guidance.',
    packages: [
      {
        name: 'Custom',
        price: 'On request',
        description:
          'Pricing varies with federal state, capital and need for local directors.'
      }
    ]
  },

  // GST SERVICES (beyond registration)
  {
    id: 'temporary-gst-registration',
    name: 'Temporary GST Registration',
    mainHead: 'GOODS & SERVICES TAX',
    categoryId: 'gst-services',
    shortDescription:
      'Temporary GST registrations for short‑term events and projects.',
    content:
      'We arrange temporary GST registrations for exhibitions, fairs and short‑term projects where required by law, including cancellation after the event is over.',
    packages: [
      {
        name: 'Custom',
        price: 'On request',
        description:
          'Quote covers registration, return filing for the period and cancellation.'
      }
    ]
  },
  {
    id: 'gst-registration-foreigners',
    name: 'GST Registration for Foreigners',
    mainHead: 'GOODS & SERVICES TAX',
    categoryId: 'gst-services',
    shortDescription:
      'GST registration for non‑resident taxable persons in India.',
    content:
      'We help foreign entities and non‑resident taxable persons obtain GST registration in India, arrange authorised signatories and manage GST compliance during their taxable activities.',
    packages: [
      {
        name: 'Custom',
        price: 'On request',
        description:
          'Pricing based on duration of registration and volume of transactions.'
      }
    ]
  },
  {
    id: 'gst-annual-return',
    name: 'GST Annual Return',
    mainHead: 'GOODS & SERVICES TAX',
    categoryId: 'gst-services',
    shortDescription:
      'Preparation and filing of annual GST returns and reconciliations.',
    content:
      'We prepare and file your GST annual return, perform reconciliations of books vs. GST portal data and help clean up discrepancies before submission.',
    packages: [
      {
        name: 'Custom',
        price: 'On request',
        description:
          'Price depends on turnover and complexity of reconciliations required.'
      }
    ]
  },
  {
    id: 'gst-e-way-bill',
    name: 'GST E‑Way Bill',
    mainHead: 'GOODS & SERVICES TAX',
    categoryId: 'gst-services',
    shortDescription:
      'Assistance with e‑way bill generation and compliance.',
    content:
      'We assist businesses in understanding e‑way bill rules, setting up processes and supporting large‑volume generation and reconciliation requirements.',
    packages: [
      {
        name: 'Custom',
        price: 'On request',
        description:
          'Ongoing support packages available for regular logistics‑heavy businesses.'
      }
    ]
  },
  {
    id: 'gst-return-filing',
    name: 'GST Return Filing',
    mainHead: 'GOODS & SERVICES TAX',
    categoryId: 'gst-services',
    shortDescription:
      'Regular monthly/quarterly GST return preparation and filing.',
    content:
      'We manage your periodic GST return filing, including data validation, matching with books, uploading invoices and filing GSTR‑1, GSTR‑3B and other relevant returns.',
    packages: [
      {
        name: 'Custom',
        price: 'On request',
        description:
          'Subscription‑style pricing based on number of invoices and states.'
      }
    ]
  },
  {
    id: 'input-tax-credit-recon',
    name: 'Input Tax Credit Reconciliation',
    mainHead: 'GOODS & SERVICES TAX',
    categoryId: 'gst-services',
    shortDescription:
      'GST input tax credit reconciliation between books and portal.',
    content:
      'We perform detailed ITC reconciliations using GSTR‑2B/2A data, identify mismatches, coordinate with vendors and help you maximise eligible credit.',
    packages: [
      {
        name: 'Custom',
        price: 'On request',
        description:
          'Fee is linked to number of vendors and years of reconciliation.'
      }
    ]
  },
  {
    id: 'gst-registration-cancellation',
    name: 'GST Registration Cancellation',
    mainHead: 'GOODS & SERVICES TAX',
    categoryId: 'gst-services',
    shortDescription:
      'Closure and cancellation of GST registrations.',
    content:
      'We handle cancellation of GST registrations, including filing final returns, clearing liabilities and responding to notices until the registration is fully closed.',
    packages: [
      {
        name: 'Custom',
        price: 'On request',
        description:
          'Covers end‑to‑end cancellation and support till closure confirmation.'
      }
    ]
  },
  {
    id: 'gst-refund',
    name: 'GST Refund',
    mainHead: 'GOODS & SERVICES TAX',
    categoryId: 'gst-services',
    shortDescription:
      'Advisory and filing support for GST refund claims.',
    content:
      'We evaluate eligibility and prepare refund applications for exports, inverted duty, excess cash ledger balances and other permitted scenarios, and assist through to sanction.',
    packages: [
      {
        name: 'Custom',
        price: 'On request',
        description:
          'Fees may be a mix of fixed and success‑linked components.'
      }
    ]
  },
  {
    id: 'gst-lut-filing',
    name: 'GST LUT Filing',
    mainHead: 'GOODS & SERVICES TAX',
    categoryId: 'gst-services',
    shortDescription:
      'Letter of Undertaking (LUT) filing for exports without payment of tax.',
    content:
      'We assist exporters in filing LUT applications annually so they can supply goods and services without payment of IGST, subject to conditions.',
    packages: [
      {
        name: 'Custom',
        price: 'On request',
        description:
          'Simple, quick service typically done once a year per GSTIN.'
      }
    ]
  },
  {
    id: 'gst-advisory',
    name: 'GST Advisory',
    mainHead: 'GOODS & SERVICES TAX',
    categoryId: 'gst-services',
    shortDescription:
      'On‑call GST advisory for complex transactions and structuring.',
    content:
      'We provide written and oral GST opinions on classification, place of supply, rate applicability, composite/mixed supplies and other structuring questions.',
    packages: [
      {
        name: 'Custom',
        price: 'On request',
        description:
          'Hourly or mandate‑based pricing depending on the complexity of issues.'
      }
    ]
  },

  // INCOME TAX – CORE SERVICES
  {
    id: 'pan-card-application',
    name: 'PAN Card Application',
    mainHead: 'INCOME TAX',
    categoryId: 'income-tax',
    shortDescription:
      'Assistance with PAN application for individuals and entities.',
    content:
      'We help prepare and submit PAN applications for individuals, firms and companies, including documentation guidance and tracking until PAN is allotted.',
    packages: [
      {
        name: 'Custom',
        price: 'On request',
        description:
          'Covers documentation, application and basic guidance only.'
      }
    ]
  },
  {
    id: 'tan-registration-service',
    name: 'TAN Registration (Additional)',
    mainHead: 'INCOME TAX',
    categoryId: 'income-tax',
    shortDescription:
      'Additional support for TAN applications linked to income tax compliance.',
    content:
      'Beyond our core TAN Registration package, we can bundle TAN applications with broader income tax and TDS compliance mandates as needed.',
    packages: [
      {
        name: 'Custom',
        price: 'On request',
        description:
          'Pricing tailored to whether the TAN is part of a larger compliance engagement.'
      }
    ]
  },
  {
    id: 'income-tax-notice',
    name: 'Income Tax Notice Handling',
    mainHead: 'INCOME TAX',
    categoryId: 'income-tax',
    shortDescription:
      'Representation and response drafting for income tax notices.',
    content:
      'We review your income tax notices (143(1), 139(9), 148, 156, etc.), prepare responses, assist with documentation and represent you before the department as allowed.',
    packages: [
      {
        name: 'Custom',
        price: 'On request',
        description:
          'Fee based on type of notice, years involved and complexity.'
      }
    ]
  },

  // TRADEMARK & IP SERVICES
  {
    id: 'trademark-registration',
    name: 'Trademark Registration',
    mainHead: 'INTELLECTUAL PROPERTY',
    categoryId: 'trademark-ip',
    shortDescription:
      'End‑to‑end trademark search, filing and follow‑up in India.',
    content:
      'We perform preliminary trademark searches, advise on class selection, file trademark applications and track progress with the registry until registration or further action is required.',
    packages: [
      {
        name: 'Custom',
        price: 'On request',
        description:
          'Quote includes professional fee; government fees are extra as per class and applicant type.'
      }
    ]
  },
  {
    id: 'trademark-rectification',
    name: 'Trademark Rectification',
    mainHead: 'INTELLECTUAL PROPERTY',
    categoryId: 'trademark-ip',
    shortDescription:
      'Rectification of trademark register entries and records.',
    content:
      'We help file rectification requests to correct or remove erroneous entries on the trademark register and represent your matter before the appropriate authorities.',
    packages: [
      {
        name: 'Custom',
        price: 'On request',
        description:
          'Fees depend on grounds of rectification and complexity of history.'
      }
    ]
  },
  {
    id: 'trademark-opposition',
    name: 'Trademark Opposition',
    mainHead: 'INTELLECTUAL PROPERTY',
    categoryId: 'trademark-ip',
    shortDescription:
      'Filing and defending oppositions before the trademark registry.',
    content:
      'We draft and file notices of opposition or counter‑statements, prepare evidence and assist with hearings relating to trademark opposition proceedings.',
    packages: [
      {
        name: 'Custom',
        price: 'On request',
        description:
          'Typically billed in stages: filing, evidence and hearings.'
      }
    ]
  },
  {
    id: 'trademark-objection',
    name: 'Trademark Objection Reply',
    mainHead: 'INTELLECTUAL PROPERTY',
    categoryId: 'trademark-ip',
    shortDescription:
      'Drafting replies to examination reports and objections.',
    content:
      'We review examination reports issued by the trademark registry, craft strong reply statements addressing objections and assist through to hearing, if any.',
    packages: [
      {
        name: 'Custom',
        price: 'On request',
        description:
          'Fixed fee per application, with add‑ons if hearing representation is required.'
      }
    ]
  },
  {
    id: 'trademark-renewal',
    name: 'Trademark Renewal',
    mainHead: 'INTELLECTUAL PROPERTY',
    categoryId: 'trademark-ip',
    shortDescription:
      'Timely renewal of existing registered trademarks.',
    content:
      'We track renewal due dates, prepare and file renewal applications and handle follow‑ups with the trademark office to keep your marks in force.',
    packages: [
      {
        name: 'Custom',
        price: 'On request',
        description:
          'Simple, predictable pricing per mark per class; government fees extra.'
      }
    ]
  },
  {
    id: 'design-registration',
    name: 'Design Registration',
    mainHead: 'INTELLECTUAL PROPERTY',
    categoryId: 'trademark-ip',
    shortDescription:
      'Registration of industrial designs to protect product appearance.',
    content:
      'We help prepare drawings and representations, classify designs, file design applications and track prosecution before the design office.',
    packages: [
      {
        name: 'Custom',
        price: 'On request',
        description:
          'Quote based on number of designs and complexity of drawings.'
      }
    ]
  },
  {
    id: 'copyright-registration',
    name: 'Copyright Registration',
    mainHead: 'INTELLECTUAL PROPERTY',
    categoryId: 'trademark-ip',
    shortDescription:
      'Registration of copyrights for literary, artistic and software works.',
    content:
      'We support filing copyright applications for books, logos, software and other eligible works, and coordinate with the copyright office till issuance.',
    packages: [
      {
        name: 'Custom',
        price: 'On request',
        description:
          'Pricing depends on category of work and number of filings.'
      }
    ]
  },
  {
    id: 'patent-registration',
    name: 'Patent Registration',
    mainHead: 'INTELLECTUAL PROPERTY',
    categoryId: 'trademark-ip',
    shortDescription:
      'Patent drafting and filing assistance with registered patent professionals.',
    content:
      'Through our patent associates we assist with prior art searches, drafting specifications and filing patent applications in India, and managing prosecution.',
    packages: [
      {
        name: 'Custom',
        price: 'On request',
        description:
          'Fees are tailored to technical area and number of claims.'
      }
    ]
  },
  {
    id: 'provisional-patent',
    name: 'Provisional Patent',
    mainHead: 'INTELLECTUAL PROPERTY',
    categoryId: 'trademark-ip',
    shortDescription:
      'Filing of provisional patent applications to secure priority dates.',
    content:
      'We work with patent professionals to prepare and file provisional specifications so you can quickly secure a filing date before finalising complete specifications.',
    packages: [
      {
        name: 'Custom',
        price: 'On request',
        description:
          'Lower‑cost option compared to complete specification; quote on request.'
      }
    ]
  },
  {
    id: 'trademark-assignment',
    name: 'Trademark Assignment',
    mainHead: 'INTELLECTUAL PROPERTY',
    categoryId: 'trademark-ip',
    shortDescription:
      'Drafting and recordal of trademark assignment and licence agreements.',
    content:
      'We draft assignment/ licence deeds, file assignment documents with the registry and ensure changes are properly recorded in the trademark register.',
    packages: [
      {
        name: 'Custom',
        price: 'On request',
        description:
          'Pricing based on number of marks and complexity of transaction.'
      }
    ]
  },
  {
    id: 'trademark-watch',
    name: 'Trademark Watch',
    mainHead: 'INTELLECTUAL PROPERTY',
    categoryId: 'trademark-ip',
    shortDescription:
      'Monitoring of new filings to flag conflicts with your brands.',
    content:
      'We provide periodic watch reports to highlight potentially conflicting trademark applications filed by others so you can take timely action.',
    packages: [
      {
        name: 'Custom',
        price: 'On request',
        description:
          'Subscription‑based service with monthly or quarterly reporting.'
      }
    ]
  },
  {
    id: 'trademark-usa',
    name: 'Trademark in USA',
    mainHead: 'INTELLECTUAL PROPERTY',
    categoryId: 'trademark-ip',
    shortDescription:
      'Filing and prosecution of US trademarks via associate attorneys.',
    content:
      'We coordinate with US counsel to file and prosecute trademark applications before the USPTO, including statements of use and response to office actions.',
    packages: [
      {
        name: 'Custom',
        price: 'On request',
        description:
          'Quote includes associate fees; official fees are extra as per USPTO schedule.'
      }
    ]
  },
  {
    id: 'international-trademark',
    name: 'International Trademark Registration',
    mainHead: 'INTELLECTUAL PROPERTY',
    categoryId: 'trademark-ip',
    shortDescription:
      'Madrid Protocol and multi‑country trademark filing strategies.',
    content:
      'We advise on Madrid Protocol usage and coordinate multi‑jurisdiction filings with local agents in key markets to protect your brands internationally.',
    packages: [
      {
        name: 'Custom',
        price: 'On request',
        description:
          'Budget is tailored to number of countries and classes covered.'
      }
    ]
  },

  // LEGAL & CORPORATE COMPLIANCE – ANNUAL
  {
    id: 'proprietorship-annual-compliance',
    name: 'Proprietorship Annual Compliance',
    mainHead: 'LEGAL COMPLIANCE',
    categoryId: 'legal-compliance',
    shortDescription:
      'Annual income tax, GST and other compliances for proprietorships.',
    content:
      'We manage yearly compliance for proprietorship businesses including GST (where applicable), income tax return filing and other local registrations renewals.',
    packages: [
      {
        name: 'Custom',
        price: 'On request',
        description:
          'Bundled pricing based on turnover and number of registrations.'
      }
    ]
  },
  {
    id: 'partnership-annual-compliance',
    name: 'Partnership Annual Compliance',
    mainHead: 'LEGAL COMPLIANCE',
    categoryId: 'legal-compliance',
    shortDescription:
      'Annual filings and tax compliances for partnership firms.',
    content:
      'We take care of tax returns, TDS, GST and other recurring filings for partnership firms, ensuring partners remain compliant through the year.',
    packages: [
      {
        name: 'Custom',
        price: 'On request',
        description:
          'Fee linked to turnover, number of partners and complexity of operations.'
      }
    ]
  },
  {
    id: 'llp-annual-compliance',
    name: 'LLP Annual Compliance',
    mainHead: 'LEGAL COMPLIANCE',
    categoryId: 'legal-compliance',
    shortDescription:
      'ROC and tax compliances for LLPs including Form 8 & 11.',
    content:
      'We handle mandatory LLP filings with the ROC, along with income tax returns and related compliances for your LLP each year.',
    packages: [
      {
        name: 'Custom',
        price: 'On request',
        description:
          'Quote based on turnover, partner count and audit requirements.'
      }
    ]
  },
  {
    id: 'private-ltd-annual-compliance',
    name: 'Private Limited Annual Compliance',
    mainHead: 'LEGAL COMPLIANCE',
    categoryId: 'legal-compliance',
    shortDescription:
      'Complete annual ROC and tax compliance management for private companies.',
    content:
      'We manage board meetings, annual general meetings, ROC annual filings, income tax returns and routine secretarial work for private limited companies.',
    packages: [
      {
        name: 'Custom',
        price: 'On request',
        description:
          'Retainer‑style packages available for small and mid‑size companies.'
      }
    ]
  },
  {
    id: 'indian-subsidiary-annual-compliance',
    name: 'Indian Subsidiary Annual Compliance',
    mainHead: 'LEGAL COMPLIANCE',
    categoryId: 'legal-compliance',
    shortDescription:
      'Secretarial and tax compliances for Indian subsidiaries of foreign companies.',
    content:
      'We provide specialised compliance services for Indian subsidiaries including FEMA, transfer pricing coordination via tax experts and enhanced reporting needs.',
    packages: [
      {
        name: 'Custom',
        price: 'On request',
        description:
          'Tailored to group structure, related‑party transactions and size.'
      }
    ]
  },
  {
    id: 'section-8-annual-compliance',
    name: 'Section 8 Company Annual Compliance',
    mainHead: 'LEGAL COMPLIANCE',
    categoryId: 'legal-compliance',
    shortDescription:
      'Annual ROC, tax and licence compliances for Section 8 entities.',
    content:
      'We take care of board and members meetings, ROC filings, income tax returns and special reporting for Section 8 companies in line with their charitable status.',
    packages: [
      {
        name: 'Custom',
        price: 'On request',
        description:
          'Pricing adapted to size of operations and donor reporting needs.'
      }
    ]
  },

  // LEGAL & CORPORATE COMPLIANCE – NOTICES, PAYROLL & CORPORATE CHANGES
  {
    id: 'sales-tax-notice',
    name: 'Sales Tax / VAT Notice Handling',
    mainHead: 'LEGAL COMPLIANCE',
    categoryId: 'legal-compliance',
    shortDescription:
      'Support in handling legacy sales tax / VAT notices.',
    content:
      'We help analyse and respond to legacy sales tax and VAT notices from pre‑GST regimes, prepare submissions and coordinate with professionals for hearings.',
    packages: [
      {
        name: 'Custom',
        price: 'On request',
        description:
          'Based on number of years and quantum under dispute.'
      }
    ]
  },
  {
    id: 'professional-tax-notice',
    name: 'Professional Tax Notice Handling',
    mainHead: 'LEGAL COMPLIANCE',
    categoryId: 'legal-compliance',
    shortDescription:
      'Handling of notices and demands under state professional tax laws.',
    content:
      'We review professional tax notices, compute exposure, help regularise registrations and file responses with state authorities.',
    packages: [
      {
        name: 'Custom',
        price: 'On request',
        description:
          'Quote based on number of locations and employees impacted.'
      }
    ]
  },
  {
    id: 'entry-tax-notice',
    name: 'Entry Tax / Local Body Tax Notice',
    mainHead: 'LEGAL COMPLIANCE',
    categoryId: 'legal-compliance',
    shortDescription:
      'Notices relating to entry tax or similar local levies.',
    content:
      'We assist in analysing and responding to entry tax or local body tax notices, including coordinating with indirect tax counsel when litigation is needed.',
    packages: [
      {
        name: 'Custom',
        price: 'On request',
        description:
          'Pricing depends on jurisdiction and years involved.'
      }
    ]
  },
  {
    id: 'epfo-registration',
    name: 'EPFO Registration',
    mainHead: 'LEGAL COMPLIANCE',
    categoryId: 'hr-compliance',
    shortDescription:
      'Statutory registration with EPFO for employers.',
    content:
      'We assist employers in registering with the Employees’ Provident Fund Organisation (EPFO), mapping employees and starting monthly contribution compliances.',
    packages: [
      {
        name: 'Custom',
        price: 'On request',
        description:
          'Quote includes registration and initial configuration support.'
      }
    ]
  },
  {
    id: 'esi-return-filing',
    name: 'ESI Return Filing',
    mainHead: 'LEGAL COMPLIANCE',
    categoryId: 'hr-compliance',
    shortDescription:
      'Periodic ESI return preparation and online filing.',
    content:
      'We manage monthly/half‑yearly ESI returns, ensure correct wage reporting and help respond to ESI inspections or clarifications.',
    packages: [
      {
        name: 'Custom',
        price: 'On request',
        description:
          'Pricing based on employee count and frequency of filings.'
      }
    ]
  },
  {
    id: 'pf-return-filing',
    name: 'PF Return Filing',
    mainHead: 'LEGAL COMPLIANCE',
    categoryId: 'hr-compliance',
    shortDescription:
      'Preparation and filing of monthly PF returns.',
    content:
      'We handle PF return filings, reconciliation with payroll records and support for inspections or compliance drives by EPFO authorities.',
    packages: [
      {
        name: 'Custom',
        price: 'On request',
        description:
          'Subscription‑style pricing aligned to number of employees.'
      }
    ]
  },
  {
    id: 'name-change-company',
    name: 'Name Change of Company',
    mainHead: 'LEGAL COMPLIANCE',
    categoryId: 'legal-compliance',
    shortDescription:
      'End‑to‑end service for changing your company’s legal name.',
    content:
      'We manage name availability checks, members’ approvals, ROC filings and updating statutory registrations after a company name change.',
    packages: [
      {
        name: 'Custom',
        price: 'On request',
        description:
          'Price depends on state stamp duties and number of registrations updated.'
      }
    ]
  },
  {
    id: 'change-registered-office',
    name: 'Change of Registered Office',
    mainHead: 'LEGAL COMPLIANCE',
    categoryId: 'legal-compliance',
    shortDescription:
      'Shifting registered office within city, state or to another state.',
    content:
      'We coordinate resolutions, ROC forms and, where necessary, regional director approvals for change of registered office address, and help update other registrations.',
    packages: [
      {
        name: 'Custom',
        price: 'On request',
        description:
          'Costs vary with whether move is within the same ROC, state or to another state.'
      }
    ]
  },
  {
    id: 'add-director',
    name: 'Add Directors',
    mainHead: 'LEGAL COMPLIANCE',
    categoryId: 'legal-compliance',
    shortDescription:
      'Appointment of additional directors on the board.',
    content:
      'We assist in obtaining DINs, drafting board/shareholder resolutions and filing relevant ROC forms for appointment of directors.',
    packages: [
      {
        name: 'Custom',
        price: 'On request',
        description:
          'Quote based on number of directors and whether DINs are required.'
      }
    ]
  },
  {
    id: 'remove-director',
    name: 'Remove Directors',
    mainHead: 'LEGAL COMPLIANCE',
    categoryId: 'legal-compliance',
    shortDescription:
      'Resignation and removal processes for directors.',
    content:
      'We guide you through voluntary resignations or removals of directors, including notices, meetings and ROC filings in accordance with the Companies Act.',
    packages: [
      {
        name: 'Custom',
        price: 'On request',
        description:
          'Based on whether shareholder approvals and hearings are required.'
      }
    ]
  },
  {
    id: 'increase-authorised-capital',
    name: 'Increase Authorised Capital',
    mainHead: 'LEGAL COMPLIANCE',
    categoryId: 'legal-compliance',
    shortDescription:
      'Process for increasing the authorised share capital of a company.',
    content:
      'We prepare necessary resolutions, alter capital clause, file forms with ROC and coordinate payment of additional stamp duty to increase authorised capital.',
    packages: [
      {
        name: 'Custom',
        price: 'On request',
        description:
          'Government fees and stamp duties are extra as per state and amount.'
      }
    ]
  },
  {
    id: 'moa-amendment',
    name: 'MoA Amendment',
    mainHead: 'LEGAL COMPLIANCE',
    categoryId: 'legal-compliance',
    shortDescription:
      'Alteration of Memorandum of Association objects and clauses.',
    content:
      'We assist in drafting altered MOA, passing special resolutions and filing forms with ROC to amend objects or other MOA clauses.',
    packages: [
      {
        name: 'Custom',
        price: 'On request',
        description:
          'Based on nature and number of clauses to be amended.'
      }
    ]
  },
  {
    id: 'close-llp',
    name: 'Close an LLP',
    mainHead: 'LEGAL COMPLIANCE',
    categoryId: 'legal-compliance',
    shortDescription:
      'Strike‑off or winding‑up of LLPs through prescribed procedures.',
    content:
      'We evaluate eligibility for strike‑off or winding‑up, prepare filings, obtain partner approvals and liaise with ROC until LLP closure is completed.',
    packages: [
      {
        name: 'Custom',
        price: 'On request',
        description:
          'Quote depends on pending compliances and liabilities, if any.'
      }
    ]
  },
  {
    id: 'close-company',
    name: 'Close a Company',
    mainHead: 'LEGAL COMPLIANCE',
    categoryId: 'legal-compliance',
    shortDescription:
      'Fast‑track exit or liquidation support for companies.',
    content:
      'We assist in voluntary strike‑off or liquidation processes for companies, including regulatory filings, clearances and closure of registrations where possible.',
    packages: [
      {
        name: 'Custom',
        price: 'On request',
        description:
          'Costs depend on the financial position of the company and number of open registrations.'
      }
    ]
  },
  {
    id: 'add-partner-llp',
    name: 'Add Partner to LLP',
    mainHead: 'LEGAL COMPLIANCE',
    categoryId: 'legal-compliance',
    shortDescription:
      'Admission of new partners into LLPs and updating LLP Agreement.',
    content:
      'We draft supplementary LLP agreements, complete partner KYC and file necessary forms with ROC for addition of partners to your LLP.',
    packages: [
      {
        name: 'Custom',
        price: 'On request',
        description:
          'Fees based on number of partners added and deed amendments.'
      }
    ]
  },
  {
    id: 'change-llp-agreement',
    name: 'Change LLP Agreement',
    mainHead: 'LEGAL COMPLIANCE',
    categoryId: 'legal-compliance',
    shortDescription:
      'Amendment of LLP agreement terms and partner clauses.',
    content:
      'We help you revise rights and obligations in your LLP agreement and file the amended deed with ROC where mandatory.',
    packages: [
      {
        name: 'Custom',
        price: 'On request',
        description:
          'Pricing based on scope of changes and partner count.'
      }
    ]
  },

  // CONVERSION SERVICES
  {
    id: 'proprietorship-to-partnership',
    name: 'Proprietorship to Partnership Conversion',
    mainHead: 'LEGAL COMPLIANCE',
    categoryId: 'legal-compliance',
    shortDescription:
      'Transition from sole proprietorship to partnership structure.',
    content:
      'We advise on and implement conversion of proprietorship businesses into partnership firms, including drafting of partnership deed and migration of registrations.',
    packages: [
      {
        name: 'Custom',
        price: 'On request',
        description:
          'Quote depends on state registrations and tax IDs to be migrated.'
      }
    ]
  },
  {
    id: 'partnership-to-llp',
    name: 'Partnership to LLP Conversion',
    mainHead: 'LEGAL COMPLIANCE',
    categoryId: 'legal-compliance',
    shortDescription:
      'Conversion of registered/unregistered partnerships into LLPs.',
    content:
      'We manage legal and procedural steps to convert partnerships into LLPs, preserving business continuity while availing LLP benefits.',
    packages: [
      {
        name: 'Custom',
        price: 'On request',
        description:
          'Fees based on partner count and asset/liability structure.'
      }
    ]
  },
  {
    id: 'proprietorship-to-opc',
    name: 'Proprietorship to OPC',
    mainHead: 'LEGAL COMPLIANCE',
    categoryId: 'legal-compliance',
    shortDescription:
      'Migration of proprietorships into One Person Companies.',
    content:
      'We assist proprietors to form OPCs and shift business operations, assets and registrations into the new incorporated entity with minimal disruption.',
    packages: [
      {
        name: 'Custom',
        price: 'On request',
        description:
          'Tailored to size and regulatory footprint of the existing proprietorship.'
      }
    ]
  },
  {
    id: 'opc-to-private-limited',
    name: 'OPC to Private Limited Conversion',
    mainHead: 'LEGAL COMPLIANCE',
    categoryId: 'legal-compliance',
    shortDescription:
      'Conversion of One Person Companies into private limited companies.',
    content:
      'We complete the corporate and ROC procedures to convert OPCs into full‑fledged private limited companies when you outgrow the single‑owner structure.',
    packages: [
      {
        name: 'Custom',
        price: 'On request',
        description:
          'Pricing depends on shareholding structure and compliance status.'
      }
    ]
  },
  {
    id: 'opc-to-public-limited',
    name: 'OPC to Public Limited Conversion',
    mainHead: 'LEGAL COMPLIANCE',
    categoryId: 'legal-compliance',
    shortDescription:
      'Assistance for rare cases of OPC transitioning straight to public limited.',
    content:
      'We guide you on regulatory feasibility and necessary steps to transition OPC structures into public limited companies when expansion plans require it.',
    packages: [
      {
        name: 'Custom',
        price: 'On request',
        description:
          'Custom‑quoted based on capital markets and listing objectives.'
      }
    ]
  },
  {
    id: 'private-to-opc',
    name: 'Private to OPC Company Conversion',
    mainHead: 'LEGAL COMPLIANCE',
    categoryId: 'legal-compliance',
    shortDescription:
      'Restructuring a small private company into OPC form.',
    content:
      'We support downsizing and restructuring into OPC where allowed, including shareholder arrangements and ROC procedures.',
    packages: [
      {
        name: 'Custom',
        price: 'On request',
        description:
          'Quote depends on number of shareholders and outstanding compliances.'
      }
    ]
  },
  {
    id: 'partnership-to-company',
    name: 'Partnership to Company Conversion',
    mainHead: 'LEGAL COMPLIANCE',
    categoryId: 'legal-compliance',
    shortDescription:
      'Transformation of partnership firms into private/public companies.',
    content:
      'We coordinate conversion of partnership firms into companies, handle valuation, share allocation and migration of registrations and licences.',
    packages: [
      {
        name: 'Custom',
        price: 'On request',
        description:
          'Fees are aligned to transaction size and legal complexity.'
      }
    ]
  },
  {
    id: 'llp-to-company',
    name: 'LLP to Company Conversion',
    mainHead: 'LEGAL COMPLIANCE',
    categoryId: 'legal-compliance',
    shortDescription:
      'Assistance with converting LLPs into company structures.',
    content:
      'We help with conversion of LLPs to companies, including legal documentation, ROC procedures and tax considerations through coordinate tax advisors.',
    packages: [
      {
        name: 'Custom',
        price: 'On request',
        description:
          'Custom‑quoted based on LLP size and regulatory requirements.'
      }
    ]
  },
  {
    id: 'private-to-public-company',
    name: 'Private to Public Company Conversion',
    mainHead: 'LEGAL COMPLIANCE',
    categoryId: 'legal-compliance',
    shortDescription:
      'Converting private limited companies into public limited companies.',
    content:
      'We handle board and shareholder approvals, ROC filings and governance changes required to convert a private company into a public company.',
    packages: [
      {
        name: 'Custom',
        price: 'On request',
        description:
          'Fees vary with shareholder base and capital structure.'
      }
    ]
  },
  {
    id: 'public-to-private-company',
    name: 'Public to Private Company Conversion',
    mainHead: 'LEGAL COMPLIANCE',
    categoryId: 'legal-compliance',
    shortDescription:
      'Re‑conversion of public limited companies into private companies.',
    content:
      'We assist public limited companies to reclassify as private companies, subject to regulatory permissions, and update constitutional documents accordingly.',
    packages: [
      {
        name: 'Custom',
        price: 'On request',
        description:
          'Quote based on listing status and shareholder dispersion.'
      }
    ]
  },

  // LIQUOR LICENCES
  {
    id: 'temporary-one-day-function-license',
    name: 'Temporary One Day Function License',
    mainHead: 'MISCELLANEOUS',
    categoryId: 'liquor-licenses',
    shortDescription:
      'One‑day liquor service licence for functions and events.',
    content:
      'We obtain single‑day liquor licences for weddings, corporate events and functions as per your state’s excise rules, coordinating with local authorities.',
    packages: [
      {
        name: 'Custom',
        price: 'On request',
        description:
          'Based on venue, city and expected guest count.'
      }
    ]
  },
  {
    id: 'one-day-foreign-liquor',
    name: 'One Day Permission for Foreign Liquor',
    mainHead: 'MISCELLANEOUS',
    categoryId: 'liquor-licenses',
    shortDescription:
      'Event‑based permission to serve foreign liquor.',
    content:
      'We arrange one‑day permissions to serve foreign liquor at events, as per state‑specific excise regulations and documentation requirements.',
    packages: [
      {
        name: 'Custom',
        price: 'On request',
        description:
          'Fees influenced by state excise fee schedule and event details.'
      }
    ]
  },
  {
    id: 'one-year-lifelong-foreign-liquor',
    name: 'One Year & Lifelong Permission for Foreign Liquor',
    mainHead: 'MISCELLANEOUS',
    categoryId: 'liquor-licenses',
    shortDescription:
      'Long‑term foreign liquor serving permissions for eligible premises.',
    content:
      'We assist clubs, hotels and bars to obtain annual or long‑term foreign liquor permissions, including compliance with infrastructure and documentation norms.',
    packages: [
      {
        name: 'Custom',
        price: 'On request',
        description:
          'Pricing tailored to licence type and category of establishment.'
      }
    ]
  },
  {
    id: 'one-day-country-liquor',
    name: 'One Day Permission for Country Liquor',
    mainHead: 'MISCELLANEOUS',
    categoryId: 'liquor-licenses',
    shortDescription:
      'Single‑day permit to serve country liquor at events.',
    content:
      'We help obtain one‑day country liquor permits where permitted, ensuring compliance with local excise rules and police permissions where needed.',
    packages: [
      {
        name: 'Custom',
        price: 'On request',
        description:
          'Fees based on event, location and type of country liquor permitted.'
      }
    ]
  },
  {
    id: 'wholesale-wine-license',
    name: 'Wholesale License for Wine',
    mainHead: 'MISCELLANEOUS',
    categoryId: 'liquor-licenses',
    shortDescription:
      'Excise licensing for wholesale wine traders.',
    content:
      'We guide you through the process of obtaining wholesale liquor licences for wine distribution, including infrastructure and bond requirements where applicable.',
    packages: [
      {
        name: 'Custom',
        price: 'On request',
        description:
          'Highly jurisdiction‑specific; pricing shared after initial assessment.'
      }
    ]
  },
  {
    id: 'wholesale-country-liquor',
    name: 'Wholesale License for Country Liquor',
    mainHead: 'MISCELLANEOUS',
    categoryId: 'liquor-licenses',
    shortDescription:
      'Wholesale licences for country liquor operations.',
    content:
      'We assist in obtaining wholesale licences for country liquor, meeting warehouse, security and record‑keeping requirements mandated by excise laws.',
    packages: [
      {
        name: 'Custom',
        price: 'On request',
        description:
          'Quote customised to state and volume of operations.'
      }
    ]
  },
  {
    id: 'wholesale-foreign-liquor',
    name: 'Wholesale License for Foreign Liquor',
    mainHead: 'MISCELLANEOUS',
    categoryId: 'liquor-licenses',
    shortDescription:
      'Wholesale excise licence for foreign liquor.',
    content:
      'We help you secure wholesale foreign liquor licences in coordination with excise authorities, covering application, inspections and documentation.',
    packages: [
      {
        name: 'Custom',
        price: 'On request',
        description:
          'Fees are jurisdiction‑specific and shared after a preliminary call.'
      }
    ]
  },
  {
    id: 'permit-room-license',
    name: 'Permit Room License',
    mainHead: 'MISCELLANEOUS',
    categoryId: 'liquor-licenses',
    shortDescription:
      'Licensing of permit rooms attached to hotels and restaurants.',
    content:
      'We support restaurants and hotels in obtaining permit room licences, including layout approvals, FSSAI/trade licence linkage and police NOCs where needed.',
    packages: [
      {
        name: 'Custom',
        price: 'On request',
        description:
          'Based on type of establishment and seating capacity.'
      }
    ]
  },
  {
    id: 'club-license',
    name: 'Club License',
    mainHead: 'MISCELLANEOUS',
    categoryId: 'liquor-licenses',
    shortDescription:
      'Liquor licence for private and membership‑based clubs.',
    content:
      'We arrange club licences for members‑only institutions, advising on documentation, premises suitability and membership rules alignment with excise norms.',
    packages: [
      {
        name: 'Custom',
        price: 'On request',
        description:
          'Jurisdiction and club category impact the overall cost.'
      }
    ]
  },
  {
    id: 'beer-shop-license',
    name: 'Beer Shoppee License',
    mainHead: 'MISCELLANEOUS',
    categoryId: 'liquor-licenses',
    shortDescription:
      'Retail beer shop licensing under state excise laws.',
    content:
      'We support entrepreneurs in obtaining beer shop retail licences, from site selection compliance to documentation and inspections.',
    packages: [
      {
        name: 'Custom',
        price: 'On request',
        description:
          'Highly dependent on local excise policy and quotas.'
      }
    ]
  },
  {
    id: 'mild-liquor-wine-bar',
    name: 'Mild Liquor & Wine Bar License',
    mainHead: 'MISCELLANEOUS',
    categoryId: 'liquor-licenses',
    shortDescription:
      'Licensing for establishments serving mild liquor and wine.',
    content:
      'We help obtain appropriate bar licences allowing service of mild liquor and wine, coordinating with municipal and excise departments as required.',
    packages: [
      {
        name: 'Custom',
        price: 'On request',
        description:
          'Cost varies with city, category of licence and seating capacity.'
      }
    ]
  },
  {
    id: 'wine-bar-license',
    name: 'Wine Bar License',
    mainHead: 'MISCELLANEOUS',
    categoryId: 'liquor-licenses',
    shortDescription:
      'Specialised excise licence for wine bars.',
    content:
      'We arrange wine bar licences, ensuring compliance with zoning, safety and excise stocking norms for wine‑only premises where provided under state law.',
    packages: [
      {
        name: 'Custom',
        price: 'On request',
        description:
          'Quote shared after understanding your location and proposed format.'
      }
    ]
  },
  {
    id: 'wine-shop-license',
    name: 'Wine Shoppee License',
    mainHead: 'MISCELLANEOUS',
    categoryId: 'liquor-licenses',
    shortDescription:
      'Retail licence for wine shops.',
    content:
      'We provide complete support in securing retail licences for wine shops, from application to inspections and final grant of licence.',
    packages: [
      {
        name: 'Custom',
        price: 'On request',
        description:
          'Subject to state excise quota and policy; pricing on enquiry.'
      }
    ]
  },

  // MANDATORY LICENCES & OTHER MISC
  {
    id: 'solvency-certificate',
    name: 'Solvency Certificate',
    mainHead: 'MISCELLANEOUS',
    categoryId: 'mandatory-licenses',
    shortDescription:
      'Assistance in obtaining bank or authority‑issued solvency certificates.',
    content:
      'We guide individuals and businesses in arranging solvency certificates through banks or competent authorities for tenders, visas and other purposes.',
    packages: [
      {
        name: 'Custom',
        price: 'On request',
        description:
          'Fees depend on nature of certificate and required amount.'
      }
    ]
  },
  {
    id: 'principal-employer-registration',
    name: 'Registration of Principal Employer',
    mainHead: 'MISCELLANEOUS',
    categoryId: 'mandatory-licenses',
    shortDescription:
      'Principal employer registration under Contract Labour laws.',
    content:
      'We obtain registrations for principal employers engaging contract labour, ensuring compliance with applicable labour statutes and rules.',
    packages: [
      {
        name: 'Custom',
        price: 'On request',
        description:
          'Pricing aligned to state and number of contractor engagements.'
      }
    ]
  },
  {
    id: 'contract-labour-license-registration',
    name: 'Contractual Labour License Registration',
    mainHead: 'MISCELLANEOUS',
    categoryId: 'mandatory-licenses',
    shortDescription:
      'Contractor licence registrations for supply of contract labour.',
    content:
      'We help contractors obtain and maintain licences under contract labour laws, including timely renewals and amendments to worker strength where necessary.',
    packages: [
      {
        name: 'Custom',
        price: 'On request',
        description:
          'Quote based on state, nature of work and number of workers.'
      }
    ]
  },
  {
    id: 'contract-labour-license-renewal',
    name: 'Contractual Labour License Renewal',
    mainHead: 'MISCELLANEOUS',
    categoryId: 'mandatory-licenses',
    shortDescription:
      'Renewals of existing contractual labour licences.',
    content:
      'We track expiry dates and file timely renewal applications for contract labour licences to avoid penalties and interruptions in work orders.',
    packages: [
      {
        name: 'Custom',
        price: 'On request',
        description:
          'Simple renewal‑focused pricing per licence per year.'
      }
    ]
  },
  {
    id: 'factory-license-registration',
    name: 'Factory License Registration',
    mainHead: 'MISCELLANEOUS',
    categoryId: 'mandatory-licenses',
    shortDescription:
      'Registration and licensing under the Factories Act or state shop/factory rules.',
    content:
      'We support manufacturing units in obtaining factory licences, including building plan approvals, safety compliance and liaison with inspectorates.',
    packages: [
      {
        name: 'Custom',
        price: 'On request',
        description:
          'Fees depend on size of plant and risk category.'
      }
    ]
  },
  {
    id: 'factory-license-renewal',
    name: 'Factory License Renewal',
    mainHead: 'MISCELLANEOUS',
    categoryId: 'mandatory-licenses',
    shortDescription:
      'Renewal of existing factory licences and updating changes.',
    content:
      'We ensure factory licences are renewed on time and updated for material changes in processes, manpower or layouts as required by law.',
    packages: [
      {
        name: 'Custom',
        price: 'On request',
        description:
          'Quote based on state rules and any amendments needed.'
      }
    ]
  },
  {
    id: 'pcb-consent-operate',
    name: 'PCB Consent to Operate',
    mainHead: 'MISCELLANEOUS',
    categoryId: 'mandatory-licenses',
    shortDescription:
      'Pollution Control Board consent to operate industrial units.',
    content:
      'We assist in obtaining Consent to Operate from State Pollution Control Boards, including environmental documentation and liaison with consultants where required.',
    packages: [
      {
        name: 'Custom',
        price: 'On request',
        description:
          'Fees depend on red/orange/green category classification and size of unit.'
      }
    ]
  },
  {
    id: 'pcb-consent-establish',
    name: 'PCB Consent to Establish',
    mainHead: 'MISCELLANEOUS',
    categoryId: 'mandatory-licenses',
    shortDescription:
      'Consent to Establish from Pollution Control Boards before setting up units.',
    content:
      'We work with environment experts to compile project reports and apply for Consent to Establish for new plants and units before construction/installation.',
    packages: [
      {
        name: 'Custom',
        price: 'On request',
        description:
          'Project‑specific pricing shared after preliminary scoping.'
      }
    ]
  },

  // WEB & DIGITAL SERVICES
  {
    id: 'web-designing',
    name: 'Web Designing',
    mainHead: 'MISCELLANEOUS',
    categoryId: 'web-digital',
    shortDescription:
      'Design and development of modern, responsive business websites.',
    content:
      'We create professional websites tailored to your brand, with responsive layouts, basic on‑page SEO and integration of lead‑capture forms.',
    packages: [
      {
        name: 'Custom',
        price: 'On request',
        description:
          'Website pricing depends on number of pages, design complexity and integrations.'
      }
    ]
  },
  {
    id: 'logo-designing',
    name: 'Logo Designing',
    mainHead: 'MISCELLANEOUS',
    categoryId: 'web-digital',
    shortDescription:
      'Professional logo and brand identity design services.',
    content:
      'We work with designers to craft memorable logos and basic brand identity kits that align with your business positioning.',
    packages: [
      {
        name: 'Custom',
        price: 'On request',
        description:
          'Packages vary with number of concepts, revisions and brand assets needed.'
      }
    ]
  },
  {
    id: 'mobile-app-development',
    name: 'Mobile App Development',
    mainHead: 'MISCELLANEOUS',
    categoryId: 'web-digital',
    shortDescription:
      'Custom mobile app development for Android and iOS.',
    content:
      'We scope, design and develop mobile apps through our technology partners, including backend APIs and deployment to app stores.',
    packages: [
      {
        name: 'Custom',
        price: 'On request',
        description:
          'Cost depends on features, platforms and integrations required.'
      }
    ]
  },
  {
    id: 'seo-services',
    name: 'SEO',
    mainHead: 'MISCELLANEOUS',
    categoryId: 'web-digital',
    shortDescription:
      'Search engine optimisation services to improve visibility and leads.',
    content:
      'We provide on‑page and basic off‑page SEO services, keyword strategy, content recommendations and analytics tracking for better search rankings.',
    packages: [
      {
        name: 'Custom',
        price: 'On request',
        description:
          'Retainer‑based SEO plans are customised to your industry and goals.'
      }
    ]
  },
  {
    id: 'web-maintenance',
    name: 'Web Maintenance',
    mainHead: 'MISCELLANEOUS',
    categoryId: 'web-digital',
    shortDescription:
      'Ongoing updates, backups and monitoring for business websites.',
    content:
      'We keep your website secure and up to date with regular backups, content updates, plugin/security patches and uptime monitoring.',
    packages: [
      {
        name: 'Custom',
        price: 'On request',
        description:
          'Monthly/annual maintenance contracts sized to your traffic and update needs.'
      }
    ]
  }
];

export function getServicesByCategory(categoryId: string): Service[] {
  return SERVICES.filter((service) => service.categoryId === categoryId);
}

export function getServiceById(id: string): Service | undefined {
  return SERVICES.find((service) => service.id === id);
}

