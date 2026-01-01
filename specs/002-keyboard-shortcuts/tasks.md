# Tasks: Keyboard Shortcuts

**Input**: Design documents from `/specs/002-keyboard-shortcuts/`
**Prerequisites**: plan.md (complete), spec.md (complete), research.md (complete), data-model.md (complete), quickstart.md (complete)

**Tests**: Not required per specification. Manual testing via quickstart.md scenarios.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app frontend**: `app/client/src/`
- Hooks: `app/client/src/hooks/`
- Components: `app/client/src/components/`
- Context: `app/client/src/context/`
- Types: `app/client/src/types/`

---

## Phase 1: Setup

**Purpose**: Create the keyboard shortcuts hook skeleton and add required types

- [ ] T001 Add KeyboardShortcutAction and UseKeyboardShortcutsOptions types in app/client/src/types/index.ts
- [ ] T002 Create useKeyboardShortcuts.ts hook skeleton with focus detection in app/client/src/hooks/useKeyboardShortcuts.ts
- [ ] T003 Add selectedNodeId state and selectNode action to CanvasContext in app/client/src/context/CanvasContext.tsx

**Checkpoint**: Hook skeleton exists, types defined, context extended

---

## Phase 2: Foundational

**Purpose**: Integrate keyboard hook into Canvas and ensure focus handling works

**CRITICAL**: Must complete before user story implementation

- [ ] T004 Add tabIndex={0} to Canvas container div for keyboard focus in app/client/src/components/Canvas/Canvas.tsx
- [ ] T005 Import and call useKeyboardShortcuts in Canvas component with empty handlers in app/client/src/components/Canvas/Canvas.tsx
- [ ] T006 Implement isTextInputFocused() helper function in app/client/src/hooks/useKeyboardShortcuts.ts
- [ ] T007 Add window keydown event listener with cleanup in useKeyboardShortcuts hook in app/client/src/hooks/useKeyboardShortcuts.ts

**Checkpoint**: Canvas receives keyboard focus, hook listens for events, text inputs are detected

---

## Phase 3: User Story 1 - Cancel and Confirm Editing (Priority: P1) MVP

**Goal**: Escape cancels edit mode/modals, Enter confirms and saves

**Independent Test**: Click node to edit, press Escape (discards), click again, press Enter (saves)

### Implementation for User Story 1

- [ ] T008 [US1] Add onCancel and onConfirm callbacks to useKeyboardShortcuts options in app/client/src/hooks/useKeyboardShortcuts.ts
- [ ] T009 [US1] Implement Escape key handler that calls onCancel in app/client/src/hooks/useKeyboardShortcuts.ts
- [ ] T010 [US1] Implement Enter key handler that calls onConfirm in app/client/src/hooks/useKeyboardShortcuts.ts
- [ ] T011 [US1] Wire handleCancelEdit callback from Canvas to hook in app/client/src/components/Canvas/Canvas.tsx
- [ ] T012 [US1] Wire handleConfirmEdit callback from Canvas to hook in app/client/src/components/Canvas/Canvas.tsx
- [ ] T013 [US1] Add Escape/Enter handling to TrustScoreEditor modal in app/client/src/components/TrustScoreEditor/TrustScoreEditor.tsx
- [ ] T014 [US1] Add Escape/Enter handling to Node inline edit mode in app/client/src/components/Node/Node.tsx

**Checkpoint**: Escape cancels edits, Enter confirms. Test with node rename and trust editor.

---

## Phase 4: User Story 2 - Zoom with Keyboard (Priority: P2)

**Goal**: +/= zooms in, - zooms out

**Independent Test**: Focus canvas, press + several times (zoom in), press - (zoom out), verify bounds

### Implementation for User Story 2

- [ ] T015 [US2] Add onZoom callback to useKeyboardShortcuts options in app/client/src/hooks/useKeyboardShortcuts.ts
- [ ] T016 [US2] Implement + and = key handlers for zoom in (delta: +1) in app/client/src/hooks/useKeyboardShortcuts.ts
- [ ] T017 [US2] Implement - key handler for zoom out (delta: -1) in app/client/src/hooks/useKeyboardShortcuts.ts
- [ ] T018 [US2] Wire handleZoom callback from Canvas to hook with 0.1 increment in app/client/src/components/Canvas/Canvas.tsx
- [ ] T019 [US2] Add zoom bounds checking (min: 0.25, max: 2.0) in handleZoom in app/client/src/components/Canvas/Canvas.tsx

**Checkpoint**: +/- keys zoom canvas, stops at bounds. Test at min and max zoom.

---

## Phase 5: User Story 3 - Pan with Arrow Keys (Priority: P3)

**Goal**: Arrow keys pan the canvas view

**Independent Test**: Focus canvas, press arrow keys, verify canvas pans in correct direction

### Implementation for User Story 3

- [ ] T020 [US3] Add onPan callback to useKeyboardShortcuts options in app/client/src/hooks/useKeyboardShortcuts.ts
- [ ] T021 [US3] Implement ArrowUp/Down/Left/Right key handlers in app/client/src/hooks/useKeyboardShortcuts.ts
- [ ] T022 [US3] Add preventDefault for arrow keys to stop page scroll in app/client/src/hooks/useKeyboardShortcuts.ts
- [ ] T023 [US3] Wire handlePan callback from Canvas to hook with 50px increment in app/client/src/components/Canvas/Canvas.tsx

**Checkpoint**: Arrow keys pan canvas. Content moves opposite to key direction (intuitive viewport movement).

---

