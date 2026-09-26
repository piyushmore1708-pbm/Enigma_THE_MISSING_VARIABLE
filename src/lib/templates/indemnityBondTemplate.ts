export interface IndemnityBondData {
  claimantName: string;
  claimantAge: string;
  claimantAddress: string;
  deceasedName: string;
  dateOfPassing: string;
  institutionName: string;
  accountNumber: string;
  claimAmount: string;
  suretyName: string;
  suretyAddress: string;
}

export function generateIndemnityBondText(data: IndemnityBondData): string {
  return `LETTER OF INDEMNITY WITH RESPECT TO PAYMENT OF BALANCE IN THE ACCOUNT OF DECEASED DEPOSITOR WITHOUT PRODUCTION OF LEGAL REPRESENTATION
(To be stamped as an Indemnity Bond as per the Stamp Act applicable in the State)

THIS DEED OF INDEMNITY is executed on this day by:

1. ${data.claimantName}, aged about ${data.claimantAge} years, residing at ${data.claimantAddress} (hereinafter called "the Claimant", which expression shall include their heirs, executors, administrators, and assigns) of the FIRST PART;
AND
2. ${data.suretyName}, residing at ${data.suretyAddress} (hereinafter called "the Surety") of the SECOND PART;

IN FAVOR OF:
${data.institutionName} (hereinafter called "the Bank/Authority", which expression shall include its successors and assigns) of the THIRD PART.

WHEREAS:
1. Late ${data.deceasedName} was maintaining an account/folio/holding bearing Number ${data.accountNumber} with the Bank/Authority.
2. The said Late ${data.deceasedName} departed this life on ${data.dateOfPassing} intestate and without having made any registered nomination.
3. The Claimant is the rightful legal heir of the deceased and has applied to the Bank to release the balance standing to the credit of the said account amounting to approximately ₹${data.claimAmount}/-.
4. The Bank has agreed to pay the said amount to the Claimant on the condition that the Claimant and the Surety indemnify the Bank against all claims, demands, actions, and expenses.

NOW THIS DEED WITNESSETH AS FOLLOWS:
In consideration of the Bank paying the sum of ₹${data.claimAmount}/- to the Claimant without requiring production of a Succession Certificate or Probate of Will:
1. The Claimant and the Surety jointly and severally agree to indemnify and hold harmless the Bank, its officers, and agents against all losses, damages, costs, charges, and expenses whatsoever which the Bank may incur or suffer by reason of any third-party claim or adverse title asserted by any other person or heir.
2. In the event of any claim being made by any other person against the Bank in respect of the said amount, the Claimant and Surety undertake to immediately repay to the Bank the full amount along with interest and costs.

IN WITNESS WHEREOF the Claimant and Surety have set their hands hereunto.

Claimant Signature: _______________________
Name: ${data.claimantName}

Surety Signature: _________________________
Name: ${data.suretyName}

Witness 1:
Name & Address: __________________________
Signature: _______________________________

Witness 2:
Name & Address: __________________________
Signature: _______________________________
`;
}
