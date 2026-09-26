# Claim Sathi (क्लेम साथी)
### Digital Estate & Financial Closure Assistant for Grieving Families
*Tailored specifically to the Indian Financial and Regulatory Ecosystem (RBI, SEBI, EPFO/EDLI, IEPF, UDGAM)*

---

## The Problem
When an individual passes away in India, the surviving family faces immense cognitive overload amidst bereavement:
1. **Fragmented Assets**: Bank accounts, EPFO PF balances, fixed deposits, mutual funds, demat shares, and term insurance policies are scattered across institutions.
2. **Immediate Risk of Overdrafts & Penalties**: NACH / e-NACH auto-debits for EMIs (Home Loans, Car Loans) continue to hit accounts, leading to bounce charges and aggressive recovery notices.
3. **Complex Indian Legal Protocols**: Navigating the differences between *Nominee rights vs. Legal Heir rights*, obtaining Municipal Death Certificates with QR codes, Surviving Member Certificates from Tehsildars, and standard bank indemnity bonds.
4. **Huge Unclaimed Wealth**: Over **₹78,000 Crores** sits unclaimed in the RBI Depositor Education and Awareness Fund (DEAF) and the MCA Investor Education and Protection Fund (IEPF) simply due to discovery failure.

---

## Key Features & Architecture

### 1. Guided Intake & Asset Discovery Wizard (`/triage`)
- Low-stress, 3-step intake triage capturing essential identifiers (PAN, Aadhaar presence, employment status, known banks).
- Live calculation of discovered claims vs. liabilities.
- Auto-generates a dynamic, asset-specific document procurement checklist.

### 2. The First 30 Days Emergency Playbook (`/playbook`)
- Chronological roadmap:
  - **Days 1–7 (Urgent Halts)**: Freeze loan auto-debits, procure 15+ copies of Municipal Death Certificates.
  - **Days 8–30 (Institutional Claims)**: Notify employer HR, file EPFO Form 20/10D/5IF, and file bank survivor claims under RBI 15-day settlement rule.
  - **Days 30+ (Statutory & Dormant)**: Procure Surviving Member / Legal Heir certificates, search RBI UDGAM and MCA IEPF.
- Interactive progress tracking persisted to the local zero-config JSON store.

### 3. Indian Claim Pack & Document Generator (`/claims`)
- **Bank Nominee Settlement Letter**: Citing Paragraph 19 of the RBI Master Circular on Customer Service in Banks (mandating settlement within 15 days without probate).
- **EPFO & EDLI Life Insurance Guide**: Detailed instructions and download link for Form 5IF (free life cover up to ₹7,00,000 for active PF members), Form 20 (PF withdrawal), and Form 10D (widow/children pension).
- **Legal Indemnity Bond Deed**: Standard deed for settlement of accounts without nomination under ₹5,00,000.
- Print-ready PDF formats and 1-click clipboard copy.

### 4. Financial Risk & Liability Shield (`/liabilities`)
- Formal death notification letter to lenders demanding immediate suspension of NACH/ECS auto-debits.
- Invokes the RBI Fair Practices Code for Lenders prohibiting coercive recovery against surviving heirs.
- Prompts verification of Credit Protection / Loan Group Life Insurance (e.g., *Sarv Suraksha / Home Shield*) which extinguishes loan debt upon the borrower's death.

### 5. Unclaimed Wealth Discovery Guide (`/unclaimed`)
- **RBI UDGAM Portal Guide**: Step-by-step instructions for searching dormant bank deposits inactive for >10 years across 30+ banks. Pre-fills search parameters with the deceased’s details.
- **MCA IEPF Guide**: Walkthrough for filing e-Form IEPF-5 to recover unclaimed company shares and unpaid dividends transferred after 7 consecutive years.
- **EPFO Inactive Accounts Helpdesk Guide**.

---

## Pre-Configured Demo Personas for Judges
Switch personas instantaneously from the top navigation bar:
- **👔 Persona A: Late Ramesh Sharma (Age 42)**
  - *Profile*: Salaried Senior IT Professional at Infosys.
  - *Estate*: Active HDFC Home Loan (NACH auto-debit on 5th), EPFO account eligible for ₹7L EDLI Life Insurance, ₹1 Cr HDFC Life term insurance, ICICI salary account, SBI FD, Zerodha mutual funds.
- **👵 Persona B: Late Sunita Devi (Age 68)**
  - *Profile*: Retired Senior Citizen / Pensioner.
  - *Estate*: Dormant PNB account inactive for 12 years (searchable on RBI UDGAM), physical Reliance shares transferred to IEPF, SBI Senior Citizen FD, India Post MIS, zero liabilities.

---

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS with an empathetic, calming color system (slate, warm stone, muted teal/emerald).
- **Icons**: Lucide React
- **Storage**: Zero-config atomic file-backed JSON store (`data/estate-store.json`) with in-memory caching and client LocalStorage hydration.
- **Print Optimization**: Native CSS print stylesheets for generating clean legal letterheads on A4 without UI clutter.

---

## Quickstart Guide

```bash
# 1. Install dependencies
npm install

# 2. Run development server
npm run dev

# 3. Build for production
npm run build
npm start
```
Open [http://localhost:3000](http://localhost:3000) to view Claim Sathi.
