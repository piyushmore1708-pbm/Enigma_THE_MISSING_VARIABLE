# PROJECT CONTEXT LEDGER: Claim Sathi (क्लेम साथी)
**Empathetic Digital Estate & Financial Closure Assistant for Indian Families**

---

## 1. Project Overview & Identity
- **Application Name**: **Claim Sathi (क्लेम साथी)**
- **Domain**: Indian Consumer Fintech, Digital Estate Planning, Legal Tech & Deceased Asset Recovery.
- **Core Mission**: Alleviate the severe cognitive, emotional, and administrative burden on Indian families immediately following the demise of an earning member or parent. It replaces disjointed bank visits, predatory touts, and legal uncertainty with an empathetic, legally-sound digital assistant.
- **Root Directory**: `C:\Users\volos\Desktop\Coding\hack\enigma\MAIN`
- **Tech Stack**: Next.js 14.2.18 (App Router), React 18, TypeScript, Tailwind CSS 3, `react-hook-form`, `zod`, `@hookform/resolvers`, `lucide-react`.
- **Zero External DB Dependency**: Atomic filesystem JSON store (`data/estate-store.json`), client-side `localStorage` hydration (`claim_sathi_session`, `claim_sathi_state`), and in-memory mock engine.

---

## 2. Core Functional Modules & Application Routes

### 1. Empathetic Landing Page (`/` - `src/app/page.tsx`)
- Public-facing homepage welcoming grieving claimants with dignified, reassuring tone.
- High-level value pillars: 30-Day Emergency Playbook, Statutory Claim Dossiers (EPFO/EDLI/Gratuity), Unclaimed Wealth Radar (UDGAM/IEPF), and Liability Shield.
- **Interactive Reviewer Card**: 1-click loading for Persona A ("Late Ramesh Sharma - Salaried IT Manager") and Persona B ("Late Sunita Devi - Senior Citizen").

### 2. Lightweight Authentication Shell (`/login` - `src/app/login/page.tsx`)
- Low-stress login UI with two tabs:
  - **"Sign In with Google"** (mock authentication).
  - **"Continue as Claimant (OTP / Email)"** (OTP simulation with instant verification).
- **"Quick Demo Access"**: Authenticates the reviewer immediately as Persona A and redirects straight to `/overview`.
- Persistent session storage in `localStorage` with navbar profile menu and switch user/logout capabilities.

### 3. Active Estate Overview & Dashboard (`/overview` - `src/app/overview/page.tsx`)
- Financial Health Scorecard: Total Recoverable Assets vs. Total Outstanding Liabilities = Net Recoverable Estate.
- Interactive risk alerts (pending NACH loan debits, un-nominated accounts, statutory covers).
- Quick links to all sub-modules and printable document checklists.

### 4. Guided Intake Triage Wizard (`/triage` - `src/components/triage/TriageWizard.tsx`)
- **Step 1 (Deceased Profile)**: Full Name, Date of Passing, PAN, Aadhaar status, Employment Type (Salaried Private, Govt, Self-Employed, Retired/Pensioner), Employer Name, Will & Probate status.
- **Step 2 (Claimant Profile)**: Name, Relationship (Spouse, Son, Daughter, Mother, etc.), Mobile, Email, Sole Heir flag, Unanimous Heirs Consent flag.
- **Step 3 (Financial Footprint Discovery)**:
  - Rapid single-click selectors for top Indian banks, retirement schemes, insurance, and loan liabilities.
  - Custom asset and liability adder with live valuation calculations.
  - **Auto-Discover from Bank Statement**: Opens the Multimodal Statement & Passbook Analyzer.

