# Data Model: Relationship Canvas

**Feature**: 001-relationship-canvas
**Date**: 2025-12-03

## Overview

This document defines the TypeScript interfaces and data structures for the Relationship Canvas feature. All entities are client-side only (no backend/database for MVP).

---

## Core Entities

### PersonNode

Represents an individual person on the relationship canvas.

```typescript
interface PersonNode {
  /**
   * Unique identifier for this node.
   * Generated using crypto.randomUUID() or similar.
   */
  id: string;

  /**
   * Display name of the person.
   * Max length: 50 characters (truncated with ellipsis if longer).
   * Required, non-empty.
   */
  name: string;

  /**
   * Position on the canvas in pixels from the canvas origin (top-left).
   * Coordinates are transformed during render based on zoom/pan state.
   */
  position: Position;

  /**
   * Whether this node represents the user themselves.
   * Only one node can have isSelf: true per canvas.
   * The self node is styled distinctly and positioned at canvas center by default.
   */
  isSelf: boolean;
}
```

**Validation Rules**:
- `id`: Must be unique within the canvas
- `name`: Required, 1-50 characters, no leading/trailing whitespace
- `position`: Must be within canvas bounds (0-10000px recommended range)
- `isSelf`: Only one node per canvas can be `true`

**Lifecycle**:
- Created: When user clicks "Add Person" or canvas initializes with self node
- Updated: When user drags (position changes) or renames (name changes)
- Deleted: When user clicks remove/delete on a node

---

### Position

Represents x/y coordinates on the canvas.

```typescript
interface Position {
  /** Horizontal position in pixels from canvas left edge */
  x: number;

  /** Vertical position in pixels from canvas top edge */
  y: number;
}
```

**Coordinate System**:
- Origin (0, 0) is top-left of canvas
- Positive x moves right, positive y moves down
- Coordinates are canvas-space (before zoom/pan transforms)
- Screen coordinates are converted to canvas coordinates during interactions

---

### CanvasState

Overall state of the relationship canvas.

```typescript
interface CanvasState {
  /**
   * Array of all person nodes on the canvas.
   * First node (index 0) is always the self node.
   */
  nodes: PersonNode[];

  /**
   * Current zoom and pan state for canvas navigation.
   */
  viewTransform: ViewTransform;

  /**
   * Optional: ID of the node currently being edited (rename mode).
   * null if no node is being edited.
   */
  editingNodeId: string | null;
}
```

**Initial State**:
```typescript
const initialCanvasState: CanvasState = {
  nodes: [
    {
      id: 'self',
      name: 'You',  // Could be customized with user's actual name
      position: { x: 400, y: 300 },  // Center of typical canvas
      isSelf: true
    }
  ],
  viewTransform: {
    zoom: 1,
    panX: 0,
    panY: 0
  },
  editingNodeId: null
};
```

---

### ViewTransform

Represents the current zoom level and pan offset for canvas navigation.

```typescript
interface ViewTransform {
  /**
   * Zoom level as a scale factor.
   * 1.0 = 100% (default), 0.5 = 50% (zoomed out), 2.0 = 200% (zoomed in).
   * Min: 0.5, Max: 2.0 (per success criteria).
   */
  zoom: number;

  /**
   * Horizontal pan offset in pixels.
   * Positive values pan canvas right, negative values pan left.
   */
  panX: number;

  /**
   * Vertical pan offset in pixels.
   * Positive values pan canvas down, negative values pan up.
   */
  panY: number;
}
```

**Validation Rules**:
- `zoom`: 0.5 ≤ zoom ≤ 2.0
- `panX`, `panY`: No hard limits, but should keep canvas visible (implementation detail)

---

## State Transitions

### Adding a Node

```typescript
/**
 * Creates a new person node and adds it to the canvas.
 * New node is positioned near the center with slight randomization to avoid overlap.
 */
function addNode(state: CanvasState, name: string): CanvasState {
  const newNode: PersonNode = {
    id: crypto.randomUUID(),
    name: name.trim().slice(0, 50),
    position: {
      x: 400 + Math.random() * 100 - 50,  // Randomize within 100px of center
      y: 300 + Math.random() * 100 - 50
    },
    isSelf: false
  };

  return {
    ...state,
    nodes: [...state.nodes, newNode]
  };
}
```

### Updating Node Position (Drag)

