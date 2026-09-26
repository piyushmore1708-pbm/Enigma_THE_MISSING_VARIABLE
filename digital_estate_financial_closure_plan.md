# Implementation Plan: Digital Estate & Financial Closure Assistant ("AntimSetu" / "EstateSahay")

## Goal Description
Build an empathetic, production-ready, zero-config full-stack web MVP tailored specifically to the **Indian financial and regulatory ecosystem** (RBI, SEBI, EPFO/EDLI, IEPF, UDGAM, IRDAI, and Indian succession/nomination frameworks). The application relieves the cognitive overload and financial panic experienced by grieving families immediately after the loss of a loved one by providing:
1. **Low-Stress Guided Triage & Asset Discovery**: Capturing basic signals (PAN, Aadhaar presence, employer type, known banks, Demat/insurance presence) to generate a structured estate inventory.
2. **First 30 Days Emergency Playbook**: Chronologically tiered actionable steps (Days 1–7 for auto-debit halts and death certificate procurement; Days 8–30 for employer/EPFO claims & bank survivor accounts; Days 30+ for succession/IEPF/UDGAM).
3. **Indian Claim Packet & Document Engine**: Pre-filled bank claim formats, EPFO Form 20/10D and Form 5IF (EDLI life insurance up to ₹7 Lakhs), surviving member certificate guidance, and dynamic checklists.
4. **Financial Risk & Liability Shield**: Loan/credit card moratorium and death notification letter/email generator to halt penal interest and illegal recovery harassment.
5. **Unclaimed Assets Discovery Guide**: Pre-populated search directives and walkthroughs for RBI UDGAM, IEPF (shares/dividends), and EPFO portals.

---

## User Review Required

> [!IMPORTANT]
> **Zero-Config Storage Strategy on Windows**:
> To ensure flawless execution on Windows (Node.js v24.21.0) without native C++ compilation risks (`node-gyp` / `better-sqlite3`), we propose using a **modular atomic File-backed JSON store (`data/estate-store.json`) with an in-memory fallback + Next.js Server Actions & API Routes**, paired with **client-side LocalStorage hydration and 1-click Sample Profile loading** (e.g., *"Late Ramesh Kumar - Salaried IT Manager with EPF, Home Loan, & Term Insurance"*).

> [!NOTE]
> **Empathetic UX Tone & Design System**:
> Grieving families are under acute emotional distress. The design system will strictly avoid aggressive red warnings, high-frequency alerts, or cluttered dashboards. It will utilize a calming, dignified palette (soft slate, warm neutral stones, muted sage/teal accents), high-contrast legible typography, gentle progressive disclosure, and plain-English explanations of complex Indian legal terms (e.g., *Nominee vs. Legal Heir*, *Form 5IF*, *Indemnity Bond*).

---

## Open Questions

Before finalizing implementation, please review these 3 architectural decisions:

1. **Brand / Project Name**:
   - Proposed working name: **"Samapti" / "EstateSahay" / "AntimSetu"** (Financial Closure Bridge). Which do you prefer, or do you have a specific project name in mind?
2. **Sample Persona Seeders**:
   - Do you want 2 pre-configured quick-load personas for judging demonstrations?
     - *Persona A (Salaried Techie)*: Active Home Loan, EPF/EDLI claim, Term Insurance, 2 Bank accounts, Mutual funds.
     - *Persona B (Retired Parent)*: Pension/NPS, Dormant Bank account (UDGAM search needed), Physical share certificates (IEPF claim), Senior citizen fixed deposits.
3. **Export Formats**:
   - For claim letters and document packs, we plan to provide **in-browser printable PDF layouts (CSS print-optimized)**, **one-click Clipboard Copy for email notices**, and **JSON Data Export/Import**. Does this meet your hackathon MVP needs?

---

## Complete Folder & File Structure

