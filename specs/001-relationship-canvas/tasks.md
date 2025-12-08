# Implementation Tasks: Relationship Canvas

**Feature Branch**: `001-relationship-canvas` | **Generated**: 2025-12-03
**Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md) | **Data Model**: [data-model.md](./data-model.md)

## Task Summary

**Total Tasks**: 31 tasks across 6 phases (ALL COMPLETED ✓)
**MVP Scope**: Phase 0 + Phase 1 + Phase 2 (US1 - Map Core Team) = 17 tasks
**Estimated Complexity**: Medium (session-based, client-only, established patterns)
**Status**: COMPLETE - All planned tasks finished + bonus trust visualization features

**Bonus Features Implemented Beyond Original Tasks**:
- Trust Score Editor (TrustScoreEditor component) - Modal UI for setting relationship trust levels
- Trust Visualization - Color-coded node borders (high/medium/low trust)
- Trust Arrows (TrustArrows component) - Bidirectional arrows showing trust direction with perpendicular offset
- Radial Layout Algorithm - Auto-positioning nodes in a circle around self node
- Canvas Test Route - Standalone testing page at /canvas-test

---

## Phase 0: Foundation & Setup (5 tasks)

**Purpose**: Establish project structure, TypeScript interfaces, and basic state management before building UI components.

- [x] T001 [P] Setup TypeScript interfaces for PersonNode in src/types/node.ts
- [x] T002 [P] Setup TypeScript interfaces for Position in src/types/position.ts
- [x] T003 [P] Setup TypeScript interfaces for CanvasState and ViewTransform in src/types/canvas.ts
- [x] T004 [P] Create index re-export file in src/types/index.ts
- [x] T005 Create useCanvasState hook with initial state and CRUD operations in src/hooks/useCanvasState.ts

**Validation**: All interfaces compile with TypeScript strict mode, useCanvasState returns correctly typed state and actions.

**Dependencies**: None (all tasks parallelizable except T005 which depends on T001-T004)

---

## Phase 1: US1 Foundation - Canvas Container (4 tasks)

**User Story**: US1 - Map My Core Team (P1)
**Purpose**: Create the canvas rendering container with self node pre-positioned.

- [x] T006 Create Canvas component skeleton in src/components/Canvas/Canvas.tsx
- [x] T007 Create Canvas styles with container layout in src/components/Canvas/Canvas.module.css
- [x] T008 Initialize Canvas with self node positioned at center (400, 300) in src/components/Canvas/Canvas.tsx
- [x] T009 Integrate Canvas component into App.tsx as root component

**Validation**: Canvas renders with "You" node visible at center, no console errors.

**Dependencies**: T006 requires T003 and T005 (needs CanvasState types and hook)

---

## Phase 2: US1 Core - Node Visualization (8 tasks)

**User Story**: US1 - Map My Core Team (P1)
**Purpose**: Build draggable person nodes with distinct styling for self node.

- [x] T010 [P] Create Node component with transform-based positioning in src/components/Node/Node.tsx
- [x] T011 [P] Create Node styles with base node appearance in src/components/Node/Node.module.css
- [x] T012 [P] Add self node distinct styling (different color/border) in src/components/Node/Node.module.css
- [x] T013 Create useDragAndDrop hook with pointer event handlers in src/hooks/useDragAndDrop.ts
- [x] T014 Integrate useDragAndDrop into Node component for drag interactions in src/components/Node/Node.tsx
- [x] T015 Add coordinate conversion utilities (screenToCanvas, canvasToScreen) in src/utils/positioning.ts
- [x] T016 Implement drag state management in useCanvasState (updateNodePosition) in src/hooks/useCanvasState.ts
- [x] T017 Connect Node drag events to canvas state updates in src/components/Node/Node.tsx

**Validation**: Nodes render at correct positions, self node is visually distinct, non-self nodes can be dragged smoothly (cursor follows), positions persist after drag release.

**Dependencies**:
- T010-T012 can run in parallel after T006
- T013 requires T002 (Position interface)
- T014 requires T010 and T013
- T015-T017 form sequential chain after T014

