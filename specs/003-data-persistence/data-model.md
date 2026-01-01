# Data Model: Data Persistence

**Feature**: 003-data-persistence
**Version**: 1.0.0
**Last Updated**: 2025-12-09

## Overview

This document defines the data structures for persisting canvas state to browser localStorage.

## Type Definitions

### PersistedCanvasState

The root structure stored in localStorage.

```typescript
/**
 * Persisted canvas state stored in localStorage.
 * Contains all data needed to restore a user's relationship map.
 */
interface PersistedCanvasState {
  /** Schema version for future migrations (semver format) */
  version: string;

  /** All person nodes including the self node */
  nodes: PersonNode[];

  /** Current view transform (zoom and pan) */
  viewTransform: ViewTransform;

  /** ISO 8601 timestamp of when state was last saved */
  savedAt: string;
}
```

### Existing Types (from types/node.ts)

These existing types are persisted as-is:

```typescript
/** Trust level categories */
type TrustLevel = 'high' | 'medium' | 'low' | 'unscored';

/** Bidirectional trust score for a relationship */
interface TrustScore {
  /** Trust the user has toward this person */
  outward: TrustLevel;
  /** Trust this person has toward the user (user's perception) */
  inward: TrustLevel;
  /** Flag indicating uncertainty about the assessment */
  uncertain?: boolean;
}

/** A person node on the canvas */
interface PersonNode {
  /** Unique identifier (UUID) */
  id: string;
  /** Person's name (1-50 characters) */
  name: string;
  /** Position on canvas */
  position: Position;
  /** True if this is the user's own node */
  isSelf: boolean;
  /** Optional trust score (only for non-self nodes) */
  trustScore?: TrustScore;
}
```

### Existing Types (from types/canvas.ts)

```typescript
/** View transformation state */
interface ViewTransform {
  /** Zoom level (0.5 to 2.0) */
  zoom: number;
  /** Horizontal pan offset in pixels */
  panX: number;
  /** Vertical pan offset in pixels */
  panY: number;
}
```

### Storage Constants

```typescript
/** localStorage key for canvas state */
const STORAGE_KEY = 'true-valence-canvas-state';

/** Current schema version */
const CURRENT_VERSION = '1.0.0';
```

## Default State

When no persisted data exists or data is invalid, use this default:

```typescript
const DEFAULT_STATE: PersistedCanvasState = {
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
```

## Validation Rules

### Required Fields

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| version | string | Yes | Semver format |
| nodes | array | Yes | At least 1 node (self) |
| viewTransform | object | Yes | All properties required |
| savedAt | string | Yes | ISO 8601 format |

### Node Validation

- `id`: Non-empty string (UUID format preferred)
- `name`: 1-50 characters, trimmed
- `position.x`: Number (any value)
- `position.y`: Number (any value)
- `isSelf`: Boolean
- `trustScore`: Optional, but if present must have valid outward/inward

### ViewTransform Validation

- `zoom`: Number between 0.5 and 2.0
- `panX`: Number (any value)
- `panY`: Number (any value)

## Schema Migration

When version changes, implement migration in StorageService:

```typescript
function migrate(data: unknown): PersistedCanvasState {
  const parsed = data as Record<string, unknown>;
  const version = parsed.version as string;

  // Version 1.0.0 is current - no migration needed
  if (version === '1.0.0') {
    return data as PersistedCanvasState;
  }

  // Future: handle older versions
  // if (version === '0.9.0') { ... }

  // Unknown version - reset to default
  console.warn(`Unknown storage version ${version}, resetting to default`);
  return createDefaultState();
}
```

## Example Persisted Data

```json
{
  "version": "1.0.0",
  "nodes": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "You",
      "position": { "x": 400, "y": 300 },
      "isSelf": true
    },
    {
      "id": "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
      "name": "Sarah",
      "position": { "x": 550, "y": 200 },
      "isSelf": false,
      "trustScore": {
        "outward": "high",
        "inward": "medium",
        "uncertain": false
      }
    },
    {
      "id": "6ba7b811-9dad-11d1-80b4-00c04fd430c8",
      "name": "John",
      "position": { "x": 250, "y": 400 },
      "isSelf": false
    }
  ],
  "viewTransform": {
    "zoom": 1.2,
    "panX": -50,
    "panY": 25
  },
  "savedAt": "2025-12-09T15:30:00.000Z"
}
```

## Storage Size Estimation

- Base overhead: ~100 bytes
- Per node: ~200-300 bytes
- 100 nodes: ~25-30 KB
- Well within localStorage 5MB limit