```
C:\Users\volos\Desktop\Coding\hack\enigma\MAIN/
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.mjs
├── next.config.mjs
├── public/
│   ├── favicon.ico
│   └── templates/                 # Pre-drafted legal & bank claim formats
├── data/
│   └── sample-personas.json       # Quick-seed personas for instant judge demo
├── src/
│   ├── app/
│   │   ├── layout.tsx             # Root layout with calming theme & header
│   │   ├── page.tsx               # Main Dashboard / Landing & Triage entry
│   │   ├── triage/
│   │   │   └── page.tsx           # Multi-step low-stress estate intake wizard
│   │   ├── playbook/
│   │   │   └── page.tsx           # 30-Day Emergency Playbook with interactive checklist
│   │   ├── claims/
│   │   │   └── page.tsx           # Indian Claim Pack generator (Bank, EPFO, Insurance)
│   │   ├── liabilities/
│   │   │   └── page.tsx           # Liability Shield & EMI freeze notice generator
│   │   ├── unclaimed/
│   │   │   └── page.tsx           # RBI UDGAM & IEPF discovery guides
│   │   └── api/
│   │       ├── estate/
│   │       │   └── route.ts       # CRUD endpoints for estate state
│   │       └── export/
│   │           └── route.ts       # Export claim packet summary
│   ├── components/
│   │   ├── ui/                    # Base UI (Button, Card, Badge, Dialog, Accordion, Tabs, Progress)
│   │   ├── layout/
│   │   │   ├── Navbar.tsx         # Empathetic header with quick status & demo seeder
│   │   │   └── Footer.tsx
│   │   ├── triage/
│   │   │   ├── TriageWizard.tsx   # Step 1: Deceased, Step 2: Claimant, Step 3: Financial Footprint
│   │   │   ├── AssetInventoryCard.tsx
│   │   │   └── DiscoveryEstimator.tsx
│   │   ├── playbook/
│   │   │   ├── TimelinePhase.tsx  # Days 1-7, Days 8-30, Days 30+
│   │   │   ├── TaskCard.tsx       # Expandable task with Indian legal tips & action triggers
│   │   │   └── UrgentAlertBanner.tsx # EMI freeze / Auto-debit warning
│   │   ├── claims/
│   │   │   ├── ClaimPacketView.tsx # Printable claim pack preview
│   │   │   ├── EpfoClaimGuide.tsx # Form 20, 10D, and Form 5IF EDLI guide
│   │   │   ├── BankSurvivorGuide.tsx # Nominee vs Non-Nominee bank claims
│   │   │   └── DocumentChecklistTable.tsx
│   │   ├── liabilities/
│   │   │   ├── NoticeLetterEditor.tsx # Form-fillable moratorium request notice
│   │   │   └── LiabilityList.tsx
│   │   └── unclaimed/
│   │       ├── UdgamGuideCard.tsx  # RBI UDGAM portal walkthrough
│   │       └── IepfGuideCard.tsx   # Ministry of Corporate Affairs IEPF guidance
│   ├── lib/
│   │   ├── store/
│   │   │   ├── estateStore.ts     # Local filesystem JSON atomic persistence
│   │   │   └── defaultState.ts    # Initial blank & template state
│   │   ├── types/
│   │   │   └── estate.ts          # Complete domain data schemas (TypeScript)
│   │   ├── constants/
│   │   │   ├── indianInstitutions.ts # List of major Indian PSU/Private banks, EPFO, AMCs
│   │   │   └── statutoryProvisions.ts # Banking Regulation Act, EPFO EDLI limits, Nominee rights
│   │   ├── templates/
│   │   │   ├── bankEmiFreezeLetter.ts
│   │   │   ├── bankNomineeClaimLetter.ts
│   │   │   └── indemnityBondTemplate.ts
│   │   └── utils.ts
```

---

## Domain Data Schema (TypeScript)

```typescript
// src/lib/types/estate.ts

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
  institutionName: string; // e.g. "State Bank of India", "EPFO", "HDFC Life"
  accountOrFolioNumber?: string;
  estimatedValue?: number;
  hasNomineeRegistered: 'yes' | 'no' | 'unknown';
  nomineeName?: string;
  claimStatus: ClaimStatus;
  notes?: string;
  relevantForms: string[]; // e.g. ["Form 20", "Form 5IF"]
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
  hasLoanInsurancePolicy: 'yes' | 'no' | 'unknown'; // Vital for home/car loans
}

export interface PlaybookTask {
  id: string;
  phase: 'day_1_7' | 'day_8_30' | 'day_30_plus';
  title: string;
  description: string;
  urgency: 'high' | 'medium' | 'low';
  completed: boolean;
  completedAt?: string;
  statutoryReference?: string; // e.g. "RBI Master Circular on Settlement of Claims (2023)"
  actionLink?: string;
}

export interface RequiredDocument {
  id: string;
  name: string; // e.g. "Original Death Certificate with Municipal QR code"
  purpose: string;
  procurementAgency: string; // e.g. "Municipal Corporation / Panchayat"
  mandatoryFor: AssetCategory[];
  isAvailable: boolean;
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
```

