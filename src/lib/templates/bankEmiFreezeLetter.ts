export interface EmiFreezeLetterData {
  date: string;
  lenderName: string;
  branchAddress?: string;
  loanAccountNumber: string;
  loanType: string;
  deceasedName: string;
  deceasedPan?: string;
  dateOfPassing: string;
  claimantName: string;
  claimantRelationship: string;
  claimantContact: string;
  claimantEmail: string;
  claimantAddress?: string;
  hasInsuranceShield: 'yes' | 'no' | 'unknown';
}

export function generateEmiFreezeLetter(data: EmiFreezeLetterData): string {
  return `FORMAL NOTICE: INTIMATION OF BORROWER DEMISE & REQUEST FOR IMMEDIATE MORATORIUM / FREEZE OF AUTO-DEBITS (NACH/ECS)

Date: ${data.date}

To,
The Branch Manager / Nodal Credit Officer,
${data.lenderName}
${data.branchAddress ? data.branchAddress : 'Retail Asset Operations Division'}

Subject: Formal Intimation of the Demise of Primary Borrower Late ${data.deceasedName} (Loan A/C No: ${data.loanAccountNumber}) and Request for Immediate Suspension of NACH/ECS Mandates and Verification of Credit Protection Insurance.

Dear Sir / Madam,

1. INTIMATION OF PASSING:
With profound sorrow, I hereby formally notify your institution of the passing of the primary borrower, Late ${data.deceasedName} (PAN: ${data.deceasedPan || 'As per your records'}), who passed away on ${data.dateOfPassing}. I am writing this communication in my capacity as the ${data.claimantRelationship} and legal representative of the deceased. A copy of the Municipal Death Certificate is annexed herewith as Annexure-A.

2. IMMEDIATE FREEZE ON AUTOMATED DEBITS (NACH / ECS / SI):
In view of the borrower's demise, the operative bank accounts are undergoing statutory deceased-settlement and cannot be operated. Therefore, you are formally requested to IMMEDIATELY CEASE, FREEZE, AND CANCEL all active NACH/e-NACH, ECS, and Standing Instruction mandates linked to Loan Account Number: ${data.loanAccountNumber}. 

Please note that any further automated debit attempts will result in unavoidable technical bounces. In accordance with Reserve Bank of India (RBI) guidelines on Fair Lending Practices, no bounce penalty charges, penal interest, or overdue charges shall be levied on this account from the date of demise (${data.dateOfPassing}).

3. VERIFICATION OF CREDIT PROTECTION INSURANCE / LOAN SURAKSHA:
${data.hasInsuranceShield === 'yes' ? 
`As per our records, the subject loan was secured by a Credit Protection / Loan Group Life Insurance policy (e.g., Sarv Suraksha / Home Loan Life Cover) sanctioned at the time of loan disbursement. You are hereby requested to immediately forward the claim dossier to the tied insurer and credit the policy insurance claim directly towards the outstanding loan balance.` :
data.hasInsuranceShield === 'unknown' ?
`We request you to urgently inspect the loan sanction letter and verify whether any bundled Credit Life Insurance or Loan Protection Policy was purchased at the time of disbursement. If so, kindly furnish the policy details and claim settlement intimation format at the earliest.` :
`We request you to provide a comprehensive statement of outstanding dues, without any penal interest post the date of demise, to enable the legal heirs to review the liabilities against the estate assets.`
}

4. PROTECTION AGAINST COERCIVE RECOVERY:
As established by judicial precedents and the RBI Fair Practices Code for Lenders, surviving family members do not bear personal liability for the debts of the deceased beyond the value of any assets actually inherited from the estate. Kindly ensure that your retail collection teams and third-party recovery agencies are immediately instructed to refrain from unsolicited phone calls, home visits, or coercive measures during this bereavement period.

5. COMMUNICATION & RECORDS:
All future communications regarding this loan account should be addressed exclusively to the undersigned:
Name: ${data.claimantName} (${data.claimantRelationship})
Contact Phone: ${data.claimantContact}
Email Address: ${data.claimantEmail}

Kindly acknowledge receipt of this notice in writing with a formal reference number.

Yours sincerely,

___________________________
${data.claimantName}
(${data.claimantRelationship} of Late ${data.deceasedName})
Enclosures:
1. Certified True Copy of Municipal Death Certificate (Annexure-A)
2. Identity & Address Proof of Claimant (Aadhaar / PAN) (Annexure-B)
3. Loan Sanction / Repayment Schedule Copy (if available)`;
}