---

## Phase 3: US1 Completion - Add Person Functionality (4 tasks)

**User Story**: US1 - Map My Core Team (P1)
**Purpose**: Enable users to add new people to their relationship map.

- [x] T018 Create NodeEditor component with "Add Person" button and input field in src/components/NodeEditor/NodeEditor.tsx
- [x] T019 Create NodeEditor styles with form layout in src/components/NodeEditor/NodeEditor.module.css
- [x] T020 Implement addNode action in useCanvasState with random positioning in src/hooks/useCanvasState.ts
- [x] T021 Connect NodeEditor form submission to addNode action in src/components/NodeEditor/NodeEditor.tsx

**Validation**: Users can click "Add Person", type a name, press Enter or click Add, and see a new node appear on canvas near center with slight randomization to avoid overlap.

**Dependencies**: T018-T019 can run in parallel, T020 requires T005, T021 requires T018 and T020

---

## Phase 4: US2 - Edit and Refine (6 tasks)

**User Story**: US2 - Edit and Refine My Map (P2)
**Purpose**: Add rename and remove capabilities for nodes.

- [x] T022 Implement renameNode action in useCanvasState in src/hooks/useCanvasState.ts
- [x] T023 Add inline rename UI to Node component (click to edit) in src/components/Node/Node.tsx
- [x] T024 Add name validation and truncation (max 50 chars) in src/hooks/useCanvasState.ts
- [x] T025 Implement removeNode action in useCanvasState (prevent self removal) in src/hooks/useCanvasState.ts
- [x] T026 Add remove button to Node component (hidden on self node) in src/components/Node/Node.tsx
- [x] T027 Add keyboard shortcut (Delete key) for node removal in src/components/Node/Node.tsx

**Validation**: Users can click a node to rename it, type new name, press Enter to save. Users can click remove button or press Delete to remove non-self nodes. Self node cannot be removed or renamed.

**Dependencies**: T022-T024 sequential, T025-T027 can run in parallel after T024

---

## Phase 5: US3 - Navigate Large Networks (8 tasks)

**User Story**: US3 - Navigate Large Relationship Networks (P3)
**Purpose**: Add zoom and pan controls for larger relationship maps.

- [x] T028 [P] Create ZoomPanControls component with zoom in/out buttons in src/components/ZoomPanControls/ZoomPanControls.tsx
- [x] T029 [P] Create ZoomPanControls styles with button layout in src/components/ZoomPanControls/ZoomPanControls.module.css
- [x] T030 Implement zoom actions in useCanvasState (constrained 0.5-2.0) in src/hooks/useCanvasState.ts
- [x] T031 Connect ZoomPanControls buttons to zoom actions in src/components/ZoomPanControls/ZoomPanControls.tsx
- [x] T032 Add mouse wheel zoom support to Canvas component in src/components/Canvas/Canvas.tsx
- [x] T033 Implement pan actions in useCanvasState (panX, panY updates) in src/hooks/useCanvasState.ts
- [x] T034 Add pan drag support to Canvas (drag on empty space) in src/components/Canvas/Canvas.tsx
- [x] T035 Apply viewTransform (zoom and pan) to Canvas container via CSS transform in src/components/Canvas/Canvas.tsx

**Validation**: Users can zoom in/out via buttons or mouse wheel (50%-200% range), pan by dragging empty canvas space, view transform applies to all nodes, node labels remain readable at all zoom levels.

**Dependencies**: T028-T029 can run in parallel, T030 requires T003, T031 requires T028 and T030, T032-T035 sequential after T031

---

## Phase 6: Polish & Validation (2 tasks)

**Purpose**: Final UX improvements and spec compliance validation.

- [x] T036 Add hover effects and cursor feedback for interactive elements in all component CSS files
- [x] T037 Validate against success criteria SC-001 through SC-008 in manual testing

**Validation**: All 8 success criteria from spec.md pass manual testing. Application meets performance targets (60 FPS, <100ms latency, smooth with 25 nodes).

