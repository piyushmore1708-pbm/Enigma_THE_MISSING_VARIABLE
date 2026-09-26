export type RelationshipToDeceased =
  | 'spouse'
  | 'son'
  | 'daughter'
  | 'father'
  | 'mother'
  | 'sibling'
  | 'legal_heir'
  | 'other';

export type EmploymentType =
  | 'salaried_private'
  | 'salaried_govt'
  | 'self_employed'
  | 'retired_pensioner'
  | 'homemaker'
  | 'unemployed';

export type AssetCategory =
  | 'bank_account'
  | 'fixed_deposit'
  | 'epf_ppf'
  | 'nps_pension'
  | 'demat_stocks'
  | 'mutual_funds'
  | 'life_insurance'
  | 'health_insurance'
  | 'real_estate'
  | 'gold_locker'
  | 'post_office'
  | 'crypto_digital';

export type ClaimStatus =
  | 'not_started'
  | 'documents_gathering'
  | 'submitted'
  | 'in_review'
  | 'settled'
  | 'disputed';

export type DocumentStatus = 'gathered' | 'applied' | 'missing';

export interface DeceasedProfile {
  fullName: string;
  dateOfPassing: string;
  panNumber?: string;
  hasAadhaar: boolean;
  employmentType: EmploymentType;
  employerName?: string;
  hasWill: boolean;
  willProbated?: boolean;
}

export interface ClaimantProfile {
  fullName: string;
  relationship: RelationshipToDeceased;
  contactNumber: string;
  email: string;
  panNumber?: string;
  isSoleLegalHeir: boolean;
  hasOtherHeirsConsent: boolean;
}

export interface EstateAsset {
  id: string;
  category: AssetCategory;
  institutionName: string;
  accountOrFolioNumber?: string;
  estimatedValue?: number;
  hasNomineeRegistered: 'yes' | 'no' | 'unknown';
  nomineeName?: string;
  claimStatus: ClaimStatus;
  notes?: string;
  relevantForms: string[];
}

export interface EstateLiability {
  id: string;
  type: 'home_loan' | 'personal_loan' | 'car_loan' | 'credit_card' | 'education_loan' | 'utility_emi';
  lenderName: string;
  accountNumber?: string;
  outstandingBalance?: number;
  monthlyEmiAmount?: number;
  emiDueDate?: number; // 1-31
  autoDebitActive: boolean;
  noticeSent: boolean;
  moratoriumRequested: boolean;
  hasLoanInsurancePolicy: 'yes' | 'no' | 'unknown';
}

export interface PlaybookTask {
  id: string;
  phase: 'day_1_7' | 'day_8_30' | 'day_30_plus';
  title: string;
  description: string;
  urgency: 'high' | 'medium' | 'low';
  completed: boolean;
  completedAt?: string;
  statutoryReference?: string;
  actionLink?: string;
}

export interface RequiredDocument {
  id: string;
  name: string;
  purpose: string;
  procurementAgency: string;
  mandatoryFor: AssetCategory[];
  isAvailable: boolean;
  status: DocumentStatus;
  copiesNeeded: number;
  notes?: string;
}

export interface EstateState {
  id: string;
  lastUpdated: string;
  deceased: DeceasedProfile;
  claimant: ClaimantProfile;
  assets: EstateAsset[];
  liabilities: EstateLiability[];
  tasks: PlaybookTask[];
  documents: RequiredDocument[];
}

export interface DemoPersona {
  id: string;
  name: string;
  tagline: string;
  badge: string;
  description: string;
  state: EstateState;
}

export interface FinancialFootprintTies {
  banks: string[];
  retirement: string[];
  insurance: string[];
  investments: string[];
  liabilities: string[];
}
