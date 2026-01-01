# Research: Keyboard Shortcuts

**Feature**: 002-keyboard-shortcuts
**Date**: 2025-12-09
**Status**: Complete

## Research Questions Addressed

### RQ-001: How should keyboard events be handled in React 19?

**Decision**: Use `useEffect` with `window.addEventListener('keydown', handler)` at the canvas component level.

**Rationale**:
- React 19 maintains the same event handling patterns as React 18
- Window-level listener captures all keyboard events regardless of focus within canvas
- Cleanup via useEffect return function prevents memory leaks

**Alternatives Considered**:
- `onKeyDown` prop on canvas div: Only fires when canvas element itself has focus, not children
- Third-party library (react-hotkeys-hook): Adds dependency for simple use case

**Implementation Pattern**:
```typescript
useEffect(() => {
  const handler = (e: KeyboardEvent) => {
    // Handle shortcuts
  };
  window.addEventListener('keydown', handler);
  return () => window.removeEventListener('keydown', handler);
}, [dependencies]);
```

### RQ-002: How to detect if a text input has focus?

**Decision**: Check `document.activeElement` tagName and attributes.

**Rationale**:
- Native browser API, zero dependencies
- Works across all modern browsers
- Handles INPUT, TEXTAREA, and contenteditable elements

**Implementation Pattern**:
```typescript
const isTextInputFocused = (): boolean => {
  const active = document.activeElement;
  if (!active) return false;

  const tagName = active.tagName.toUpperCase();
  if (tagName === 'INPUT' || tagName === 'TEXTAREA') return true;
  if (active.getAttribute('contenteditable') === 'true') return true;

  return false;
};
```

### RQ-003: What are the standard key values for keyboard shortcuts?

**Decision**: Use `event.key` string values per KeyboardEvent specification.

**Reference**: [MDN KeyboardEvent.key](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key)

**Key Mappings Used**:
| Key | event.key value | Notes |
|-----|-----------------|-------|
| Escape | 'Escape' | Universal |
| Enter | 'Enter' | Universal |
| Plus | '+' | Requires Shift on US keyboard |
| Equals | '=' | Same key as + without Shift |
| Minus | '-' | Universal |
| Underscore | '_' | Same key as - with Shift |
| Space | ' ' | Single space character |
| Delete | 'Delete' | Forward delete |
| Backspace | 'Backspace' | Backward delete |
| Arrow Up | 'ArrowUp' | Navigation |
| Arrow Down | 'ArrowDown' | Navigation |
| Arrow Left | 'ArrowLeft' | Navigation |
| Arrow Right | 'ArrowRight' | Navigation |

### RQ-004: How to prevent default browser behavior for shortcuts?

**Decision**: Call `event.preventDefault()` only for keys we handle.

**Rationale**:
- Prevents browser scrolling on arrow keys
- Prevents page find on Ctrl+F (we don't use Ctrl combinations)
- Must NOT prevent default for keys in text inputs

**Implementation Pattern**:
```typescript
const handleKeyDown = (e: KeyboardEvent) => {
  if (isTextInputFocused()) return; // Let inputs handle their own keys

  switch (e.key) {
    case 'ArrowUp':
    case 'ArrowDown':
    case ' ': // Space
      e.preventDefault(); // Prevent page scroll
      // Handle shortcut
      break;
  }
};
```

### RQ-005: What zoom/pan increments are standard?

**Decision**:
- Zoom increment: 0.1 (10%) per keypress
- Zoom bounds: min 0.25, max 2.0
- Pan increment: 50px per keypress

**Rationale**:
- Matches common design tools (Figma, Sketch)
- 10% zoom feels responsive but controlled
- 50px pan provides noticeable movement without being jarring
- Bounds prevent unusable zoom levels

### RQ-006: How to implement smooth pan animation for centering?

**Decision**: Use CSS transition on transform property.

**Rationale**:
- Hardware-accelerated via GPU
- No JavaScript animation loop needed
- Consistent 60fps on all browsers

**Implementation Pattern**:
```typescript
// Add transition class before changing pan
canvasRef.current.style.transition = 'transform 300ms ease-out';
updatePan(newPan);

// Remove transition after animation completes
setTimeout(() => {
  canvasRef.current.style.transition = '';
}, 300);
```

## Existing Code Analysis

### useCanvasState.ts

Provides:
- `viewTransform: { zoom: number, pan: { x: number, y: number } }`
- `updateViewTransform(transform)` - updates zoom/pan
- `state.nodes` - array of all nodes

### useDragAndDrop.ts

Provides:
- Drag event handlers for nodes
- Position calculation utilities

### Canvas.tsx

Current structure:
- Main container div with transform applied
- Nodes rendered as children
- TrustArrows SVG overlay

Integration point: Add keyboard hook here, pass callbacks for zoom/pan/selection.

### Node.tsx

Current structure:
- Positioned absolutely via transform
- Click handler for edit mode
- Trust button, remove button

Integration point: Add selection styling, integrate with selectedNodeId from context.

## Dependencies Identified

No new external dependencies required. All functionality achievable with:
- React 19 hooks (useState, useEffect, useCallback, useRef)
- Native browser APIs (KeyboardEvent, document.activeElement)
- Existing project hooks and context

## Conclusion

Research complete. All questions resolved with clear implementation patterns. No blocking issues identified. Ready to proceed to Phase 1 design artifacts.
