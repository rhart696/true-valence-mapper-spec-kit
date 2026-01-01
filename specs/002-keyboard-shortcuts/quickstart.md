# Quickstart: Keyboard Shortcuts

**Feature**: 002-keyboard-shortcuts
**Date**: 2025-12-09

## What This Feature Does

Adds keyboard shortcuts to the relationship canvas for faster navigation and editing. Power users can work without touching the mouse after initial node clicks.

## Keyboard Shortcuts Reference

| Key | Action | When Available |
|-----|--------|----------------|
| Escape | Cancel edit / close modal | When editing or modal open |
| Enter | Save changes | When editing or modal open |
| + or = | Zoom in | Canvas focused, not editing |
| - | Zoom out | Canvas focused, not editing |
| Arrow keys | Pan canvas | Canvas focused, not editing |
| Delete/Backspace | Remove selected node | Node selected, not editing |
| Space | Center on self node | Canvas focused, not editing |

## Quick Test Scenarios

### Scenario 1: Edit Cancel/Confirm

1. Click on any person node to enter edit mode
2. Type some text changes
3. Press **Escape** - verify changes are discarded
4. Click node again, type changes
5. Press **Enter** - verify changes are saved

### Scenario 2: Zoom Navigation

1. Click on empty canvas area to ensure focus
2. Press **+** or **=** several times - verify zoom in
3. Press **-** several times - verify zoom out
4. Verify zoom stops at min (25%) and max (200%) bounds

### Scenario 3: Pan Navigation

1. Add 10+ nodes to create a large map
2. Click on empty canvas
3. Press **Arrow keys** - verify canvas pans in correct direction
4. Press **Space** - verify view centers on your (self) node

### Scenario 4: Node Deletion

1. Click on a person node (not your self node)
2. Verify node shows selection indicator
3. Press **Delete** - verify node is removed
4. Click on your self node
5. Press **Delete** - verify nothing happens (self cannot be deleted)

### Scenario 5: Text Input Safety

1. Click "Add Person" button to focus input field
2. Type a name
3. Press **+**, **-**, arrow keys, etc.
4. Verify keys type into input (shortcuts disabled during text entry)

## Integration Points

### For Developers

The keyboard shortcuts are implemented via `useKeyboardShortcuts` hook:

```typescript
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

// In Canvas component
useKeyboardShortcuts({
  enabled: true,
  onCancel: handleCancelEdit,
  onConfirm: handleConfirmEdit,
  onZoom: (delta) => updateZoom(zoom + delta * 0.1),
  onPan: (direction) => updatePan(direction, 50),
  onDelete: handleDeleteSelected,
  onCenter: handleCenterOnSelf,
});
```

### For Testers

Focus requirements:
- Most shortcuts require canvas to have keyboard focus
- Click anywhere on canvas (not on nodes) to ensure focus
- Shortcuts are disabled when typing in text inputs

Browser testing:
- Test on Chrome, Firefox, Safari, Edge
- Test with screen reader (VoiceOver on Mac, NVDA on Windows)
- Verify shortcuts don't conflict with browser defaults

## Troubleshooting

**Shortcuts not working?**
1. Click on empty canvas area to give it focus
2. Make sure you're not in a text input field
3. Check browser console for errors

**Delete not removing node?**
1. Make sure a non-self node is selected (has selection indicator)
2. Self node cannot be deleted by design

**Zoom not changing?**
1. May have reached min (25%) or max (200%) bounds
2. Check current zoom level in UI

**Pan feels backwards?**
1. Arrow keys move the viewport, not the content
2. Up arrow reveals content above (content moves down visually)
