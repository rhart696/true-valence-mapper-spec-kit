# Research: Relationship Canvas Technology Decisions

**Feature**: 001-relationship-canvas
**Date**: 2025-12-03
**Status**: Decisions Made

## Overview

This document captures research into technical approaches for building an interactive relationship canvas with drag-and-drop nodes, zoom/pan navigation, and support for 25+ nodes at 60 FPS performance.

---

## Decision 1: Canvas Rendering Approach

### Options Evaluated

**Option A: Native HTML5 Canvas API**
- **Pros**: Maximum performance, full control, no dependencies, TypeScript support built-in
- **Cons**: Low-level API (manual pixel manipulation), more code for basic shapes, harder to make modular
- **Performance**: Excellent (hardware-accelerated)
- **Modularity**: Requires significant abstraction layer to achieve component-like structure

**Option B: Konva.js (Canvas library)**
- **Pros**: Higher-level API, scene graph model, built-in hit detection, TypeScript support, layering
- **Cons**: Additional 90KB dependency, learning curve, may be overkill for simple nodes
- **Performance**: Very good (optimized Canvas rendering)
- **Modularity**: Good - layers and groups provide structure

**Option C: SVG + React (DOM-based)**
- **Pros**: Declarative React components, CSS styling, accessibility, easy to inspect/debug, modular by default
- **Cons**: Performance concerns with 25+ nodes, CSS transform complexity for zoom/pan
- **Performance**: Good for <50 elements, potential issues with many animated nodes
- **Modularity**: Excellent - each node is a React component

### Decision: **SVG + React (Option C)**

**Rationale**:
1. **Modularity aligns with Constitution Principle IV**: Each node is an independent React component
2. **Type Safety**: React + TypeScript integration is mature and well-documented
3. **Sufficient Performance**: 25 nodes is well within SVG's performance envelope, especially for drag (not continuous animation)
4. **Simplicity**: Declarative approach reduces code complexity vs. imperative Canvas API
5. **Future-Proof**: If performance becomes an issue, can migrate to Canvas/Konva without changing component API

**Trade-off Accepted**: If scaling to 100+ nodes, may need to revisit. For MVP scope (25 nodes), SVG is appropriate.

---

## Decision 2: Drag-and-Drop Implementation

### Options Evaluated

**Option A: Native HTML5 Drag-and-Drop API**
- **Pros**: Built-in browser support, no dependencies
- **Cons**: Poor mobile support, awkward API (dataTransfer, dragImage), not ideal for canvas-style dragging
- **Use Case**: Better for drag between containers, not smooth canvas positioning

**Option B: Pointer Events (PointerDown/Move/Up)**
- **Pros**: Unified touch/mouse events, smooth tracking, full control, mobile-friendly
- **Cons**: More manual event handling code, need to manage capture/release
- **Use Case**: Ideal for canvas-style drag where node follows cursor precisely

**Option C: react-dnd or similar library**
- **Pros**: Batteries-included drag-and-drop, good TypeScript support
- **Cons**: 60KB+ dependency, designed for list/grid reordering not freeform canvas, overkill for simple use case

### Decision: **Pointer Events (Option B)**

**Rationale**:
1. **Fitness for Purpose**: Canvas dragging needs smooth cursor tracking, not container-to-container transfer
2. **No Unnecessary Complexity**: Native API is sufficient, no 60KB library needed
3. **Mobile Support**: Pointer events handle touch and mouse uniformly
4. **Full Control**: Can implement exact UX (cursor feedback, bounds checking, snap-to-grid if needed)

**Implementation Approach**:
```typescript
const useDragAndDrop = (nodeId: string) => {
  const onPointerDown = (e: React.PointerEvent) => {
    e.target.setPointerCapture(e.pointerId);
    // Track initial position
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (captured) {
      // Update node position
    }
  };
  const onPointerUp = (e: React.PointerEvent) => {
    e.target.releasePointerCapture(e.pointerId);
  };
  return { onPointerDown, onPointerMove, onPointerUp };
};
```

---

## Decision 3: Zoom/Pan Implementation

### Options Evaluated

**Option A: CSS Transform on Container**
- **Pros**: Simple, hardware-accelerated, works with SVG, no calculations needed
- **Cons**: Need to manage transform state, coordinate conversion for mouse events
- **Implementation**: `transform: scale(zoom) translate(panX, panY)`

**Option B: SVG ViewBox Manipulation**
- **Pros**: SVG-native approach, coordinates stay consistent, built for this use case
- **Cons**: Slightly more complex calculations, need to understand viewBox coordinate system
- **Implementation**: `<svg viewBox="x y width height">`

**Option C: Library (react-zoom-pan-pinch, panzoom)**
- **Pros**: Handles edge cases, smooth animations, gesture support
- **Cons**: 20-40KB dependency, may conflict with drag-and-drop, learning curve

### Decision: **CSS Transform (Option A)**

**Rationale**:
1. **Simplicity**: Single CSS property, familiar to developers
2. **Performance**: Hardware-accelerated transforms, smooth 60 FPS
3. **No Dependencies**: Native browser capability
4. **Works with Drag**: Pointer events provide screen coordinates, can convert to canvas coordinates with simple math

