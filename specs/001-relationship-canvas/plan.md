# Implementation Plan: Relationship Canvas

**Branch**: `001-relationship-canvas` | **Date**: 2025-12-03 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-relationship-canvas/spec.md`

## Summary

Build an interactive, browser-based relationship canvas where users can add people as draggable nodes, position them spatially to reflect relationship dynamics, and navigate the canvas through zoom/pan controls. The user's own node is pre-placed at the center with distinct visual styling. This MVP is session-based (no persistence) and optimized for real-time coaching sessions where screen sharing and immediate visual feedback are critical.

**Technical Approach**: Client-only React application using HTML5 Canvas or SVG for rendering, native browser drag-and-drop APIs, and CSS transforms for zoom/pan. State management via React hooks (useState/useReducer). No backend required for MVP.

## Technical Context

**Language/Version**: JavaScript (ES2022) with TypeScript 5.9+ (strict mode)
**Primary Dependencies**: React 19, React DOM 19, Canvas manipulation library TBD (research: Konva.js vs. native Canvas API vs. SVG+React)
**Storage**: Browser memory only (session-based, no localStorage/persistence for MVP)
**Testing**: Not required for MVP per Spec-Kit optional testing approach
**Target Platform**: Modern web browsers (Chrome, Firefox, Safari, Edge - last 2 versions), desktop and tablet (768px+ width)
**Project Type**: Single-page web application (client-only)
**Performance Goals**: 60 FPS during drag operations, <100ms interaction latency, smooth zoom/pan with 25+ nodes
**Constraints**: Session-based only (data lost on refresh), no offline support required, must work without backend/API
**Scale/Scope**: Single canvas per session, 25+ nodes supported, typical usage 5-15 nodes

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Principle I: Specification-First Development** ✅
Specification completed and validated before planning.

**Principle II: User Story Driven** ✅
Three independently testable user stories (P1: Map Core Team, P2: Edit and Refine, P3: Navigate Large Networks).

**Principle III: Test-Conscious (Contextual)** ✅
No tests explicitly requested in spec. MVP proceeds without test suite.

**Principle IV: Modularity & Composability** ✅
Planned architecture:
- `Canvas` component (rendering layer)
- `Node` component (person representation)
- `NodeEditor` component (add/rename/remove)
- `ZoomPanControls` component (navigation)
- `useCanvasState` hook (state management)

**Principle V: Type Safety & Contracts** ✅
TypeScript strict mode enforced. Interfaces defined for:
- `PersonNode` (id, name, position, isSelf)
- `CanvasState` (nodes, zoom, panOffset)
- Event handlers with explicit types

**Principle VI: Incremental Delivery** ✅
P1 (Map Core Team) delivers standalone value - users can create and view maps.
P2 (Edit/Refine) enhances without breaking P1.
P3 (Navigate Large) adds scalability without requiring P1/P2 changes.

**Technology Selection Against Constitution Criteria:**
1. **Fitness for purpose**: React + Canvas/SVG ideal for interactive visual UI
2. **Type safety support**: TypeScript provides explicit contracts
3. **Modularity support**: React component model enables independent modules
4. **Testing support**: React Testing Library available if tests added later
5. **Team familiarity**: Standard React patterns
6. **Multi-edition impact**: No conflicts - self-contained client app

**Verdict**: PASSED - No constitutional violations.

## Project Structure

### Documentation (this feature)

```text
specs/001-relationship-canvas/
├── plan.md                    # This file
├── research.md                # Canvas rendering library comparison
├── data-model.md              # PersonNode, CanvasState interfaces
├── quickstart.md              # Local dev setup + first-run experience
└── checklists/
    └── requirements.md        # Spec validation (already exists)
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── Canvas/
│   │   ├── Canvas.tsx              # Main canvas container
│   │   ├── Canvas.module.css       # Canvas-specific styles
│   │   └── useCanvasInteractions.ts # Drag, zoom, pan logic
│   ├── Node/
│   │   ├── Node.tsx                # Individual node visualization
│   │   └── Node.module.css         # Node styling
│   ├── NodeEditor/
│   │   ├── NodeEditor.tsx          # Add/rename/remove UI
│   │   └── NodeEditor.module.css   # Editor styling
│   └── ZoomPanControls/
│       ├── ZoomPanControls.tsx     # Zoom in/out, reset controls
│       └── ZoomPanControls.module.css
├── hooks/
│   ├── useCanvasState.ts           # Canvas state management
│   └── useDragAndDrop.ts           # Drag-and-drop interactions
├── types/
│   ├── node.ts                     # PersonNode interface
│   └── canvas.ts                   # CanvasState interface
├── utils/
│   ├── positioning.ts              # Calculate node positions, bounds
│   └── canvasHelpers.ts            # Canvas utility functions
└── App.tsx                         # Root component, canvas integration
```

**Structure Decision**: Single-page application with component-based architecture. Each major UI element (Canvas, Node, Editor, Controls) is an independently testable module. State management via custom React hooks keeps business logic separate from presentation.

## Complexity Tracking

> **No constitutional violations - this section left empty.**

---

## Phase 0: Research & Technology Decisions

See [research.md](./research.md) for full research findings.

**Key Decisions to Research**:
1. **Canvas Rendering**: Native HTML5 Canvas API vs. Konva.js vs. SVG+React
2. **Drag-and-Drop**: Native HTML5 drag events vs. pointer events vs. library (react-dnd)
3. **Zoom/Pan**: CSS transforms vs. canvas transforms vs. library (pan-zoom or similar)
4. **State Management**: useState/useReducer vs. Zustand vs. context-only
5. **Node Positioning**: Absolute positioning vs. transform-based vs. canvas coordinates

**Decision Criteria** (from Constitution):
- Fitness for 25+ nodes at 60 FPS
- Type safety support (TypeScript integration)
- Modularity (can swap rendering layer later)
- No unnecessary complexity (prefer native APIs if sufficient)

---

## Phase 1: Design Artifacts

### Data Model
See [data-model.md](./data-model.md)

**Core Entities**:
- `PersonNode`: Represents a person on the canvas
- `CanvasState`: Overall canvas state (nodes, view transforms)
- `Position`: x/y coordinates
- `ViewTransform`: Zoom level and pan offset

### API Contracts
*N/A - No backend for MVP. Internal component contracts defined in data-model.md.*

### Quickstart Guide
See [quickstart.md](./quickstart.md)

**Developer Setup**:
1. Clone repo, install dependencies
2. Run dev server
3. Open canvas, add nodes, test interactions

**First-Run Experience** (for users):
1. Canvas loads with "You" node at center
2. "Add Person" button visible
3. Click to add, drag to position
4. Zoom/pan controls available

---

## Implementation Phases

### Phase 0: Foundation
1. Create basic Canvas component (empty canvas with "You" node)
2. Set up state management hooks
3. Define TypeScript interfaces

### Phase 1: P1 - Map Core Team
1. Implement "Add Person" functionality
2. Add drag-and-drop for nodes
3. Render nodes with labels
4. Style "You" node distinctly

### Phase 2: P2 - Edit and Refine
1. Add rename node functionality
2. Add remove node functionality
3. Improve drag UX (cursor feedback, node highlighting)

### Phase 3: P3 - Navigate Large Networks
1. Implement zoom in/out controls
2. Implement pan (drag canvas background)
3. Ensure node labels remain readable at zoom levels

---

## Success Validation

After implementation, validate against spec success criteria:
- SC-001: Create 5-10 person map in <3 minutes
- SC-002: Reposition node in <2 seconds
- SC-003: Smooth performance with 25 nodes
- SC-004: Distinguish self node within 1 second
- SC-005: 90% task completion without help
- SC-006: Responsive 768px-2560px
- SC-007: Zoom 50%-200% readable
- SC-008: Real-time editing during screen share

**Manual Testing Protocol** (no automated tests for MVP):
1. Load application in Chrome, Firefox, Safari
2. Add 10 nodes, drag each to new position
3. Rename 2 nodes, remove 1 node
4. Zoom to 50%, verify labels readable
5. Zoom to 200%, verify no performance degradation
6. Add 15 more nodes (total 25), test drag performance
7. Open in 768px window, verify layout responsive
8. Share screen in video call, verify real-time updates

---

## Next Steps

After planning approved:
1. Run `/speckit.tasks` to generate atomic task list
2. Execute tasks in priority order (P1 → P2 → P3)
3. Validate each user story independently before proceeding