```typescript
/**
 * Updates the position of a node during drag operation.
 */
function updateNodePosition(
  state: CanvasState,
  nodeId: string,
  newPosition: Position
): CanvasState {
  return {
    ...state,
    nodes: state.nodes.map(node =>
      node.id === nodeId
        ? { ...node, position: newPosition }
        : node
    )
  };
}
```

### Renaming a Node

```typescript
/**
 * Updates the name of a node.
 */
function renameNode(
  state: CanvasState,
  nodeId: string,
  newName: string
): CanvasState {
  return {
    ...state,
    nodes: state.nodes.map(node =>
      node.id === nodeId
        ? { ...node, name: newName.trim().slice(0, 50) }
        : node
    )
  };
}
```

### Removing a Node

```typescript
/**
 * Removes a node from the canvas.
 * Cannot remove the self node (isSelf: true).
 */
function removeNode(
  state: CanvasState,
  nodeId: string
): CanvasState {
  const nodeToRemove = state.nodes.find(n => n.id === nodeId);

  if (nodeToRemove?.isSelf) {
    throw new Error('Cannot remove self node');
  }

  return {
    ...state,
    nodes: state.nodes.filter(node => node.id !== nodeId)
  };
}
```

### Zooming

```typescript
/**
 * Updates the zoom level, constrained to 0.5-2.0 range.
 */
function setZoom(
  state: CanvasState,
  newZoom: number
): CanvasState {
  return {
    ...state,
    viewTransform: {
      ...state.viewTransform,
      zoom: Math.max(0.5, Math.min(2.0, newZoom))
    }
  };
}
```

### Panning

```typescript
/**
 * Updates the pan offset (canvas position).
 */
function setPan(
  state: CanvasState,
  panX: number,
  panY: number
): CanvasState {
  return {
    ...state,
    viewTransform: {
      ...state.viewTransform,
      panX,
      panY
    }
  };
}
```

---

## Coordinate Conversion

When handling pointer events (drag, click), screen coordinates need to be converted to canvas coordinates to account for zoom/pan.

```typescript
/**
 * Converts screen coordinates (from pointer event) to canvas coordinates.
 */
function screenToCanvas(
  screenX: number,
  screenY: number,
  viewTransform: ViewTransform,
  canvasOffset: { left: number; top: number }
): Position {
  // Subtract canvas offset to get position relative to canvas element
  const relativeX = screenX - canvasOffset.left;
  const relativeY = screenY - canvasOffset.top;

  // Apply inverse of zoom/pan transform
  return {
    x: (relativeX - viewTransform.panX) / viewTransform.zoom,
    y: (relativeY - viewTransform.panY) / viewTransform.zoom
  };
}

/**
 * Converts canvas coordinates to screen coordinates (for rendering).
 */
function canvasToScreen(
  canvasX: number,
  canvasY: number,
  viewTransform: ViewTransform
): Position {
  return {
    x: canvasX * viewTransform.zoom + viewTransform.panX,
    y: canvasY * viewTransform.zoom + viewTransform.panY
  };
}
```

---

## Type Definitions File Structure

Recommended file organization:

```
src/types/
├── node.ts           # PersonNode interface
├── canvas.ts         # CanvasState, ViewTransform
├── position.ts       # Position interface
└── index.ts          # Re-exports all types
```

**src/types/index.ts**:
```typescript
export type { PersonNode } from './node';
export type { CanvasState, ViewTransform } from './canvas';
export type { Position } from './position';
```

---

## State Persistence

**MVP Scope**: No persistence. State lives in React component memory and is lost on page refresh.

**Future Enhancement** (out of scope for 001):
- localStorage: Save/restore canvas state
- Backend API: Persist to server, enable multi-device access
- Session recovery: Warn before refresh, offer to restore

For now, users must complete their mapping session before closing the browser.

---

## Validation Summary

| Entity | Required Fields | Validation Rules | Uniqueness Constraints |
|--------|----------------|------------------|------------------------|
| PersonNode | id, name, position, isSelf | name: 1-50 chars, position: within canvas bounds | id must be unique |
| Position | x, y | x, y: numbers | - |
| CanvasState | nodes, viewTransform | At least 1 node (self) | Only 1 self node |
| ViewTransform | zoom, panX, panY | zoom: 0.5-2.0 | - |
