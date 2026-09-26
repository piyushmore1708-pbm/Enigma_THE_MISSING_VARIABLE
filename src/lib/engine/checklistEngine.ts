import { EstateAsset, EstateLiability, DeceasedProfile, ClaimantProfile, RequiredDocument, DocumentStatus } from '../types/estate';

export interface IntelligentRiskFlag {
  id: string;
  type: 'danger' | 'warning' | 'statutory_benefit' | 'info';
  title: string;
  description: string;
  actionLabel: string;
  actionUrl: string;
}

export function computeRiskFlags(
  assets: EstateAsset[],
  liabilities: EstateLiability[],
  deceased: DeceasedProfile,
  claimant: ClaimantProfile
): IntelligentRiskFlag[] {
  const flags: IntelligentRiskFlag[] = [];

  // 1. Flag active loan auto-debits without moratorium notice
  const unhaltedAutoDebits = liabilities.filter(l => l.autoDebitActive && !l.noticeSent);
  if (unhaltedAutoDebits.length > 0) {
    const totalEmi = unhaltedAutoDebits.reduce((sum, l) => sum + (l.monthlyEmiAmount || 0), 0);
    flags.push({
      id: 'risk_auto_debits',
      type: 'danger',
      title: `${unhaltedAutoDebits.length} Active NACH Auto-Debits Scheduled (₹${totalEmi.toLocaleString('en-IN')}/mo)`,
      description: `Inward ECS/NACH deductions will bounce with steep penalty charges and credit bureau negative reporting. A formal notice must be served immediately to freeze debits.`,
      actionLabel: 'Generate Freeze Notice',
      actionUrl: '/liabilities',
    });
  }

  // 2. Flag assets with missing / unverified nominees
  const missingNomineeAssets = assets.filter(a => a.hasNomineeRegistered === 'no' || a.hasNomineeRegistered === 'unknown');
  if (missingNomineeAssets.length > 0) {
    const missingTotal = missingNomineeAssets.reduce((sum, a) => sum + (a.estimatedValue || 0), 0);
    flags.push({
      id: 'risk_missing_nominees',
      type: 'warning',
      title: `${missingNomineeAssets.length} Holdings Lack Registered Nominees (₹${missingTotal.toLocaleString('en-IN')})`,
      description: `Without a registered nominee, banks require an Indemnity Bond and Surviving Member / Legal Heir Certificate before releasing funds.`,
      actionLabel: 'View Indemnity Format',
      actionUrl: '/claims',
    });
  }

  // 3. Highlight EPFO EDLI Statutory Benefit
  const isPrivateSalaried = deceased.employmentType === 'salaried_private';
  const hasEpfoAsset = assets.some(a => a.category === 'epf_ppf');
  if (isPrivateSalaried || hasEpfoAsset) {
    flags.push({
      id: 'statutory_edli_cover',
      type: 'statutory_benefit',
      title: "Automatic EPFO EDLI Life Insurance Cover (Up to ₹7,00,000)",
      description: `Under Section 6C of the EPF Act, active members have automatic life insurance paid directly to nominees via Form 5IF with zero employee deduction.`,
      actionLabel: 'Download Form 5IF Guide',
      actionUrl: '/claims',
    });
  }

  // 4. Multiple Legal Heirs without consent
  if (!claimant.isSoleLegalHeir && !claimant.hasOtherHeirsConsent) {
    flags.push({
      id: 'risk_legal_heir_dispute',
      type: 'warning',
      title: "Multiple Legal Heirs - Relinquishment Deeds or Joint Claims Needed",
      description: `Other Class-I heirs have not recorded unanimous consent. Banks may require a Letter of Disclaimer or joint application from all heirs.`,
      actionLabel: 'Review Legal Heir Rights',
      actionUrl: '/overview',
    });
  }

  return flags;
}

