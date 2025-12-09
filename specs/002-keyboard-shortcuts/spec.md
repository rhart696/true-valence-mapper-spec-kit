# Feature Specification: Keyboard Shortcuts

**Feature Branch**: `002-keyboard-shortcuts`
**Created**: 2025-12-09
**Status**: Draft
**Input**: User description: "Add keyboard shortcuts for canvas navigation and node interactions: Escape to cancel edit mode, Enter to confirm changes, plus/minus to zoom, arrow keys to pan, Delete to remove selected node, Space to center view on self node"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Cancel and Confirm Editing Actions (Priority: P1)

Maria is editing a node name on her relationship map when she realizes she made a mistake and wants to discard her changes. She also wants a quick way to confirm changes without reaching for her mouse.

**Why this priority**: Escape and Enter are the most fundamental keyboard shortcuts for any editing interface. Users intuitively expect these keys to work, and their absence creates friction in every editing interaction. This is the highest-value shortcut set because it affects the most common user action (editing node names and trust scores).

**Independent Test**: User can open edit mode on any node, type changes, press Escape to discard OR Enter to confirm, and verify the change was discarded or saved respectively.

**Acceptance Scenarios**:

1. **Given** Maria has clicked on a node and is in edit mode (text input is active), **When** she presses Escape, **Then** the edit mode closes and any unsaved changes are discarded (node reverts to previous name)
2. **Given** Maria has clicked on a node and is in edit mode with modified text, **When** she presses Enter, **Then** the changes are saved and edit mode closes
3. **Given** Maria has opened the trust editor modal, **When** she presses Escape, **Then** the modal closes without saving changes
4. **Given** Maria has opened the trust editor modal and selected a trust level, **When** she presses Enter, **Then** the trust score is saved and the modal closes
5. **Given** Maria is not in any edit mode (just viewing the canvas), **When** she presses Escape or Enter, **Then** nothing happens (no errors, no unexpected behavior)

---

### User Story 2 - Zoom Canvas with Keyboard (Priority: P2)

David has a large relationship map with 20+ people and frequently needs to zoom in to see details and zoom out to see the full picture. Using keyboard shortcuts would be faster than finding and clicking zoom buttons or using mouse scroll.

**Why this priority**: Zoom is the second most common navigation action after editing. Power users especially benefit from keyboard zoom as it keeps hands on keyboard during data entry and analysis workflows.

**Independent Test**: User can press +/= to zoom in and -/_ to zoom out, observing the canvas scale change smoothly with each keypress.

**Acceptance Scenarios**:

1. **Given** David is viewing the canvas at any zoom level below maximum, **When** he presses the + key (or = key without shift), **Then** the canvas zooms in by one increment (approximately 10-20%)
2. **Given** David is viewing the canvas at any zoom level above minimum, **When** he presses the - key (or _ key without shift), **Then** the canvas zooms out by one increment (approximately 10-20%)
3. **Given** David is viewing the canvas at maximum zoom level, **When** he presses +, **Then** the zoom level remains at maximum (no error, just no further zoom)
4. **Given** David is viewing the canvas at minimum zoom level, **When** he presses -, **Then** the zoom level remains at minimum (no error, just no further zoom)
5. **Given** David is in edit mode (text input active), **When** he presses + or -, **Then** the characters are typed into the input field (shortcuts disabled during text entry)

---

### User Story 3 - Pan Canvas with Arrow Keys (Priority: P3)

David wants to explore different areas of his relationship map without using the mouse. Arrow keys provide a natural way to move the viewport in the expected direction.

**Why this priority**: Panning is less frequent than zooming for most users, but essential for keyboard-only navigation and accessibility. This completes the basic navigation toolkit.

**Independent Test**: User can press arrow keys to pan the canvas view in the corresponding direction, with the canvas smoothly shifting to reveal adjacent areas.

**Acceptance Scenarios**:

1. **Given** David is viewing the canvas, **When** he presses the Up arrow key, **Then** the canvas view pans upward (content moves down, revealing what was above)
2. **Given** David is viewing the canvas, **When** he presses the Down arrow key, **Then** the canvas view pans downward (content moves up, revealing what was below)
3. **Given** David is viewing the canvas, **When** he presses the Left arrow key, **Then** the canvas view pans left (content moves right, revealing what was to the left)
4. **Given** David is viewing the canvas, **When** he presses the Right arrow key, **Then** the canvas view pans right (content moves left, revealing what was to the right)
5. **Given** David is in edit mode (text input active), **When** he presses arrow keys, **Then** the cursor moves within the text field (shortcuts disabled during text entry)
6. **Given** David has panned to the edge of the canvas content, **When** he presses an arrow key in that direction, **Then** the canvas continues to pan (infinite canvas, no hard boundary)

---

### User Story 4 - Delete Selected Node (Priority: P4)

Maria accidentally added a person she doesn't need on her map or wants to quickly remove someone. Pressing Delete should remove the currently focused/selected node.

**Why this priority**: Delete is a destructive action and less frequently needed than navigation. It requires a "selected" node concept which may need additional UI work. However, it significantly speeds up map refinement workflows.