---

## Phased Execution Roadmap

### Phase 1: Project Scaffolding & Empathetic Core
- Initialize Next.js 15 (App Router) + TypeScript + Tailwind CSS in `C:\Users\volos\Desktop\Coding\hack\enigma\MAIN`.
- Install foundational dependencies: `lucide-react`, `clsx`, `tailwind-merge`, `zod`, `react-hook-form`.
- Setup theme palette: soothing dignified slate, muted teal (`emerald-800`/`teal-700`), warm neutrals.
- Configure local file-backed estate storage (`data/estate-store.json`) with sample pre-seeded test data.
- Build Navigation bar with Quick Status Pill (Overall Progress %, Pending Critical Notices) and "Load Demo Case" switcher.

### Phase 2: Guided Triage Wizard & Estate Discovery
- Create the 3-step Intake Wizard:
  - **Step 1: Vital Signals**: Deceased details, passing date, employment status, will availability.
  - **Step 2: Claimant Details**: Relationship, legal heir consensus, nominee status.
  - **Step 3: Asset & Debt Discovery Grid**: Rapid multi-card selector (Banks, EPF/NPS, Insurance, Demat, Loans).
- Build the **Asset & Liability Inventory Matrix**:
  - Auto-computes total potential claims vs. liabilities.
  - Auto-flags critical risks (e.g. *Active Auto-Debit with upcoming EMI date*, *Missing Nominee requiring Legal Heir Certificate*).
- Generate the **Smart Document Procurement Checklist** based on selected assets (Municipal Death Certificate, Surviving Member Certificate, Form 5IF, etc.).

### Phase 3: Action Playbook, Legal Letter Generator & Unclaimed Discovery
- **Emergency Action Playbook (First 30 Days)**:
  - Interactive kanban/timeline (Days 1–7 Urgent, Days 8–30 Institutional, Days 30+ Statutory/Dormant).
  - Status updates persist to local state.
- **Financial Risk & Liability Shield (Notice Generator)**:
  - Generate formal RBI-compliant death notification and EMI freeze requests for Indian banks.
  - Exportable copy to clipboard and print-ready formal letterhead format.
  - Check for Credit Shield / Loan Protection Insurance (which extinguishes home loan debt upon borrower's death).
- **Indian Claim Packs (EPFO / EDLI / Bank)**:
  - Form 5IF (Employees' Deposit Linked Insurance - up to ₹7,00,000 claim guide).
  - RBI survivor settlement procedure without succession certificate (for claims under ₹5 Lakhs).
- **Unclaimed Wealth Finder (UDGAM & IEPF Guide)**:
  - Dedicated interactive guides for searching dormant accounts on RBI's UDGAM portal and unclaimed shares on IEPF.

---

## Verification Plan

### Automated Checks
- `npm run build`: Verify zero TypeScript or Next.js App Router syntax errors.
- `npm run lint`: Code quality and import cleanliness.
- API Route tests (`GET /api/estate`, `POST /api/estate`): Verify state persistence and sample seed loading.

### Manual Verification Flows
1. **Zero-Friction Onboarding**: Start with blank state -> complete 3-step triage -> observe automatic population of the 30-Day Playbook and Asset Inventory.
2. **Demo Persona Loading**: Click "Load Ramesh Sharma Case" -> verify that EPFO Form 5IF (EDLI), Home Loan EMI notice, and 4 assets populate instantaneously.
3. **Letter Generation & Print**: Open Liability Shield -> select Home Loan -> verify generated notice includes Deceased Name, Loan Number, Date of Passing, and Moratorium clause -> check print preview formatting.
4. **Interactive Playbook Progress**: Check off "Obtain 15 copies of Municipal Death Certificate" -> verify progress indicator increments and state remains persistent after page refresh.