export function computeDynamicChecklist(
  assets: EstateAsset[],
  liabilities: EstateLiability[],
  deceased: DeceasedProfile,
  claimant: ClaimantProfile,
  existingDocs: RequiredDocument[] = []
): RequiredDocument[] {
  const existingMap = new Map(existingDocs.map(d => [d.id, d]));
  const computedDocs: RequiredDocument[] = [];

  // Helper to preserve user's existing status
  const getStatus = (id: string, defaultStatus: DocumentStatus = 'missing'): DocumentStatus => {
    const existing = existingMap.get(id);
    if (existing?.status) return existing.status;
    if (existing?.isAvailable) return 'gathered';
    return defaultStatus;
  };

  const getIsAvailable = (id: string, defaultVal: boolean = false): boolean => {
    const existing = existingMap.get(id);
    if (existing !== undefined) return existing.isAvailable || existing.status === 'gathered';
    return defaultVal;
  };

  // 1. Municipal Death Certificate
  const institutionCount = new Set([
    ...assets.map(a => a.institutionName),
    ...liabilities.map(l => l.lenderName)
  ]).size;
  const copiesNeeded = Math.min(Math.max(10, institutionCount * 2 + 4), 20);

  computedDocs.push({
    id: 'doc_death_cert',
    name: 'Original Municipal Death Certificate (with QR Code)',
    purpose: 'Universal prerequisite for banks, EPFO, registrar, and insurance payouts.',
    procurementAgency: 'Municipal Corporation / Nagar Palika / Panchayat (crsorgi.gov.in)',
    mandatoryFor: ['bank_account', 'fixed_deposit', 'epf_ppf', 'life_insurance', 'mutual_funds', 'demat_stocks'],
    isAvailable: getIsAvailable('doc_death_cert'),
    status: getStatus('doc_death_cert'),
    copiesNeeded,
    notes: 'Ensure QR code is unscratched. Order multiple certified government copies.',
  });

  // 2. Claimant KYC (Aadhaar, PAN & Cancelled Cheque)
  computedDocs.push({
    id: 'doc_claimant_kyc',
    name: 'Claimant KYC Dossier (Aadhaar, PAN & Cancelled Cheque)',
    purpose: 'Identity verification and direct electronic settlement (NEFT/RTGS).',
    procurementAgency: 'UIDAI / Income Tax Dept / Claimant Bank',
    mandatoryFor: ['bank_account', 'fixed_deposit', 'epf_ppf', 'life_insurance', 'mutual_funds'],
    isAvailable: getIsAvailable('doc_claimant_kyc'),
    status: getStatus('doc_claimant_kyc'),
    copiesNeeded: 5,
    notes: 'Claimant name on cheque must match PAN and Aadhaar strictly.',
  });

  // 3. Surviving Member Certificate / Legal Heir Certificate
  const hasUnnominated = assets.some(a => a.hasNomineeRegistered === 'no' || a.hasNomineeRegistered === 'unknown');
  const hasRealEstate = assets.some(a => a.category === 'real_estate');
  if (hasUnnominated || hasRealEstate || !claimant.isSoleLegalHeir) {
    computedDocs.push({
      id: 'doc_surviving_heir',
      name: 'Surviving Member Certificate / Legal Heir Certificate (Varisu)',
      purpose: 'Identifies all Class-I heirs for settling un-nominated assets and property.',
      procurementAgency: 'Revenue Department / Tehsildar / State e-District Portal',
      mandatoryFor: ['bank_account', 'real_estate', 'demat_stocks'],
      isAvailable: getIsAvailable('doc_surviving_heir'),
      status: getStatus('doc_surviving_heir'),
      copiesNeeded: 5,
      notes: 'Revenue Inspector inspection usually takes 15–21 days.',
    });
  }

  // 4. EPFO Form Sets (Form 20, 10D, 5IF)
  const hasEpfo = assets.some(a => a.category === 'epf_ppf') || deceased.employmentType === 'salaried_private';
  if (hasEpfo) {
    computedDocs.push({
      id: 'doc_form_5if',
      name: "EPFO Form 5IF (EDLI ₹7 Lakh Life Insurance Claim)",
      purpose: "Statutory free life insurance claim for active PF members.",
      procurementAgency: "Employer HR Attestation + EPFO Portal",
      mandatoryFor: ['epf_ppf'],
      isAvailable: getIsAvailable('doc_form_5if'),
      status: getStatus('doc_form_5if'),
      copiesNeeded: 2,
      notes: 'Jointly signed by employer and claimant.',
    });

    computedDocs.push({
      id: 'doc_form_20_10d',
      name: "EPFO Form 20 (PF Settlement) & Form 10D (Pension)",
      purpose: "Withdraws PF balance and initiates monthly spouse/child pension.",
      procurementAgency: "EPFO Portal / Employer Attestation",
      mandatoryFor: ['epf_ppf'],
      isAvailable: getIsAvailable('doc_form_20_10d'),
      status: getStatus('doc_form_20_10d'),
      copiesNeeded: 2,
    });
  }

  // 5. Indemnity Bond
  if (hasUnnominated) {
    computedDocs.push({
      id: 'doc_indemnity_bond',
      name: 'Letter of Indemnity on Non-Judicial Stamp Paper',
      purpose: 'Required for bank claims without nomination under ₹5,00,000 threshold.',
      procurementAgency: 'Notary Public / Local Stamp Vendor',
      mandatoryFor: ['bank_account', 'fixed_deposit'],
      isAvailable: getIsAvailable('doc_indemnity_bond'),
      status: getStatus('doc_indemnity_bond'),
      copiesNeeded: 2,
      notes: 'Requires signature of one solvent third-party surety.',
    });
  }

  // 6. Demat Client Master List (CML)
  const hasDemat = assets.some(a => a.category === 'demat_stocks' || a.category === 'mutual_funds');
  if (hasDemat) {
    computedDocs.push({
      id: 'doc_demat_cml',
      name: 'Claimant Demat Client Master List (CML) with Depository Stamp',
      purpose: 'Required for electronic transmission of shares and mutual funds.',
      procurementAgency: 'Depository Participant (Zerodha, Groww, ICICI Direct, HDFC Sec)',
      mandatoryFor: ['demat_stocks', 'mutual_funds'],
      isAvailable: getIsAvailable('doc_demat_cml'),
      status: getStatus('doc_demat_cml'),
      copiesNeeded: 3,
    });
  }

  return computedDocs;
}
