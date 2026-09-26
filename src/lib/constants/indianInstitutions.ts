export interface InstitutionDirectoryItem {
  id: string;
  name: string;
  category: 'bank' | 'insurance' | 'epfo_pension' | 'demat_mutual_fund' | 'statutory_authority';
  claimPortalUrl: string;
  tollFreeNumber?: string;
  nodalEmail?: string;
  commonDeceasedForms: string[];
  keyGuidelines: string;
}

export const INDIAN_INSTITUTIONS: InstitutionDirectoryItem[] = [
  {
    id: 'sbi',
    name: 'State Bank of India (SBI)',
    category: 'bank',
    claimPortalUrl: 'https://sbi.co.in/web/personal-banking/claims-of-deceased-depositors',
    tollFreeNumber: '1800 1234 / 1800 2100',
    nodalEmail: 'customercare@sbi.co.in',
    commonDeceasedForms: ['Annexure-A (Claim with Nomination)', 'Annexure-B (Indemnity Bond for without Nomination)'],
    keyGuidelines: 'Settlement without nomination allowed up to ₹5,00,000 against simple indemnity bond and letter of disclaimer without requiring succession certificate.'
  },
  {
    id: 'hdfc_bank',
    name: 'HDFC Bank',
    category: 'bank',
    claimPortalUrl: 'https://www.hdfcbank.com/personal/useful-links/deceased-claim',
    tollFreeNumber: '1800 202 6161',
    nodalEmail: 'support@hdfcbank.com',
    commonDeceasedForms: ['Deceased Claim Application Form', 'Letter of Indemnity', 'Legal Heir Affidavit'],
    keyGuidelines: 'Nominee claim settled within 15 days of receiving KYC and original death certificate verification.'
  },
  {
    id: 'icici_bank',
    name: 'ICICI Bank',
    category: 'bank',
    claimPortalUrl: 'https://www.icicibank.com/personal-banking/faq/deceased-claim',
    tollFreeNumber: '1800 1080',
    nodalEmail: 'customer.care@icicibank.com',
    commonDeceasedForms: ['Claim Form for Deceased Depositor', 'Declaration of Legal Heirs'],
    keyGuidelines: 'Survivor/Nominee clause allows seamless account closure without probate for accounts with survivorship mandate.'
  },
  {
    id: 'pnb',
    name: 'Punjab National Bank (PNB)',
    category: 'bank',
    claimPortalUrl: 'https://www.pnbindia.in/deceased-claims.html',
    tollFreeNumber: '1800 180 2222',
    nodalEmail: 'care@pnb.co.in',
    commonDeceasedForms: ['Form PNB-372 (Nominee Settlement)', 'Annexure-C (Without Nominee)'],
    keyGuidelines: 'Unclaimed accounts dormant for >10 years are searchable on RBI UDGAM portal under PNB category.'
  },
  {
    id: 'epfo',
    name: "EPFO (Employees' Provident Fund Organisation)",
    category: 'epfo_pension',
    claimPortalUrl: 'https://unifiedportal-mem.epfindia.gov.in/memberinterface/',
    tollFreeNumber: '1800 118 005',
    nodalEmail: 'employeefeedback@epfindia.gov.in',
    commonDeceasedForms: [
      "Form 20 (PF Final Settlement for Nominees/Legal Heirs)",
      "Form 10D (Monthly EPS Widow/Children Pension)",
      "Form 5IF (EDLI Life Insurance Assistance up to ₹7,00,000)"
    ],
    keyGuidelines: 'EDLI provides life insurance coverage up to ₹7 Lakhs for any active employee dying in service, requiring NO employee premium.'
  },
  {
    id: 'lic_india',
    name: 'Life Insurance Corporation of India (LIC)',
    category: 'insurance',
    claimPortalUrl: 'https://licindia.in/web/guest/claim-procedure',
    tollFreeNumber: '1800 425 9876',
    nodalEmail: 'co_claims@licindia.com',
    commonDeceasedForms: ['Form 3783 (Claimant Statement)', 'Form 3816 (Medical Attendant Cert)'],
    keyGuidelines: 'For policies with Beneficial Nominee under Section 39, claim proceeds cannot be attached or contested by distant heirs.'
  },
  {
    id: 'rbi_udgam',
    name: 'RBI UDGAM Portal (Unclaimed Deposits)',
    category: 'statutory_authority',
    claimPortalUrl: 'https://udgam.rbi.org.in',
    tollFreeNumber: '14440 (RBI Helpline)',
    commonDeceasedForms: ['UDGAM Search Reference ID printout', 'Bank-specific Deceased Claim Pack'],
    keyGuidelines: 'Centralized search portal covering 30+ major banks to discover dormant savings, current, and term deposits inactive for >10 years.'
  },
  {
    id: 'iepf_authority',
    name: 'IEPF Authority (Ministry of Corporate Affairs)',
    category: 'statutory_authority',
    claimPortalUrl: 'https://www.iepf.gov.in',
    tollFreeNumber: '1800 114 667',
    nodalEmail: 'iepf@mca.gov.in',
    commonDeceasedForms: ['Form IEPF-5 (Online Application)', 'Advance Stamp Receipt', 'Indemnity Bond (Non-Judicial)'],
    keyGuidelines: 'Unclaimed dividends and physical/demat shares transferred to IEPF after 7 consecutive years of non-claim can be retrieved by legal heirs.'
  }
];
