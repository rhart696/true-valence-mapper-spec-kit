# Implementation Plan: Keyboard Shortcuts

**Branch**: `002-keyboard-shortcuts` | **Date**: 2025-12-09 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-keyboard-shortcuts/spec.md`

## Summary

Add keyboard shortcuts to the relationship canvas for improved navigation and editing efficiency. The feature enables users to cancel/confirm edits with Escape/Enter, zoom with +/-, pan with arrow keys, delete nodes with Delete key, and center view with Space bar. Implementation uses a centralized keyboard event handler hook that respects focus state to avoid conflicts with text input fields.

## Technical Context

**Language/Version**: TypeScript 5.x with React 19.2.0
**Primary Dependencies**: React (hooks, events), existing useCanvasState hook, existing useDragAndDrop hook
**Storage**: N/A (all state in existing React context)
**Testing**: Manual testing (tests optional per constitution unless specified)
**Target Platform**: Modern web browsers (Chrome, Firefox, Safari, Edge - desktop)
**Project Type**: Web application (frontend only for this feature)
**Performance Goals**: <100ms keyboard response time (perceptually instant)
**Constraints**: Must not interfere with browser shortcuts (Ctrl+C, etc.) or accessibility tools
**Scale/Scope**: Single page app, ~25 nodes maximum per canvas

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Specification-First | PASS | spec.md created via /speckit.specify before this plan |
| II. User Story Driven | PASS | 5 prioritized user stories (P1-P5), each independently testable |
| III. Test-Conscious | PASS | Tests not required in spec; manual testing acceptable |
| IV. Modularity | PASS | New useKeyboardShortcuts hook will be self-contained module |
| V. Type Safety | PASS | TypeScript strict mode; keyboard event types explicit |
| VI. Incremental Delivery | PASS | Each user story (P1-P5) can be implemented and deployed independently |

**Gate Status**: PASS - Proceed to Phase 0

## Project Structure

### Documentation (this feature)

```text
specs/002-keyboard-shortcuts/
├── spec.md              # Feature specification (complete)
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output (minimal - mostly behavior, not data)
├── quickstart.md        # Phase 1 output
├── checklists/          # Validation checklists
│   └── requirements.md  # Spec quality checklist (complete)
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
app/client/src/
├── hooks/
│   ├── useCanvasState.ts      # Existing - provides zoom/pan state
│   ├── useDragAndDrop.ts      # Existing - node dragging
│   └── useKeyboardShortcuts.ts # NEW - centralized keyboard handler
├── components/
│   ├── Canvas/
│   │   └── Canvas.tsx         # MODIFY - integrate keyboard hook, add tabIndex
│   ├── Node/
│   │   └── Node.tsx           # MODIFY - add selection state, keyboard delete
│   ├── NodeEditor/
│   │   └── NodeEditor.tsx     # MODIFY - Enter/Escape handling (if exists)
│   └── TrustScoreEditor/
│       └── TrustScoreEditor.tsx # MODIFY - Enter/Escape for modal
├── context/
│   └── CanvasContext.tsx      # MODIFY - add selectedNodeId state
└── types/
    └── index.ts               # MODIFY - add KeyboardShortcut types
