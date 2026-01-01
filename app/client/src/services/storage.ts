import type { PersonNode, ViewTransform, PersistedCanvasState } from '../types';

/** localStorage key for canvas state */
const STORAGE_KEY = 'true-valence-canvas-state';

/** Current schema version */
const CURRENT_VERSION = '1.0.0';

/**
 * Create the default canvas state for new users.
 * Returns a fresh state with only the "You" node at center.
 */
export function createDefaultState(): PersistedCanvasState {
  return {
    version: CURRENT_VERSION,
    nodes: [
      {
        id: crypto.randomUUID(),
        name: 'You',
        position: { x: 400, y: 300 },
        isSelf: true,
      },
    ],
    viewTransform: {
      zoom: 1.0,
      panX: 0,
      panY: 0,
    },
    savedAt: new Date().toISOString(),
  };
}

/**
 * Check if localStorage is available and functional.
 * Returns false in private browsing mode (some browsers) or when disabled.
 */
export function isStorageAvailable(): boolean {
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate that parsed data has the expected structure.
 * Returns true if data appears to be a valid PersistedCanvasState.
 */
function isValidState(data: unknown): data is PersistedCanvasState {
  if (!data || typeof data !== 'object') return false;

  const state = data as Record<string, unknown>;

  // Check required fields exist
  if (typeof state.version !== 'string') return false;
  if (!Array.isArray(state.nodes)) return false;
  if (!state.viewTransform || typeof state.viewTransform !== 'object') return false;
  if (typeof state.savedAt !== 'string') return false;

  // Check nodes array has at least one node
  if (state.nodes.length === 0) return false;

  // Check at least one node is the self node
  const hasSelf = state.nodes.some((node: unknown) => {
    if (!node || typeof node !== 'object') return false;
    return (node as Record<string, unknown>).isSelf === true;
  });
  if (!hasSelf) return false;

  // Check viewTransform has required properties
  const vt = state.viewTransform as Record<string, unknown>;
  if (typeof vt.zoom !== 'number') return false;
  if (typeof vt.panX !== 'number') return false;
  if (typeof vt.panY !== 'number') return false;

  return true;
}

/**
 * Load canvas state from localStorage.
 * Returns default state if no data exists, data is invalid, or localStorage unavailable.
 */
export function loadState(): PersistedCanvasState {
  if (!isStorageAvailable()) {
    console.warn('[StorageService] localStorage not available, using default state');
    return createDefaultState();
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      // No saved data - return default
      return createDefaultState();
    }

    const parsed = JSON.parse(stored);

    if (!isValidState(parsed)) {
      console.warn('[StorageService] Invalid stored data structure, using default state');
      return createDefaultState();
    }

    // Check version for future migrations
    if (parsed.version !== CURRENT_VERSION) {
      console.warn(`[StorageService] Unknown version ${parsed.version}, using default state`);
      return createDefaultState();
    }

    return parsed;
  } catch (error) {
    console.warn('[StorageService] Failed to parse stored state:', error);
    return createDefaultState();
  }
}

/**
 * Save canvas state to localStorage.
 * Silently fails if localStorage unavailable (graceful degradation).
 */
export function saveState(nodes: PersonNode[], viewTransform: ViewTransform): void {
  if (!isStorageAvailable()) {
    return; // Silent fail - storage not available
  }

  const state: PersistedCanvasState = {
    version: CURRENT_VERSION,
    nodes,
    viewTransform,
    savedAt: new Date().toISOString(),
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    // Handle quota exceeded or other errors
    console.warn('[StorageService] Failed to save state:', error);
  }
}

/**
 * Clear saved canvas state from localStorage.
 * Used when user resets their map.
 */
export function clearState(): void {
  if (!isStorageAvailable()) {
    return;
  }

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn('[StorageService] Failed to clear state:', error);
  }
}
