import fs from 'fs';
import path from 'path';
import { EstateState, DemoPersona } from '../types/estate';
import { DEFAULT_INITIAL_STATE } from './defaultState';

const DATA_DIR = path.join(process.cwd(), 'data');
const STORE_FILE = path.join(DATA_DIR, 'estate-store.json');
const PERSONAS_FILE = path.join(DATA_DIR, 'sample-personas.json');

// In-memory memory cache fallback
let memoryState: EstateState | null = null;

function ensureDataDirectory() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export function getPersonas(): DemoPersona[] {
  try {
    if (fs.existsSync(PERSONAS_FILE)) {
      const content = fs.readFileSync(PERSONAS_FILE, 'utf-8');
      return JSON.parse(content) as DemoPersona[];
    }
  } catch (err) {
    console.error('Error loading sample personas:', err);
  }
  return [];
}

export function getEstateState(): EstateState {
  try {
    ensureDataDirectory();
    if (fs.existsSync(STORE_FILE)) {
      const content = fs.readFileSync(STORE_FILE, 'utf-8');
      const parsed = JSON.parse(content) as EstateState;
      memoryState = parsed;
      return parsed;
    }
  } catch (err) {
    console.warn('Could not read store file, falling back to memory/default:', err);
  }

  if (memoryState) return memoryState;

  // Initialize with Persona A (Ramesh Sharma) by default so app renders fully populated on initial load
  const personas = getPersonas();
  if (personas.length > 0) {
    const defaultPersona = personas[0].state;
    saveEstateState(defaultPersona);
    return defaultPersona;
  }

  saveEstateState(DEFAULT_INITIAL_STATE);
  return DEFAULT_INITIAL_STATE;
}

export function saveEstateState(state: EstateState): EstateState {
  const updatedState: EstateState = {
    ...state,
    lastUpdated: new Date().toISOString()
  };

  memoryState = updatedState;

  try {
    ensureDataDirectory();
    fs.writeFileSync(STORE_FILE, JSON.stringify(updatedState, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write estate state to disk:', err);
  }

  return updatedState;
}

export function loadPersonaById(personaId: string): EstateState | null {
  const personas = getPersonas();
  const found = personas.find(p => p.id === personaId);
  if (found) {
    return saveEstateState(found.state);
  }
  return null;
}

export function resetToBlankState(): EstateState {
  return saveEstateState(DEFAULT_INITIAL_STATE);
}