## Phase 6: User Story 4 - Delete Selected Node (Priority: P4)

**Goal**: Delete key removes currently selected node

**Independent Test**: Click node (selected), press Delete (removed), click self node, press Delete (nothing happens)

### Implementation for User Story 4

- [ ] T024 [US4] Add onDelete callback to useKeyboardShortcuts options in app/client/src/hooks/useKeyboardShortcuts.ts
- [ ] T025 [US4] Implement Delete and Backspace key handlers in app/client/src/hooks/useKeyboardShortcuts.ts
- [ ] T026 [US4] Add visual selection indicator CSS to Node component in app/client/src/components/Node/Node.module.css
- [ ] T027 [US4] Integrate selectedNodeId from context into Node component in app/client/src/components/Node/Node.tsx
- [ ] T028 [US4] Update Node onClick to call selectNode(id) in app/client/src/components/Node/Node.tsx
- [ ] T029 [US4] Add canvas background click handler to clear selection (selectNode(null)) in app/client/src/components/Canvas/Canvas.tsx
- [ ] T030 [US4] Wire handleDeleteSelected callback with self-node guard in app/client/src/components/Canvas/Canvas.tsx

**Checkpoint**: Clicking node shows selection, Delete removes it, self node protected.

---

## Phase 7: User Story 5 - Center View on Self (Priority: P5)

**Goal**: Space bar centers view on self node

**Independent Test**: Pan away from center, press Space, verify smooth animation to center on self

### Implementation for User Story 5

- [ ] T031 [US5] Add onCenter callback to useKeyboardShortcuts options in app/client/src/hooks/useKeyboardShortcuts.ts
- [ ] T032 [US5] Implement Space key handler with preventDefault in app/client/src/hooks/useKeyboardShortcuts.ts
- [ ] T033 [US5] Create handleCenterOnSelf function that calculates self node center in app/client/src/components/Canvas/Canvas.tsx
- [ ] T034 [US5] Add smooth pan animation (300ms transition) for centering in app/client/src/components/Canvas/Canvas.tsx
- [ ] T035 [US5] Wire handleCenterOnSelf to hook in app/client/src/components/Canvas/Canvas.tsx

**Checkpoint**: Space centers on self with smooth animation. Works at any zoom level.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final cleanup and validation

- [ ] T036 [P] Verify all shortcuts work when canvas is focused in app/client/src/components/Canvas/Canvas.tsx
- [ ] T037 [P] Verify shortcuts are disabled during text input in all input fields
- [ ] T038 [P] Test browser compatibility (Chrome, Firefox, Safari, Edge)
- [ ] T039 Run all quickstart.md test scenarios manually
- [ ] T040 Update specs/002-keyboard-shortcuts/checklists/requirements.md with implementation status

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-7)**: All depend on Foundational phase completion
  - User stories can then proceed sequentially in priority order (P1 to P5)
  - Some parallel work possible within each story
- **Polish (Phase 8)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational - Foundation for all keyboard handling
- **User Story 2 (P2)**: Can start after US1 - Uses same hook structure
- **User Story 3 (P3)**: Can start after US1 - Uses same hook structure
- **User Story 4 (P4)**: Can start after US1 - Requires selection state from Phase 1
- **User Story 5 (P5)**: Can start after US3 - Uses pan animation pattern

### Within Each User Story

- Hook changes before component integration
- Canvas integration before child component changes
- Core implementation before edge case handling

### Parallel Opportunities

- T001, T002, T003 can run in parallel (different files)
- T004, T005, T006, T007 are sequential (same files)
- Within each user story, hook changes must precede component wiring
- Polish tasks (T036-T038) can run in parallel

---

## Parallel Example: Setup Phase

```bash
# Launch all setup tasks together (different files):
Task: "T001 Add types in app/client/src/types/index.ts"
Task: "T002 Create hook skeleton in app/client/src/hooks/useKeyboardShortcuts.ts"
Task: "T003 Extend context in app/client/src/context/CanvasContext.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T003)
2. Complete Phase 2: Foundational (T004-T007)
3. Complete Phase 3: User Story 1 (T008-T014)
4. **STOP and VALIDATE**: Test Escape/Enter independently
5. Deploy/demo if ready - basic keyboard editing works!

### Incremental Delivery

1. Setup + Foundational -> Foundation ready
2. Add User Story 1 -> Escape/Enter works -> MVP!
3. Add User Story 2 -> +/- zoom works
4. Add User Story 3 -> Arrow pan works
5. Add User Story 4 -> Delete works
6. Add User Story 5 -> Space centers
7. Polish -> Complete feature

Each story adds value without breaking previous stories.

---

## Summary

| Phase | Tasks | User Story | Description |
|-------|-------|------------|-------------|
| 1 | T001-T003 | Setup | Types, hook skeleton, context |
| 2 | T004-T007 | Foundation | Focus, event listener |
| 3 | T008-T014 | US1 (P1) | Escape/Enter |
| 4 | T015-T019 | US2 (P2) | +/- Zoom |
| 5 | T020-T023 | US3 (P3) | Arrow Pan |
| 6 | T024-T030 | US4 (P4) | Delete Node |
| 7 | T031-T035 | US5 (P5) | Space Center |
| 8 | T036-T040 | Polish | Testing, validation |

**Total Tasks**: 40
**MVP Scope**: Phases 1-3 (14 tasks) - Escape/Enter functionality

---

## Notes

- All keyboard shortcuts must respect text input focus
- Test each user story independently before moving to next
- Commit after each completed user story phase
- Use quickstart.md scenarios for validation
