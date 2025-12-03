# Feature Specification: Relationship Canvas

**Feature Branch**: `001-relationship-canvas`
**Created**: 2025-12-03
**Status**: Draft
**Input**: User description: "Create a dynamically editable relationship canvas where individual employees can map their workplace relationships by adding people as nodes, positioning them on a canvas, with their own node visually distinct as the central reference point."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Map My Core Team (Priority: P1)

Maria is an employee at a client organization of ProActive ReSolutions. She's been working with a ProActive Coach who asked her to create a visual map of her key workplace relationships. Maria needs to quickly identify and position the people she interacts with regularly so she can have a visual representation to discuss during her next coaching session.

**Why this priority**: This is the foundational capability. Without the ability to create and see a basic relationship map, no other features have value. This represents the minimum viable product that delivers immediate value - a visual representation of workplace relationships.

**Independent Test**: Maria can open the application, add 5-10 people from her workplace, drag them to different positions on the canvas, see herself in the center, and view the resulting map. She can share her screen with her coach to discuss the visual layout without needing any persistence or export features.

**Acceptance Scenarios**:

1. **Given** Maria opens the relationship canvas application, **When** she views the canvas for the first time, **Then** she sees her own node already placed at the center of the canvas, visually distinct from other nodes
2. **Given** Maria wants to add her manager Sarah to the map, **When** she clicks "Add Person" and enters "Sarah", **Then** a new node labeled "Sarah" appears on the canvas
3. **Given** Maria has added several people to her canvas, **When** she clicks and drags a node to a new position, **Then** the node moves smoothly to follow her cursor and stays in the new position when released
4. **Given** Maria has positioned people around her own node, **When** she views the canvas, **Then** she can clearly distinguish her own node from others through visual styling (different color, size, or border)
5. **Given** Maria has created a map with 8 people positioned around her, **When** she zooms out or adjusts her view, **Then** she can see all nodes and their spatial relationships clearly

---

### User Story 2 - Edit and Refine My Map (Priority: P2)

After creating an initial map, Maria realizes she forgot to add two important colleagues and wants to remove someone who recently left the company. She also wants to reposition people to better reflect how close or distant these relationships feel to her emotionally.

**Why this priority**: The ability to edit and refine is essential for the map to be useful in ongoing coaching conversations. Real-world relationships change, and the map needs to be a living document that can evolve during a single session.

**Independent Test**: Maria can add new nodes to an existing map, remove nodes she no longer needs, rename nodes if she made a typo, and continuously reposition nodes until the spatial arrangement feels accurate to her experience.

**Acceptance Scenarios**:

1. **Given** Maria has an existing relationship map with 8 people, **When** she clicks "Add Person" and enters "James", **Then** a new node for James appears on the canvas and she can position it anywhere
2. **Given** Maria notices she misspelled a colleague's name as "Jon" instead of "John", **When** she clicks on the node and selects "Edit" or clicks a rename option, **Then** she can update the name and the node label reflects the change
3. **Given** Maria wants to remove a node for someone who left the company, **When** she clicks on the node and selects "Remove" or presses Delete, **Then** the node disappears from the canvas
4. **Given** Maria is refining her map during a coaching session, **When** she drags multiple nodes to new positions over several minutes, **Then** each node stays where she placed it and doesn't drift or reset

---

### User Story 3 - Navigate Large Relationship Networks (Priority: P3)

David works in a large organization and interacts with 20+ people regularly. He needs to map all these relationships but finds that with so many nodes, the canvas becomes cluttered and difficult to navigate.

**Why this priority**: While the MVP focuses on typical team sizes (5-15 people), some users will have larger networks. This ensures the tool remains usable as relationship maps grow in complexity.

**Independent Test**: David can add 20+ people to his canvas, use pan and zoom controls to navigate the larger map, and still clearly see individual nodes and read their names even when the canvas is zoomed out to show the full network.

**Acceptance Scenarios**:

