'use client';

import React from 'react';
import { TriageWizard } from '@/components/triage/TriageWizard';
import { DocumentChecklistTable } from '@/components/claims/DocumentChecklistTable';

export default function TriagePage() {
  return (
    <div className="space-y-12 animate-fadeIn">
      {/* 1. Guided Intake Triage Wizard */}
      <TriageWizard />

      {/* 2. Dynamic Smart Document Procurement Checklist */}
      <DocumentChecklistTable />
    </div>
  );
}