**Independent Test**: User can click on a node to select it, press Delete, and observe the node being removed from the canvas.

**Acceptance Scenarios**:

1. **Given** Maria has clicked on a non-self node (node is visually selected/focused), **When** she presses the Delete key, **Then** the node is removed from the canvas
2. **Given** Maria has clicked on her own node (the central "self" node), **When** she presses the Delete key, **Then** nothing happens (self node cannot be deleted)
3. **Given** Maria has no node selected (clicked on empty canvas space), **When** she presses the Delete key, **Then** nothing happens
4. **Given** Maria is in edit mode on a node, **When** she presses Delete, **Then** the Delete key functions as backspace/delete within the text field (does not delete the node)
5. **Given** Maria deletes a node that has trust relationships, **When** the node is removed, **Then** all associated trust arrows are also removed

---

### User Story 5 - Center View on Self Node (Priority: P5)

After panning around a large map, David wants to quickly return to center his view on himself (the central reference point). Pressing Space should snap the view back to show the self node centered.

**Why this priority**: This is a convenience shortcut that becomes valuable only after panning, which is P3. It's useful but not critical for basic functionality.

**Independent Test**: User can pan away from center, press Space, and observe the canvas view smoothly animating to center on the self node.

**Acceptance Scenarios**:

1. **Given** David has panned the canvas so his self node is off-screen or near the edge, **When** he presses the Space bar, **Then** the canvas view smoothly animates to center the self node in the viewport
2. **Given** David's self node is already centered in the viewport, **When** he presses Space, **Then** the view remains unchanged (no jarring movement)
3. **Given** David is in edit mode (text input active), **When** he presses Space, **Then** a space character is typed into the input field (shortcut disabled during text entry)
4. **Given** David has zoomed in significantly, **When** he presses Space, **Then** the view centers on self node at the current zoom level (does not change zoom)

---

### Edge Cases

- What happens when multiple keys are pressed simultaneously (e.g., Shift+Arrow for faster pan)? System should handle gracefully; modifier keys may optionally enhance behavior but are not required for MVP.
- What happens when keyboard shortcuts are triggered while a modal dialog is open (e.g., trust editor)? Only Escape and Enter should work; navigation keys should be ignored.
- What happens when the user is using a screen reader or other assistive technology? Keyboard shortcuts must not interfere with standard accessibility navigation.
- What happens on non-US keyboard layouts where +/- may be in different positions? System should respond to the key codes for plus/minus regardless of layout.
- What happens when the browser has focus on a different element (e.g., the Add Person input field)? Shortcuts should only work when the canvas has focus.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST respond to Escape key to cancel/close any active edit mode or modal
- **FR-002**: System MUST respond to Enter key to confirm/save changes in active edit mode or modal
- **FR-003**: System MUST respond to + and = keys to zoom in on the canvas
- **FR-004**: System MUST respond to - key to zoom out on the canvas
- **FR-005**: System MUST respond to Arrow keys (Up, Down, Left, Right) to pan the canvas view
- **FR-006**: System MUST respond to Delete key to remove the currently selected non-self node
- **FR-007**: System MUST respond to Space bar to center the view on the self node
- **FR-008**: System MUST disable all canvas keyboard shortcuts when a text input field has focus
- **FR-009**: System MUST provide visual indication when a node is selected/focused (prerequisite for Delete functionality)
- **FR-010**: System MUST handle keyboard events only when the canvas or its children have focus
- **FR-011**: System MUST NOT interfere with standard browser keyboard shortcuts (Ctrl+C, Ctrl+V, etc.)
- **FR-012**: System MUST NOT interfere with assistive technology navigation patterns

### Key Entities

- **Keyboard Shortcut**: A mapping between a key (or key combination) and an action, with conditions for when it should be active
- **Focus State**: Tracks which element currently has keyboard focus (canvas, text input, modal, etc.)
- **Selection State**: Tracks which node (if any) is currently selected for keyboard operations like Delete

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can perform all five shortcut actions (cancel, confirm, zoom, pan, delete, center) using only the keyboard
- **SC-002**: Users can complete a full editing workflow (add person, rename, set trust, delete) without touching the mouse after initial click
- **SC-003**: Keyboard shortcuts respond within 100ms of keypress (perceptually instant)
- **SC-004**: 100% of keyboard shortcuts work correctly on Chrome, Firefox, Safari, and Edge browsers
- **SC-005**: Keyboard shortcuts do not interfere with screen reader navigation (tested with NVDA or VoiceOver)
- **SC-006**: Power users report increased efficiency when using keyboard shortcuts during coaching sessions

### Assumptions

- Users are using standard QWERTY keyboards (international layouts will work but +/- positions may vary)
- The existing node hover/click states are sufficient for indicating selection (no new selection UI needed beyond existing hover styling)
- Zoom increment of 10-20% per keypress is appropriate (matches standard application behavior)
- Pan increment of 50-100 pixels per keypress is appropriate for smooth navigation
- The Space key centering action should animate smoothly (300-500ms transition) rather than snap instantly
