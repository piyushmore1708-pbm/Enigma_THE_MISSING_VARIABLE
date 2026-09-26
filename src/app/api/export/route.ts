import { NextResponse } from 'next/server';
import { getEstateState } from '@/lib/store/estateStore';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const state = getEstateState();
    const filename = `claim-sathi-estate-${state.deceased.fullName ? state.deceased.fullName.toLowerCase().replace(/\s+/g, '-') : 'case'}.json`;

    return new NextResponse(JSON.stringify(state, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('API GET /api/export error:', error);
    return NextResponse.json({ success: false, error: 'Export failed' }, { status: 500 });
  }
}
