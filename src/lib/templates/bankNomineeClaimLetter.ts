export interface BankClaimLetterData {
  date: string;
  bankName: string;
  branchName?: string;
  accountNumber: string;
  accountType: string;
  deceasedName: string;
  dateOfPassing: string;
  claimantName: string;
  claimantRelationship: string;
  claimantPan: string;
  claimantAadhaarLast4?: string;
  claimantBankName: string;
  claimantAccountNo: string;
  claimantIfsc: string;
}

export function generateBankNomineeClaimLetter(data: BankClaimLetterData): string {
  return `CLAIM APPLICATION FOR DECEASED DEPOSITOR SETTLEMENT (NOMINEE / SURVIVOR)
Under Para 19 of RBI Master Circular on Customer Service in Banks

Date: ${data.date}

To,
The Branch Manager,
${data.bankName},
${data.branchName || 'Local Branch Operations'}

Subject: Settlement of Account Balance / Fixed Deposit of Deceased Depositor Late ${data.deceasedName} (A/C No: ${data.accountNumber}) in favor of Registered Nominee.

Dear Sir / Madam,

1. DECEASED DEPOSITOR DETAILS:
I deeply regret to inform you that your esteemed accountholder, Late ${data.deceasedName}, passed away on ${data.dateOfPassing}. The original/certified Municipal Death Certificate is submitted herewith for your official verification.

Account Details:
- Account / FD Number: ${data.accountNumber}
- Account Type: ${data.accountType}
- Name of Account Holder: Late ${data.deceasedName}

2. NOMINATION STATUS & RIGHT TO CLAIM:
I, ${data.claimantName}, am the registered nominee for the above-captioned account (Relationship: ${data.claimantRelationship}). In accordance with Section 45ZA of the Banking Regulation Act, 1949 and Paragraph 19 of the RBI Master Circular on Customer Service in Banks (DBOD.No.Leg.BC.21/09.07.006/2015-16), a bank is mandated to release the balance lying in the account to the registered nominee upon production of satisfactory proof of death and identity of the nominee, without insisting on a Succession Certificate, Probate, or Letters of Administration.

3. DISCHARGE & BENEFICIARY ELECTRONIC TRANSFER DETAILS:
I confirm that my receipt of the proceeds shall constitute a full and valid discharge to the bank. Kindly credit the balance proceeds, including any accrued interest up to the date of settlement, to my savings account via NEFT/RTGS as per the details below:

- Beneficiary Account Name: ${data.claimantName}
- Beneficiary Bank & Branch: ${data.claimantBankName}
- Account Number: ${data.claimantAccountNo}
- IFSC Code: ${data.claimantIfsc}
- PAN: ${data.claimantPan}

4. TIME-BOUND SETTLEMENT REQUEST:
As per RBI guidelines, banks are required to settle claims within 15 calendar days from the date of submission of all necessary documents. Kindly acknowledge receipt of this application on the duplicate copy and initiate the processing.

Yours faithfully,

___________________________
${data.claimantName}
(Registered Nominee / ${data.claimantRelationship})

Enclosures:
1. Certified True Copy of Municipal Death Certificate
2. Self-Attested Copy of Claimant PAN Card & Aadhaar Card
3. Claimant Cancelled Cheque for NEFT Credit
4. Original Passbook / Fixed Deposit Receipt / Cheque Book (if available)`;
}