**Implementation Approach**:
```typescript
const [viewTransform, setViewTransform] = useState({ zoom: 1, panX: 0, panY: 0 });

// Apply to canvas container
<div style={{ transform: `scale(${zoom}) translate(${panX}px, ${panY}px)` }}>
  {nodes.map(node => <Node {...node} />)}
</div>

// Coordinate conversion for pointer events
const screenToCanvas = (screenX: number, screenY: number) => ({
  x: (screenX - panX) / zoom,
  y: (screenY - panY) / zoom
});
```

---

## Decision 4: State Management

### Options Evaluated

**Option A: useState + useReducer**
- **Pros**: Built-in React, no dependencies, sufficient for single-component state
- **Cons**: Prop drilling if deeply nested, re-renders can be inefficient
- **Use Case**: Good for simple state trees

**Option B: Zustand**
- **Pros**: Lightweight (3KB), TypeScript-friendly, no provider wrapping, selectors prevent re-renders
- **Cons**: Another dependency, overkill if state is simple
- **Use Case**: Good for complex state with many consumers

**Option C: React Context**
- **Pros**: Built-in React, avoids prop drilling
- **Cons**: All consumers re-render on any context change, boilerplate for splitting contexts
- **Use Case**: Good for infrequent updates (theme, auth), bad for frequent updates (drag position)

### Decision: **useState + useReducer (Option A)**

**Rationale**:
1. **Sufficient Complexity**: Canvas state is a flat array of nodes + view transform, no deep nesting
2. **No Dependencies**: Aligns with "no unnecessary complexity" principle
3. **Performance**: With proper React.memo and callback optimization, re-renders are manageable
4. **Modularity**: Custom hook (`useCanvasState`) encapsulates logic, can swap implementation later

**Implementation Approach**:
```typescript
interface CanvasState {
  nodes: PersonNode[];
  viewTransform: { zoom: number; panX: number; panY: number };
}

const useCanvasState = () => {
  const [state, setState] = useState<CanvasState>(initialState);

  const addNode = useCallback((name: string) => { /*...*/ }, []);
  const updateNodePosition = useCallback((id: string, pos: Position) => { /*...*/ }, []);
  const removeNode = useCallback((id: string) => { /*...*/ }, []);

  return { state, addNode, updateNodePosition, removeNode };
};
```

---

## Decision 5: Node Positioning System

### Options Evaluated

**Option A: Absolute Positioning (top/left CSS)**
- **Pros**: Simple, direct mapping of x/y to pixels
- **Cons**: Doesn't work well inside transformed containers, viewport-dependent
- **Coordinate System**: Pixels from top-left of container

**Option B: Transform-Based Positioning (translate)**
- **Pros**: Works inside zoom/pan transforms, composition-friendly, hardware-accelerated
- **Cons**: Slightly more complex CSS
- **Coordinate System**: Relative to element's natural position

**Option C: SVG Coordinates (x/y attributes)**
- **Pros**: SVG-native, coordinate system independent of viewport, works with viewBox
- **Cons**: Requires SVG elements (`<circle>`, `<rect>`, `<text>`)
- **Coordinate System**: SVG user space (defined by viewBox)

### Decision: **Transform-Based Positioning (Option B)**

**Rationale**:
1. **Zoom/Pan Compatibility**: Transforms compose naturally with container-level zoom/pan transform
2. **Performance**: GPU-accelerated, smooth animations
3. **Flexibility**: Works with any DOM element (div, SVG, etc.), not locked to SVG-specific approach
4. **Familiar Pattern**: Common in React drag-and-drop implementations

**Implementation Approach**:
```typescript
interface PersonNode {
  id: string;
  name: string;
  position: { x: number; y: number }; // Pixels from canvas origin
  isSelf: boolean;
}

// Render node
<div
  className="node"
  style={{
    transform: `translate(${node.position.x}px, ${node.position.y}px)`,
    position: 'absolute'
  }}
>
  {node.name}
</div>
```

---

## Summary of Decisions

| Decision Area | Choice | Key Reason |
|---------------|--------|------------|
| Rendering | SVG + React | Modularity, declarative, sufficient performance |
| Drag-and-Drop | Pointer Events | Precise control, no dependencies, mobile-friendly |
| Zoom/Pan | CSS Transform | Simple, performant, hardware-accelerated |
| State Management | useState/useReducer | Sufficient complexity, no dependencies |
| Node Positioning | Transform-based | Composable with zoom/pan, GPU-accelerated |

**Constitutional Alignment**:
- ✅ Modularity: React components, custom hooks
- ✅ Type Safety: TypeScript interfaces for all entities
- ✅ No Unnecessary Complexity: Native APIs preferred over libraries
- ✅ Performance: All choices support 60 FPS target

---

## Deferred Decisions

**Not Researched (Out of MVP Scope)**:
1. Persistence layer (localStorage, backend) - Deferred to future feature
2. Undo/redo - Not required for MVP
3. Export to image/PDF - Not required for MVP
4. Auto-layout algorithms - Manual positioning is sufficient for MVP
5. Collision detection - Not required, overlapping nodes acceptable

**Revisit If**:
- Performance issues with 25+ nodes → Consider Canvas/Konva migration
- Need for 100+ nodes → Virtualization or Canvas required
- Mobile touch gestures feel unresponsive → Evaluate gesture libraries