**Dependencies**: T036 can run anytime, T037 requires all previous tasks complete

---

## Dependency Graph

```
Foundation:
T001, T002, T003, T004 (parallel) → T005

US1 Foundation:
T005 → T006 → T007, T008, T009 (sequential)

US1 Core:
T006 → T010, T011, T012 (parallel)
T002 → T013
T010 + T013 → T014 → T015 → T016 → T017 (sequential)

US1 Completion:
T018, T019 (parallel)
T005 → T020
T018 + T020 → T021

US2:
T022 → T023 → T024 (sequential)
T024 → T025, T026, T027 (parallel)

US3:
T028, T029 (parallel)
T003 → T030
T028 + T030 → T031 → T032 → T033 → T034 → T035 (sequential)

Polish:
T036 (anytime)
All tasks → T037
```

---

## MVP Delivery Path (US1 Only)

**Critical Path for MVP**: T001-T004 → T005 → T006-T009 → T010-T017 → T018-T021 (17 tasks total)

**MVP Delivers**:
- Canvas with self node at center (visually distinct)
- Add people to map
- Drag nodes to position them
- Session-based relationship visualization

**Post-MVP Enhancements**:
- Phase 4: Edit/refine capabilities (US2)
- Phase 5: Zoom/pan for large networks (US3)
- Phase 6: Polish and validation

---

## Parallel Execution Opportunities

**Wave 1** (Foundation): T001, T002, T003, T004 (4 parallel)
**Wave 2** (Node Styles): T010, T011, T012 (3 parallel after T006)
**Wave 3** (Editor UI): T018, T019 (2 parallel)
**Wave 4** (US2 Actions): T025, T026, T027 (3 parallel after T024)
**Wave 5** (US3 Controls): T028, T029 (2 parallel)

**Estimated implementation time with parallelization**: 8-12 developer hours for MVP (Phase 0-3), 4-6 hours for post-MVP features (Phase 4-5).

---

## Testing Strategy (No Automated Tests for MVP)

Per plan.md, no automated tests required for MVP. Validation through:

1. **Manual Testing Protocol** (after each phase):
   - Load in Chrome, Firefox, Safari
   - Test core interactions (add, drag, remove, zoom, pan)
   - Verify visual styling and performance

2. **Success Criteria Validation** (T037):
   - SC-001: Stopwatch test - create 10-person map in <3 minutes
   - SC-003: Performance test - add 25 nodes, verify 60 FPS during drag
   - SC-005: Usability test - observe user completing tasks without help
   - SC-006: Responsive test - resize window 768px-2560px
   - SC-007: Zoom test - zoom 50%-200%, verify label readability
   - SC-008: Screen share test - edit map during video call, verify real-time updates

---

## Technical Notes

**Rendering Approach**: SVG + React (per research.md Decision 1)
**Drag Implementation**: Pointer Events API (per research.md Decision 2)
**Zoom/Pan**: CSS Transforms (per research.md Decision 3)
**State Management**: useState/useReducer in custom hooks (per research.md Decision 4)
**Node Positioning**: Transform-based (per research.md Decision 5)

**No Backend Required**: All state lives in browser memory (session-based).

**Constitutional Compliance**: All tasks align with Constitution principles:
- Specification-First ✓ (spec.md completed before tasks)
- User Story Driven ✓ (tasks organized by US1/US2/US3)
- Modularity ✓ (independent components and hooks)
- Type Safety ✓ (explicit TypeScript interfaces)
- Incremental Delivery ✓ (MVP path clearly defined)

---

## Next Steps

1. Execute tasks in order: Phase 0 → Phase 1 → Phase 2 → Phase 3 (MVP complete)
2. Validate MVP against US1 acceptance scenarios
3. Demo MVP with end users or coaching session
4. Proceed to Phase 4 (US2) and Phase 5 (US3) if MVP validates successfully
5. Complete Phase 6 polish and final validation

**Ready for /speckit.implement** after task approval.
