import type { PersonNode, ViewTransform } from './index';

/**
 * Persisted canvas state stored in localStorage.
 * Contains all data needed to restore a user's relationship map.
 */
export interface PersistedCanvasState {
  /** Schema version for future migrations (semver format) */
  version: string;

  /** All person nodes including the self node */
  nodes: PersonNode[];

  /** Current view transform (zoom and pan) */
  viewTransform: ViewTransform;

  /** ISO 8601 timestamp of when state was last saved */
  savedAt: string;
}
