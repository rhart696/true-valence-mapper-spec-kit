# Research: Data Persistence

**Feature**: 003-data-persistence
**Date**: 2025-12-09

## Storage Options Evaluation

### Option 1: localStorage (Selected)

**Pros:**
- Built into all browsers, no dependencies
- Simple synchronous API
- Persists across browser sessions
- ~5MB storage (sufficient for 100+ nodes)

**Cons:**
- Synchronous (can block main thread)
- String-only storage (JSON serialization required)
- No expiration mechanism
- Not available in all private browsing modes

**Decision**: Selected for MVP. Simple, universally available, sufficient capacity.

### Option 2: IndexedDB

**Pros:**
- Async API (non-blocking)
- Much larger storage (typically 50MB+)
- Supports complex queries
- Better for large datasets

**Cons:**
- More complex API
- Requires wrapper library for ergonomic use
- Overkill for simple state persistence

**Decision**: Not needed for MVP. Consider if storage needs exceed 5MB.

### Option 3: Session Storage

**Pros:**
- Same API as localStorage
- Auto-cleared when tab closes

**Cons:**
- Data lost on browser close
- Defeats purpose of "survive refresh"

**Decision**: Rejected. User expects data to persist across sessions.

---

## React Integration Patterns

### Pattern 1: Custom Hook with useEffect (Selected)

```typescript
function usePersistedState<T>(key: string, defaultValue: T) {
  const [state, setState] = useState<T>(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState] as const;
}
```

**Pros:**
- Integrates naturally with existing hooks
- Lazy initialization from storage
- Automatic save on state change

**Decision**: Adapt this pattern for useCanvasState integration.

### Pattern 2: Context Provider with Storage

```typescript
function StorageProvider({ children }) {
  // Centralized storage management
}
```

**Decision**: Overkill for single-state persistence. Direct hook integration simpler.

---

## Debouncing Strategy

### Option 1: Debounce Effect (Selected)

```typescript
useEffect(() => {
  const timer = setTimeout(() => {
    saveToStorage(state);
  }, DEBOUNCE_MS);
  return () => clearTimeout(timer);
}, [state]);
```

**Pros:**
- Simple, no external dependencies
- Integrates with React lifecycle
- Last value always saved

**Decision**: Selected. Simple and effective.

### Option 2: Lodash debounce

```typescript
const debouncedSave = useMemo(
  () => debounce(saveToStorage, 500),
  []
);
```

**Cons:**
- Adds dependency
- Requires cleanup handling

**Decision**: Not needed. Custom debounce sufficient.

---

## Error Handling Research

### localStorage Availability

```typescript
function isLocalStorageAvailable(): boolean {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}
```

This handles:
- Private browsing (Safari)
- localStorage disabled by user
- Storage quota exceeded (for test key)

### JSON Parse Errors

```typescript
function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json);
  } catch {
    console.warn('Failed to parse stored state');
    return fallback;
  }
}
```

### Quota Exceeded

```typescript
try {
  localStorage.setItem(key, value);
} catch (e) {
  if (e instanceof DOMException && e.code === 22) {
    console.error('localStorage quota exceeded');
  }
}
```

---

## Schema Versioning Strategy

### Simple Version Check

```typescript
const CURRENT_VERSION = '1.0.0';

function loadState(): PersistedCanvasState {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return createDefault();

  const parsed = safeJsonParse(stored, null);
  if (!parsed || parsed.version !== CURRENT_VERSION) {
    // Future: implement migration
    return createDefault();
  }

  return parsed;
}
```

**Rationale**: Simple string comparison for now. Implement proper semver migration when needed.

---

## Performance Considerations

### Serialization Cost

- JSON.stringify is fast for small objects
- 100 nodes: ~30KB JSON, <10ms to serialize
- Well within acceptable range

### Save Frequency

With 500ms debounce:
- Rapid node dragging: 1 save per 500ms
- Normal editing: ~1 save per action
- No perceptible lag

### Load Time

- JSON.parse is fast
- State restoration in initial render (useState initializer)
- No flash of default state

---

## Browser Compatibility

| Browser | localStorage | Notes |
|---------|-------------|-------|
| Chrome | Yes | Full support |
| Firefox | Yes | Full support |
| Safari | Yes | Limited in private mode |
| Edge | Yes | Full support |
| iOS Safari | Yes | Limited in private mode |

**Mitigation**: Graceful degradation - app works without persistence if localStorage unavailable.

---

## References

- [MDN: Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API)
- [MDN: Window.localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [Can I use: localStorage](https://caniuse.com/namevalue-storage)