### 5. Smart Statement & Passbook Analyzer (`src/components/triage/StatementAnalyzerModal.tsx` & `/api/analyze-statement`)
- Drag-and-drop dropzone supporting PDF, PNG, and JPEG passbook scans or bank statements.
- **Backend API (`/api/analyze-statement`)**: Powered by Google Generative AI (`@google/generative-ai`) and Gemini 1.5/2.5 Flash with multimodal document parsing.
- **Client-Side Privacy & Masking**: Regex filters mask 12-digit Indian national identifiers (Aadhaar `XXXX-XXXX-1234`) and bank account numbers in-memory.
- **Deterministic Offline Fallback**: If `GEMINI_API_KEY` is not configured or network fails, automatically falls back to the deterministic Indian banking regex engine (`ACH-HDFC-HL`, `CMS/EPFO/CONT`, `ECS-LIC-PREMIUM`, `ACH-SIP`, `NACH-ICICI-CC`).
- **Human-in-the-Loop Confirmation**: Displays extracted EMIs, PF contributions, and insurance debits, allowing the user to select, edit, and merge them into the active estate state.

### 6. Emergency 30-Day Action Playbook (`/playbook` - `src/app/playbook/page.tsx`)
- Prioritized chronological timeline:
  - **Days 1–7 (Urgent Halts)**: Procuring 10–15 municipal death certificate copies, issuing formal bank intimation, freezing NACH/ECS auto-debits.
  - **Days 8–30 (Institutional Claims)**: Submitting EPFO Form 20/10D/5IF, employer gratuity Form K, bank survivor settlements.
  - **Days 30+ (Statutory & Dormant)**: Legal heir certification, mutual fund demat transmission, IEPF and UDGAM unclaimed filings.
- Interactive completion checkboxes updating the live progress bar.

### 7. Statutory Claim Packet & Calculation Suite (`/claims` - `src/app/claims/page.tsx`)
- **Bank Survivor Settlement**:
  - *Track A (Nominee on Record)*: Enforces **RBI Master Circular Para 19** (15-day release, no court order, zero surety/indemnity).
  - *Track B (No Nominee < ₹15 Lakhs)*: Bank board-approved simplified settlement with standard Indemnity Bond + Heirs Disclaimer.
  - *Track C (No Nominee > ₹15 Lakhs)*: Succession Certificate pathway under Indian Succession Act 1925.
- **EPFO & EDLI Assurance Suite**: Form 20 (PF balance), Form 10D (Widow/Child EPS Pension), and Form 5IF (EDLI ₹7 Lakh statutory life insurance).
- **Statutory Gratuity Estimator**:
  - Formula: $\text{Gratuity} = \lfloor(15 \times \text{Last Drawn Basic + DA} \times \text{Years}) / 26\rfloor$.
  - Statutory ceiling: ₹20,00,000 (Payment of Gratuity Act, 1972).
  - Highlights statutory waiver of 5-year continuous service rule upon employee demise.
  - 100% Tax-Exemption under Section 10(10) of the Income Tax Act.
- **Printable Legal Indemnity Bond Generator**: Formatted deed on non-judicial stamp paper.
- **Institutional Directory**: Portals and guidelines for SBI, HDFC, ICICI, LIC, EPFO, CDSL/NSDL, and CAMS.

### 8. Financial Risk & Liability Shield (`/liabilities` - `src/app/liabilities/page.tsx`)
- Lenders intimation generator requesting immediate freeze of NACH/ECS loan mandates.
- Citations of RBI Fair Lending Code: Protection against illegal recovery harassment and prohibition of bounce penalties post-demise.
- Credit Life Insurance (Loan Protection) inspection clause.

### 9. Unclaimed Wealth Radar (`/unclaimed` - `src/app/unclaimed/page.tsx`)
- Guided portal workflows for recovering funds from India's ₹78,000+ Crore unclaimed asset pools:
  - **RBI UDGAM**: Unclaimed bank deposits dormant for >10 years across 30+ major banks.
  - **MCA IEPF**: Unclaimed corporate shares, mutual fund folios, and dividends unpaid for >7 years.
  - **EPFO Inactive Accounts**: Dormant provident fund balances from previous employers.

---

## 3. Statutory & Regulatory References Implemented

