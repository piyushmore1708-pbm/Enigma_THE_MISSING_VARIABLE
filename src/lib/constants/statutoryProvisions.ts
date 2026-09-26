export interface StatutoryFact {
  id: string;
  topic: string;
  headline: string;
  legalAct: string;
  explanation: string;
  actionAdvice: string;
  badge: 'Critical Protection' | 'Statutory Right' | 'Immediate Action';
}

export const STATUTORY_PROVISIONS: StatutoryFact[] = [
  {
    id: 'nominee_vs_legal_heir',
    topic: 'Nominee vs. Legal Heir Law',
    headline: 'Who actually owns the money: Nominee or Legal Heir?',
    legalAct: 'Supreme Court of India (Shakti Yezdani v. Jayanand Jayant Salgaonkar, 2023)',
    explanation: 'In Indian banking and company law, a Nominee is merely a "temporary custodian/trustee" designated to receive the funds from the institution so that the bank gets a valid discharge. The legal heirs according to the applicable succession law (Hindu Succession Act, Indian Succession Act, etc.) remain the ultimate beneficial owners. EXCEPTION: Under Section 39 of the Insurance Act (amended 2015), if the nominee is spouse, children, or parents, they are "Beneficial Nominees" and become the sole absolute owners.',
    actionAdvice: 'If you are the beneficial nominee on Life Insurance, you do not need consent from distant relatives. For bank accounts, procure written No Objection Certificates (NOC) from all Class-I legal heirs to prevent future civil claims.',
    badge: 'Statutory Right'
  },
  {
    id: 'rbi_15_day_mandate',
    topic: 'RBI 15-Day Claim Settlement Rule',
    headline: 'Banks must settle nominee claims within 15 calendar days',
    legalAct: 'RBI Master Circular on Customer Service in Banks (DBOD.No.Leg.BC. 21 /09.07.006/2015-16)',
    explanation: 'The Reserve Bank of India strictly mandates that where nomination exists or survivor mandate (Either or Survivor / Former or Survivor) is recorded, banks MUST settle the claim and release the balance to the nominee within 15 days of receiving the death certificate and proof of identity, without demanding succession certificate or probate.',
    actionAdvice: 'Quote Paragraph 19 of the RBI Master Circular in your bank submission cover letter if branch staff causes unnecessary procedural delays.',
    badge: 'Critical Protection'
  },
  {
    id: 'epfo_edli_assurance',
    topic: 'EPFO EDLI Free Insurance (Up to ₹7,00,000)',
    headline: 'Active PF subscribers automatically have ₹2.5L to ₹7L life insurance',
    legalAct: "Employees' Deposit Linked Insurance Scheme, 1976 (Section 6C of EPF Act)",
    explanation: 'If the deceased was an active employee contributing to EPF at the time of death, their nominee/family is entitled to an automatic life insurance payout ranging between ₹2,50,000 and ₹7,00,000 under Form 5IF. This requires zero premium deductions from the employee salary.',
    actionAdvice: 'Submit EPFO Form 5IF alongside Form 20 (PF withdrawal) and Form 10D (Monthly widow/children pension) through the employer HR immediately.',
    badge: 'Critical Protection'
  },
  {
    id: 'loan_moratorium_harassment',
    topic: 'Protection Against EMI Deductions & Recovery Agents',
    headline: 'Illegal recovery harassment & automatic debit freezes',
    legalAct: 'RBI Fair Practices Code for Lenders & Guidelines on Recovery Agents',
    explanation: 'Lenders cannot harass grieving family members or use coercive recovery agents after being formally notified of the borrower’s demise. Furthermore, heirs are ONLY liable to the extent of the assets inherited from the deceased; personal assets of surviving family members cannot be attached for the deceased’s unsecured debts (like credit cards or personal loans).',
    actionAdvice: 'Send the formal Claim Sathi Death Intimation & Moratorium Notice immediately to cancel NACH mandates and ascertain if loan protection insurance (Sarv Suraksha / Home Shield) was bundled with the loan.',
    badge: 'Immediate Action'
  }
];