```

**Structure Decision**: Follows existing web application structure. New functionality added as a custom hook (useKeyboardShortcuts) following the established pattern of useCanvasState and useDragAndDrop.

## Complexity Tracking

> No violations - all implementations follow constitution principles.

| Aspect | Approach | Justification |
|--------|----------|---------------|
| Event handling | Single centralized hook | Avoids scattered keyboard listeners across components |
| Focus management | Check document.activeElement | Standard browser API, no external dependencies |
| Selection state | Add to existing CanvasContext | Extends existing pattern rather than new context |

## Architecture Decisions

### AD-001: Centralized Keyboard Hook

**Decision**: Create a single `useKeyboardShortcuts` hook that handles all keyboard events at the canvas level.

**Rationale**:
- Prevents event listener proliferation across components
- Single point of control for enabling/disabling shortcuts based on focus
- Easier to maintain and extend
- Follows existing hook patterns (useCanvasState, useDragAndDrop)

**Alternatives Rejected**:
- Per-component keyboard handlers: Would lead to scattered, hard-to-maintain code
- Third-party keyboard library: Overkill for 6 shortcuts, adds dependency

### AD-002: Focus-Based Shortcut Disabling

**Decision**: Check `document.activeElement` to disable shortcuts when text inputs have focus.

**Rationale**:
- Native browser API, no dependencies
- Reliable across all browsers
- Simple boolean check before processing each key event

**Implementation Pattern**:
```typescript
const isTextInputFocused = () => {
  const active = document.activeElement;
  return active?.tagName === 'INPUT' ||
         active?.tagName === 'TEXTAREA' ||
         active?.getAttribute('contenteditable') === 'true';
};
```

### AD-003: Selection State in Context

**Decision**: Add `selectedNodeId` to existing CanvasContext rather than creating new context.

**Rationale**:
- Selection is canvas-level state, fits with existing canvas state
- Avoids context provider nesting complexity
- Single source of truth for canvas interactions

### AD-004: Keyboard Event Key Codes

**Decision**: Use `event.key` property for key detection, not `event.keyCode` (deprecated).

**Rationale**:
- `event.key` is the modern standard
- Handles international keyboard layouts better
- More readable code ('Escape' vs 27)

**Key Mappings**:
| Action | event.key values |
|--------|-----------------|
| Cancel | 'Escape' |
| Confirm | 'Enter' |
| Zoom In | '+', '=' |
| Zoom Out | '-', '_' |
| Pan | 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight' |
| Delete | 'Delete', 'Backspace' |
| Center | ' ' (Space) |

## Implementation Phases

### Phase 1: Core Hook + Escape/Enter (P1 User Story)

1. Create `useKeyboardShortcuts.ts` hook skeleton
2. Add focus detection logic
3. Implement Escape handler for edit mode cancellation
4. Implement Enter handler for edit mode confirmation
5. Integrate hook into Canvas component
6. Add tabIndex to canvas for keyboard focus

### Phase 2: Zoom Shortcuts (P2 User Story)

1. Add +/- key handlers to hook
2. Connect to existing zoom state from useCanvasState
3. Define zoom increment (0.1 or 10%)
4. Add zoom bounds checking (min: 0.25, max: 2.0)

### Phase 3: Pan Shortcuts (P3 User Story)

1. Add arrow key handlers to hook
2. Connect to existing pan state from useCanvasState
3. Define pan increment (50px per keypress)
4. Implement smooth pan animation (optional enhancement)

### Phase 4: Delete Shortcut (P4 User Story)

1. Add selectedNodeId to CanvasContext
2. Add visual selection indicator to Node component
3. Add Delete key handler to hook
4. Connect to existing removeNode action
5. Guard against deleting self node

### Phase 5: Center View Shortcut (P5 User Story)

1. Add Space key handler to hook
2. Calculate self node center position
3. Implement smooth pan animation to center
4. Add zoom-aware centering (maintain current zoom level)

## Dependencies Between Phases

```
Phase 1 (Escape/Enter) <- Foundation, no dependencies
    |
Phase 2 (Zoom) <- Depends on Phase 1 hook structure
    |
Phase 3 (Pan) <- Depends on Phase 1 hook structure
    |
Phase 4 (Delete) <- Depends on Phase 1 + new selection state
    |
Phase 5 (Center) <- Depends on Phase 3 pan logic
```

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Shortcut conflicts with browser | Low | High | Check event.key, avoid Ctrl/Cmd combinations |
| Shortcut conflicts with screen readers | Medium | High | Only handle keys when canvas focused, test with VoiceOver |
| Focus state detection unreliable | Low | Medium | Use robust activeElement check, test across browsers |
| Performance impact from key listeners | Low | Low | Single listener, efficient early-exit checks |

## Success Validation

After implementation, validate against spec success criteria:

- [ ] SC-001: All 5 shortcut actions work with keyboard only
- [ ] SC-002: Full editing workflow possible without mouse (after initial click)
- [ ] SC-003: Shortcuts respond within 100ms
- [ ] SC-004: Works on Chrome, Firefox, Safari, Edge
- [ ] SC-005: Does not interfere with screen reader (manual test)
- [ ] SC-006: User feedback on efficiency improvement (post-deployment)
