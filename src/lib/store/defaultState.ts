import { EstateState } from '../types/estate';

export const DEFAULT_INITIAL_STATE: EstateState = {
  id: 'estate_new',
  lastUpdated: new Date().toISOString(),
  deceased: {
    fullName: '',
    dateOfPassing: '',
    panNumber: '',
    hasAadhaar: true,
    employmentType: 'salaried_private',
    employerName: '',
    hasWill: false,
    willProbated: false,
  },
  claimant: {
    fullName: '',
    relationship: 'spouse',
    contactNumber: '',
    email: '',
    panNumber: '',
    isSoleLegalHeir: false,
    hasOtherHeirsConsent: true,
  },
  assets: [],
  liabilities: [],
  tasks: [
    {
      id: 'task_init_1',
      phase: 'day_1_7',
      title: 'Obtain 10-15 Original Copies of Municipal Death Certificate',
      description: 'Crucial first step: Indian banks, EPFO, and insurers require physical sighting of original certificates bearing the Municipal Registrar QR code.',
      urgency: 'high',
      completed: false,
      statutoryReference: 'Registration of Births and Deaths Act, 1969',
      actionLink: 'https://crsorgi.gov.in'
    },
    {
      id: 'task_init_2',
      phase: 'day_1_7',
      title: 'Halt Automatic Bank Debits (NACH/ECS) to Prevent Penal Charges',
      description: 'Freeze automatic deduction for loans and utilities to prevent bounce fees and overdrafts on deceased accounts.',
      urgency: 'high',
      completed: false,
      statutoryReference: 'RBI Fair Practices Code for Lenders',
      actionLink: '/liabilities'
    },
    {
      id: 'task_init_3',
      phase: 'day_8_30',
      title: 'Submit Deceased Claim to Primary Bank with Registered Nominee',
      description: 'Under RBI rules, banks must disburse proceeds within 15 days of receiving KYC and Death Certificate without probate.',
      urgency: 'high',
      completed: false,
      statutoryReference: 'RBI Master Circular Para 19',
      actionLink: '/claims'
    },
    {
      id: 'task_init_4',
      phase: 'day_8_30',
      title: 'Intimate Employer & Submit EPFO Form 5IF for Free EDLI Life Cover',
      description: 'Statutory life insurance up to ₹7 Lakhs is payable directly to nominees for active PF members.',
      urgency: 'high',
      completed: false,
      statutoryReference: 'Employees Deposit Linked Insurance Scheme',
      actionLink: '/claims'
    },
    {
      id: 'task_init_5',
      phase: 'day_30_plus',
      title: 'Search RBI UDGAM Portal for Dormant Accounts & Unclaimed Deposits',
      description: 'Check centralized RBI directory for forgotten savings accounts, fixed deposits, and cooperative bank funds.',
      urgency: 'medium',
      completed: false,
      statutoryReference: 'RBI DEAF / UDGAM Framework',
      actionLink: '/unclaimed'
    }
  ],
  documents: [
    {
      id: 'doc_init_1',
      name: 'Original Death Certificate (Municipal / Gram Panchayat with QR)',
      purpose: 'Foundational prerequisite across all financial settlements in India.',
      procurementAgency: 'Local Registrar of Births and Deaths / Municipal Corp',
      mandatoryFor: ['bank_account', 'fixed_deposit', 'epf_ppf', 'life_insurance', 'mutual_funds'],
      isAvailable: false,
      status: 'missing',
      copiesNeeded: 15
    },
    {
      id: 'doc_init_2',
      name: 'Claimant KYC (Aadhaar & PAN Cards)',
      purpose: 'Verification of claimant identity and electronic NEFT bank transfer.',
      procurementAgency: 'UIDAI / Income Tax Dept',
      mandatoryFor: ['bank_account', 'fixed_deposit', 'epf_ppf', 'life_insurance'],
      isAvailable: false,
      status: 'missing',
      copiesNeeded: 5
    },
    {
      id: 'doc_init_3',
      name: 'Surviving Member Certificate / Legal Heir Certificate',
      purpose: 'Identifies all eligible family heirs for claims without nomination or property transfer.',
      procurementAgency: 'Revenue Department / Tehsildar / e-District',
      mandatoryFor: ['bank_account', 'real_estate'],
      isAvailable: false,
      status: 'missing',
      copiesNeeded: 5
    }
  ]
};