| Regulatory Body / Act | Section / Provision | Implemented In Application |
| :--- | :--- | :--- |
| **Reserve Bank of India (RBI)** | Master Circular on Customer Service (DBOD.No.Leg.BC.21/09.07.006/2015-16 Para 19) | Bank Nominee Claim letter; 15-day settlement deadline; waiver of succession cert & surety. |
| **RBI Fair Lending Practices** | Circular on Loan Recovery & Collection Conduct | Liability Shield notice; halts automated debit bounces and recovery agent harassment. |
| **EPFO / Central Govt** | Employees' Deposit-Linked Insurance Scheme, 1976 (EDLI) | Form 5IF packet; assurance benefit up to ₹7,00,000 payable to nominee. |
| **EPFO / Central Govt** | Employees' Pension Scheme, 1995 (EPS) | Form 10D; widow and orphan lifetime monthly pensions. |
| **Ministry of Labour** | Payment of Gratuity Act, 1972 Section 4(1) Proviso & 4(3) | Gratuity Calculator; 5-year tenure waiver on death; ₹20,00,000 statutory cap. |
| **Income Tax Department** | Section 10(10) of Income Tax Act, 1961 | Gratuity and EDLI proceeds classified as 100% tax-free in the hands of nominees. |
| **Reserve Bank of India** | UDGAM (Unclaimed Deposits Gateway to Access Information) | Direct search instructions and checklist for >10 yr dormant savings/FD accounts. |
| **Ministry of Corporate Affairs** | IEPF Authority Rules, 2016 | Step-by-step IEPF-5 filing walkthrough for unclaimed equity shares and dividends. |

---

## 4. Key Data Models & File Hierarchy

```
C:\Users\volos\Desktop\Coding\hack\enigma\MAIN/
├── data/
│   ├── estate-store.json            # Persistent file-backed JSON estate ledger
│   └── sample-personas.json         # Persona A (Ramesh Sharma) & Persona B (Sunita Devi)
├── src/
│   ├── app/
│   │   ├── layout.tsx               # Root layout with calming palette
│   │   ├── page.tsx                 # Public Landing Page
│   │   ├── login/page.tsx           # Authentication shell (Google, OTP, Demo Access)
│   │   ├── overview/page.tsx        # Estate Dashboard & Financial Summary
│   │   ├── triage/page.tsx          # Intake route wrapper
│   │   ├── playbook/page.tsx        # 30-Day Emergency Action Playbook
│   │   ├── claims/page.tsx          # Claim Packets & Gratuity Calculator
│   │   ├── liabilities/page.tsx     # Liability Shield & Loan Moratorium
│   │   └── unclaimed/page.tsx       # UDGAM & IEPF Unclaimed Wealth Radar
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx           # Streamlined header with claims tracker & profile menu
│   │   │   └── Footer.tsx
│   │   ├── triage/
│   │   │   ├── TriageWizard.tsx     # 3-step intake form with zod validation
│   │   │   └── StatementAnalyzerModal.tsx # Multimodal scanner with Aadhaar mask & OCR parser
│   │   └── claims/
│   │       └── DocumentChecklistTable.tsx # Dynamic procurement table with wrap-safe cells
│   ├── context/
│   │   └── EstateContext.tsx        # Global React Context with session & persona state
│   ├── lib/
│   │   ├── types/estate.ts          # Complete TypeScript types for estate, claims, tasks
│   │   ├── engine/checklistEngine.ts # Dynamic checklist & risk flag compute engine
│   │   └── templates/               # Legal letter generators (Bank, Freeze, Indemnity)
```

---

## 5. How to Run & Verify

1. **Development Server**:
   ```powershell
   npm run dev
   ```
   Access at `http://localhost:3000`.

2. **Production Build**:
   ```powershell
   npm run build
   ```
   Builds the standalone Next.js production bundle with 0 TypeScript/lint errors.

3. **1-Click Reviewer Testing**:
   - Visit `http://localhost:3000/login` -> Click **"Quick Demo Access"**.
   - Or click **"Persona A (Ramesh Sharma)"** / **"Persona B (Sunita Devi)"** in the top navigation bar or landing page.
