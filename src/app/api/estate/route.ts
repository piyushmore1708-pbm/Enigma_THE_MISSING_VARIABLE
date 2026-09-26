import { NextRequest, NextResponse } from 'next/server';
import { getEstateState, saveEstateState, getPersonas, loadPersonaById, resetToBlankState } from '@/lib/store/estateStore';
import { EstateState } from '@/lib/types/estate';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const state = getEstateState();
    const personas = getPersonas();
    return NextResponse.json({ success: true, state, personas });
  } catch (error) {
    console.error('API GET /api/estate error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch estate state' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, state, personaId } = body;

    if (action === 'save' && state) {
      const saved = saveEstateState(state as EstateState);
      return NextResponse.json({ success: true, state: saved });
    }

    if (action === 'load_persona' && personaId) {
      const loaded = loadPersonaById(personaId);
      if (loaded) {
        return NextResponse.json({ success: true, state: loaded });
      }
      return NextResponse.json({ success: false, error: 'Persona not found' }, { status: 404 });
    }

    if (action === 'reset') {
      const blank = resetToBlankState();
      return NextResponse.json({ success: true, state: blank });
    }

    return NextResponse.json({ success: false, error: 'Invalid action or payload' }, { status: 400 });
  } catch (error) {
    console.error('API POST /api/estate error:', error);
    return NextResponse.json({ success: false, error: 'Failed to process estate request' }, { status: 500 });
  }
}
