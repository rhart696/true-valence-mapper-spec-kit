# Implementation Plan: Data Persistence

**Branch**: `003-data-persistence` | **Date**: 2025-12-09 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-data-persistence/spec.md`

## Summary

Add browser localStorage persistence to the relationship canvas so user maps survive page refreshes. The implementation will:
1. Automatically save canvas state (nodes, positions, trust scores, view transform) on every change
2. Restore saved state when the app loads
3. Provide a Reset Map feature with confirmation dialog
4. Handle errors gracefully (corrupted data, localStorage disabled)

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode)
**Primary Dependencies**: React 18, existing useCanvasState hook
**Storage**: Browser localStorage (Web Storage API)
**Testing**: Manual testing per spec (no automated tests required)
**Target Platform**: Modern browsers (Chrome, Firefox, Safari, Edge)
**Project Type**: Web application (frontend-only feature)
**Performance Goals**: Save <100ms, Load <500ms, no UI lag
**Constraints**: localStorage ~5MB limit, debounce saves to 500ms
**Scale/Scope**: Single user per browser, ~100 nodes max practical

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Specification-First | PASS | spec.md created before plan |
| II. User Story Driven | PASS | 3 prioritized user stories (P1, P1, P2) |
| III. Test-Conscious | PASS | Manual testing specified (tests optional) |
| IV. Modularity | PASS | StorageService abstraction planned |
| V. Type Safety | PASS | TypeScript types for persisted state |
| VI. Incremental Delivery | PASS | US1+US2 as MVP, US3 as enhancement |

## Project Structure

### Documentation (this feature)

```text
specs/003-data-persistence/
├── spec.md              # Feature specification (complete)
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
app/client/src/
├── hooks/
│   ├── useCanvasState.ts      # Existing - will integrate persistence
│   └── useLocalStorage.ts     # NEW - generic localStorage hook
├── services/
│   └── storage.ts             # NEW - StorageService abstraction
├── types/
│   ├── index.ts               # Export new types
│   └── storage.ts             # NEW - PersistedCanvasState type
└── components/
    └── Canvas/
        └── ResetMapButton.tsx # NEW - Reset button with confirmation
```

**Structure Decision**: Frontend-only feature. New files in services/ for storage abstraction, types/ for persistence types, and a new component for the Reset UI.

## Complexity Tracking

No constitution violations - straightforward feature using standard patterns.

---

## Phase 0: Research

### localStorage API Research

**Key API Methods:**
- `localStorage.setItem(key, value)` - Stores string value
- `localStorage.getItem(key)` - Retrieves string value (null if not exists)
- `localStorage.removeItem(key)` - Deletes key
- `localStorage.clear()` - Clears all data (avoid - affects other apps)

**Limitations:**
- ~5MB storage limit per origin
- Synchronous API (can block main thread on large writes)
- String-only storage (must JSON.stringify/parse)
- No built-in expiration
- Not available in private browsing (some browsers)

**Error Scenarios:**
- QuotaExceededError when storage full
- SecurityError in some iframe contexts
- localStorage undefined in SSR environments

### Debouncing Strategy

Use lodash-style debounce or simple custom implementation:
- Wait 500ms after last change before saving
- Prevents excessive writes during rapid edits (dragging nodes)
- Save immediately on unmount (beforeunload) to prevent data loss

### State Serialization

Current `CanvasState` type is already serializable:
```typescript
interface CanvasState {
  nodes: PersonNode[];          // serializable
  viewTransform: ViewTransform; // serializable
  editingNodeId: string | null; // skip - transient UI state
  selectedNodeId: string | null; // skip - transient UI state
}
```

Only persist `nodes` and `viewTransform` - editing/selection are transient.

---

## Phase 1: Design

### Data Model

See [data-model.md](./data-model.md) for complete type definitions.

**Key Type: PersistedCanvasState**
```typescript
interface PersistedCanvasState {
  version: string;           // "1.0.0" - for future migrations
  nodes: PersonNode[];       // All nodes including self
  viewTransform: ViewTransform;
  savedAt: string;           // ISO timestamp
}
```

### Component Integration

**Modified: useCanvasState.ts**
- Load initial state from localStorage instead of hardcoded default
- Call save function after every state change
- Expose `resetCanvas()` action

**New: useLocalStorage.ts**
- Generic hook: `useLocalStorage<T>(key, defaultValue)`
- Handles serialization/deserialization
- Returns [value, setValue, removeValue]

**New: services/storage.ts**
- `StorageService.save(state)` - Validates and saves
- `StorageService.load()` - Loads and validates, returns default on error
- `StorageService.clear()` - Removes stored data
- `StorageService.isAvailable()` - Checks localStorage availability

**New: ResetMapButton.tsx**
- Button that triggers confirmation dialog
- Uses native `window.confirm()` for MVP (keep it simple)
- Calls `resetCanvas()` from useCanvasState

### Debounce Implementation

```typescript
// Simple debounce - no external dependency
function useDebouncedEffect(effect: () => void, deps: any[], delay: number) {
  useEffect(() => {
    const handler = setTimeout(effect, delay);
    return () => clearTimeout(handler);
  }, deps);
}
```

### Error Handling Strategy

1. **Load errors**: Log warning, use default state (don't crash)
2. **Save errors**: Log warning, continue (data may be lost but app works)
3. **localStorage disabled**: Detect on mount, skip all persistence
4. **Quota exceeded**: Log error, skip save (app continues working)

---

## Implementation Phases

### Phase 1: Core Persistence (US1 + US2 - MVP)
1. Create PersistedCanvasState type
2. Create StorageService with save/load/clear/isAvailable
3. Modify useCanvasState to load initial state from storage
4. Add debounced save effect to useCanvasState
5. Test save/restore cycle manually

### Phase 2: Reset Feature (US3)
1. Create ResetMapButton component with confirmation
2. Add resetCanvas action to useCanvasState
3. Integrate reset button into Canvas UI
4. Test reset flow manually

### Phase 3: Polish
1. Add error logging for debugging
2. Verify graceful degradation when localStorage disabled
3. Test edge cases (corrupted data, large maps)
