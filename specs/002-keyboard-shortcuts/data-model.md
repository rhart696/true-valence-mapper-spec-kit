# Data Model: Keyboard Shortcuts

**Feature**: 002-keyboard-shortcuts
**Date**: 2025-12-09

## Overview

This feature is primarily behavioral (keyboard event handling) rather than data-centric. The data model changes are minimal, focusing on adding selection state to the existing canvas context.

## New State

### Selection State

Added to existing `CanvasState` in context:

```typescript
interface CanvasState {
  // Existing fields...
  nodes: Node[];
  viewTransform: ViewTransform;

  // NEW: Track which node is selected for keyboard operations
  selectedNodeId: string | null;
}
```

**Behavior**:
- `null` when no node is selected
- Set to node ID when user clicks on a node
- Cleared when user clicks on empty canvas
- Used by Delete key handler to determine which node to remove

## New Types

### KeyboardShortcutAction

```typescript
type KeyboardShortcutAction =
  | 'cancel'      // Escape - close edit mode/modal
  | 'confirm'     // Enter - save and close
  | 'zoomIn'      // + or = key
  | 'zoomOut'     // - key
  | 'panUp'       // ArrowUp
  | 'panDown'     // ArrowDown
  | 'panLeft'     // ArrowLeft
  | 'panRight'    // ArrowRight
  | 'delete'      // Delete or Backspace
  | 'center';     // Space bar
```

### KeyboardShortcutConfig

```typescript
interface KeyboardShortcutConfig {
  action: KeyboardShortcutAction;
  keys: string[];           // event.key values that trigger this action
  requiresSelection?: boolean;  // true for 'delete' action
  preventDefault?: boolean;     // true for actions that conflict with browser defaults
}
```

### UseKeyboardShortcutsOptions

```typescript
interface UseKeyboardShortcutsOptions {
  enabled: boolean;              // Global enable/disable
  onCancel?: () => void;         // Escape handler
  onConfirm?: () => void;        // Enter handler
  onZoom?: (delta: number) => void;  // +1 for in, -1 for out
  onPan?: (direction: 'up' | 'down' | 'left' | 'right') => void;
  onDelete?: () => void;         // Delete selected node
  onCenter?: () => void;         // Center on self node
}
```

## State Transitions

### Selection State Machine

```
[No Selection] ---(click node)---> [Node Selected]
[Node Selected] ---(click canvas)---> [No Selection]
[Node Selected] ---(click other node)---> [Other Node Selected]
[Node Selected] ---(delete key)---> [No Selection] + node removed
[Node Selected] ---(edit mode)---> [Node Selected] (preserved)
```

### Edit Mode Interactions

```
[Viewing] ---(click node)---> [Edit Mode]
[Edit Mode] ---(Escape)---> [Viewing] (changes discarded)
[Edit Mode] ---(Enter)---> [Viewing] (changes saved)
[Edit Mode] ---(click outside)---> [Viewing] (changes saved)
```

## Existing Entities (Unchanged)

### Node

No changes to Node type. Selection is tracked at context level, not in node data.

### ViewTransform

No changes to ViewTransform type. Zoom/pan operations use existing structure:

```typescript
interface ViewTransform {
  zoom: number;  // 0.25 to 2.0
  pan: { x: number; y: number };
}
```

## Context Actions (New)

Added to existing context actions:

```typescript
interface CanvasActions {
  // Existing...
  addNode: (name: string, position: Position) => void;
  removeNode: (id: string) => void;
  updateNodePosition: (id: string, position: Position) => void;
  updateViewTransform: (transform: Partial<ViewTransform>) => void;

  // NEW
  selectNode: (id: string | null) => void;
}
```

## Validation Rules

1. **Selection Validation**:
   - Can only select non-self nodes for deletion
   - Self node selection is allowed (for visual feedback) but delete is blocked

2. **Zoom Bounds**:
   - Minimum: 0.25 (25%)
   - Maximum: 2.0 (200%)
   - Increment: 0.1 (10%)

3. **Pan Bounds**:
   - No hard bounds (infinite canvas)
   - Increment: 50px per keypress
