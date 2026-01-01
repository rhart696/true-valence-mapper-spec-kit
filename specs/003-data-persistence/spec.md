# Feature Specification: Data Persistence

**Feature Branch**: `003-data-persistence`
**Created**: 2025-12-09
**Status**: Draft
**Input**: User description: "Add local storage persistence so relationship maps survive browser refreshes. The app should automatically save canvas state including all nodes, positions, trust scores, and view transform. When the user returns, their map should be restored exactly as they left it. Include a clear/reset option to start fresh."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Automatic Save on Changes (Priority: P1)

Maria creates a relationship map during her coaching session, adding 8 people and positioning them around her central node. As she works, every change she makes (adding nodes, moving them, setting trust scores) is automatically saved. She doesn't need to click a "Save" button or worry about losing her work.

**Why this priority**: This is the foundational persistence capability. Without automatic saving, all other persistence features have no data to work with. This must work reliably before any other persistence features can be tested.

**Independent Test**: Add several nodes, drag them around, set some trust scores, then check browser localStorage to confirm data is being saved after each change.

**Acceptance Scenarios**:

1. **Given** Maria has the canvas open with her initial "You" node, **When** she adds a new person "Sarah", **Then** the canvas state including the new node is automatically saved to localStorage within 1 second
2. **Given** Maria has added 5 people to her canvas, **When** she drags "John" to a new position, **Then** the new position is automatically saved without any manual action
3. **Given** Maria clicks on a person node and sets a trust score, **When** she saves the trust score in the modal, **Then** the trust score is persisted to localStorage immediately
4. **Given** Maria zooms in or pans around the canvas, **When** the view transform changes, **Then** the current zoom level and pan position are saved
5. **Given** Maria is rapidly making changes (dragging multiple nodes), **When** changes happen quickly, **Then** the system debounces saves to prevent performance issues (max 1 save per 500ms)

---

### User Story 2 - Restore Map on Return (Priority: P1)

Maria closes her browser tab after her coaching session. The next day, she opens the relationship canvas again to continue working on her map. Her entire map is restored exactly as she left it - all people, their positions, trust scores, and even her current zoom level.

**Why this priority**: This is the user-facing value of persistence. If data saves but doesn't restore, the feature is useless. This is equally critical as saving and together they form the MVP.

**Independent Test**: Create a map with several nodes and trust scores, close the browser tab completely, reopen the app, and verify the map is fully restored.

**Acceptance Scenarios**:

1. **Given** Maria previously created a map with 8 people positioned around her central node, **When** she returns to the canvas after closing and reopening the browser, **Then** all 8 nodes are restored in their exact positions
2. **Given** Maria had set trust scores on 5 relationships, **When** she returns to the canvas, **Then** all trust scores are restored and trust arrows display correctly
3. **Given** Maria was zoomed to 150% and panned to the right side of her map, **When** she returns to the canvas, **Then** the zoom level is 150% and the view is panned to the same position
4. **Given** this is a completely fresh browser with no prior data, **When** Maria opens the canvas for the first time, **Then** she sees the default state with just her "You" node at center
5. **Given** the stored data format is corrupted or invalid, **When** the app tries to load, **Then** it gracefully falls back to the default state and logs an error (doesn't crash)

---

### User Story 3 - Clear/Reset Map (Priority: P2)

Maria decides she wants to start completely fresh with a new relationship map. She clicks a "Clear Map" or "Reset" button, confirms her intention, and the canvas resets to its initial state with just her "You" node in the center.

**Why this priority**: This enables users to start over without clearing browser data manually. Important for usability but not critical to core persistence functionality.

**Independent Test**: Create a map with nodes, click reset, confirm, verify canvas is cleared and localStorage is updated to reflect default state.

**Acceptance Scenarios**:

1. **Given** Maria has a map with 10 people and various trust scores, **When** she clicks the "Reset Map" button, **Then** a confirmation dialog appears asking "Are you sure you want to clear your map? This cannot be undone."
2. **Given** the confirmation dialog is showing, **When** Maria clicks "Cancel" or presses Escape, **Then** the dialog closes and her map is unchanged
3. **Given** the confirmation dialog is showing, **When** Maria clicks "Confirm" or presses Enter, **Then** the canvas resets to show only her "You" node at center, and all other data is cleared
4. **Given** Maria has reset her map, **When** she refreshes the page, **Then** the reset state persists (shows only "You" node, not the old data)

---

### Edge Cases

- What happens if localStorage is disabled or full? (Should gracefully degrade - app works but doesn't persist)
- What happens if the stored data schema changes in a future version? (Should handle version migration or reset)
- What happens if two browser tabs have the same map open? (Last-write-wins is acceptable for MVP)
- What happens with extremely large maps (100+ nodes)? (Should still save efficiently; localStorage has ~5MB limit)
- What happens if the browser is closed mid-save? (Data may be lost; save should be atomic)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST automatically save canvas state to browser localStorage whenever nodes, positions, trust scores, or view transform change
- **FR-002**: System MUST restore saved canvas state when the application loads
- **FR-003**: System MUST debounce save operations to maximum 1 save per 500ms to prevent performance issues
- **FR-004**: System MUST gracefully fall back to default state if stored data is missing, corrupted, or incompatible
- **FR-005**: System MUST provide a "Reset Map" UI element that clears all data and restores default state
- **FR-006**: System MUST show confirmation dialog before resetting to prevent accidental data loss
- **FR-007**: System MUST include a version identifier in stored data to enable future schema migrations
- **FR-008**: System MUST NOT crash or become unusable if localStorage is disabled or unavailable
- **FR-009**: System MUST persist the complete node state including: id, name, position (x, y), isSelf, trustScore (if present)
- **FR-010**: System MUST persist the complete view transform including: zoom, panX, panY

### Key Entities

- **PersistedCanvasState**: Serializable representation of canvas state for localStorage
  - Attributes: version (string), nodes (array of PersonNode), viewTransform (ViewTransform object), savedAt (ISO timestamp)
  - Version enables future schema migrations

- **StorageService**: Service abstraction for localStorage operations
  - Methods: save(state), load(), clear(), isAvailable()
  - Handles serialization/deserialization and error recovery

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can close and reopen the browser and find their map exactly as they left it (100% data fidelity)
- **SC-002**: Save operations complete within 100ms and do not cause visible UI lag
- **SC-003**: App loads saved state within 500ms of initial render
- **SC-004**: App remains fully functional if localStorage is disabled (graceful degradation)
- **SC-005**: Reset confirmation prevents accidental data loss (requires explicit user confirmation)