1. **Given** David has added 20 people to his canvas, **When** he uses mouse scroll or pinch-to-zoom gestures, **Then** the canvas zooms in and out smoothly while keeping node labels readable
2. **Given** David has zoomed in to focus on one section of his map, **When** he clicks and drags on empty canvas space, **Then** the view pans to show other areas of his relationship map
3. **Given** David has positioned people across a large canvas area, **When** he zooms out to see the full map, **Then** all nodes remain visible and their spatial relationships are preserved
4. **Given** David has many overlapping nodes in one area, **When** he hovers over or clicks a node, **Then** the selected node is visually highlighted so he can distinguish it from surrounding nodes

---

### Edge Cases

- What happens when a user tries to drag their own central node? (Should it be locked in place or movable?)
- What happens when two nodes are positioned directly on top of each other? (Should there be collision detection or stacking indicators?)
- What happens when a user adds a person with an extremely long name (30+ characters)? (Should names truncate with ellipsis?)
- What happens if a user tries to add 100+ people to a single canvas? (Should there be a practical limit with a warning?)
- What happens when the user's browser window is very small or very large? (Should the canvas scale responsively?)
- What happens if a user accidentally closes their browser tab with an unsaved map? (Since no persistence in MVP, they lose their work - should there be a warning?)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a blank canvas on initial load with the user's own node pre-positioned at the center
- **FR-002**: User's own node MUST be visually distinct through styling (different color, size, border, or icon) to serve as the reference point
- **FR-003**: Users MUST be able to add new person nodes by providing a name (text input with "Add Person" action)
- **FR-004**: Users MUST be able to drag any person node (except potentially their own) to any position on the canvas using click-and-drag interaction
- **FR-005**: Nodes MUST remain in their positioned location after being dragged until explicitly moved again
- **FR-006**: Users MUST be able to rename any person node after creation
- **FR-007**: Users MUST be able to remove any person node (except their own) from the canvas
- **FR-008**: System MUST support adding at least 25 person nodes to a single canvas without performance degradation
- **FR-009**: Users MUST be able to zoom in and out on the canvas to view different levels of detail
- **FR-010**: Users MUST be able to pan across the canvas to view areas outside the current viewport
- **FR-011**: Node labels (person names) MUST be clearly readable at default zoom level
- **FR-012**: System MUST provide visual feedback during drag operations (e.g., cursor change, node follows mouse)
- **FR-013**: Canvas MUST be responsive to different screen sizes (desktop, laptop, tablet)
- **FR-014**: System MUST handle node name lengths up to 50 characters gracefully (truncation if needed)
- **FR-015**: Users MUST receive clear visual feedback when hovering over interactive elements (nodes, buttons)

### Key Entities

- **Person Node**: Represents an individual in the user's workplace relationship network
  - Attributes: name (text, required), position (x/y coordinates), visual styling
  - The user's own node is a special case with distinct styling and centered default position

- **Canvas**: The visual workspace where nodes are positioned
  - Attributes: zoom level, pan offset, dimensions
  - Contains one user node (self) and zero or more person nodes (others)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can create a basic relationship map with 5-10 people in under 3 minutes from opening the application
- **SC-002**: Users can reposition a node to a new location in under 2 seconds (click, drag, release)
- **SC-003**: System maintains smooth interaction performance during node dragging operations with up to 25 nodes
- **SC-004**: Users can successfully distinguish their own node from other nodes within 1 second of viewing the canvas
- **SC-005**: 90% of users can complete basic map creation tasks (add person, move person, remove person) without external help or documentation
- **SC-006**: Canvas remains fully functional and responsive on screen sizes from 768px width (tablet) to 2560px width (large desktop)
- **SC-007**: Users can zoom from 50% to 200% of default view without losing ability to read node labels
- **SC-008**: During coaching sessions, users can make real-time edits to their map while screen sharing without noticeable lag

### Assumptions

- Users will access the application via modern web browser (Chrome, Firefox, Safari, Edge - last 2 versions)
- Users have basic computer skills (can use mouse/trackpad for drag-and-drop interactions)
- Initial canvas size is sufficient for typical team sizes (5-15 people) without requiring immediate zoom/pan
- Users will be working with this tool during live coaching sessions, so real-time responsiveness is critical
- No data persistence is required for MVP - users understand the session is temporary
- Users will input names in the language/script of their workplace (system should support Unicode)
- Typical session length is 30-60 minutes (a coaching session duration)
- Users may want to capture their work via screenshot or screen share, but don't need built-in export for MVP
