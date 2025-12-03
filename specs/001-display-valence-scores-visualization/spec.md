# Feature Specification: Valence Score Visualization

**Feature Branch**: `001-display-valence-scores-visualization`
**Created**: 2025-12-03
**Status**: Draft
**Input**: User description: "Display valence scores in a visualization"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Relationship Health at a Glance (Priority: P1)

As a coach, I want to see a visual representation of my client's relationship valences so I can quickly identify which relationships need attention.

**Why this priority**: This is the core value proposition - making invisible relationship dynamics visible. Without visualization, the data is just numbers.

**Independent Test**: Navigate to relationship map view, verify colored nodes appear with valence-based coloring (-5 to +5 scale mapped to red-yellow-green spectrum).

**Acceptance Scenarios**:

1. **Given** a client has rated 5 relationships, **When** the coach views the relationship map, **Then** all 5 relationships display as colored nodes with composite valence scores visible
2. **Given** a relationship has composite score of -3, **When** viewing the map, **Then** that node displays in warm/red tones indicating attention needed
3. **Given** a relationship has composite score of +4, **When** viewing the map, **Then** that node displays in cool/green tones indicating healthy relationship

---

### User Story 2 - Drill Down into Valence Dimensions (Priority: P2)

As a coach, I want to click on a relationship node to see the breakdown of the 5 valence dimensions so I can identify specific areas for improvement.

**Why this priority**: After seeing the overview, coaches need to understand WHY a relationship scores the way it does.

**Independent Test**: Click any relationship node, verify popup/panel shows all 5 dimensions (trust, communication, support, respect, alignment) with individual scores.

**Acceptance Scenarios**:

1. **Given** a relationship node is displayed, **When** the coach clicks it, **Then** a detail panel shows the 5 valence dimensions with scores
2. **Given** the detail panel is open, **When** viewing dimension scores, **Then** each dimension displays its -5 to +5 score with visual indicator

---

### Edge Cases

- What happens when a relationship has no valence data yet? (Display as gray/neutral with "Not rated" label)
- How does system handle partial valence data (only 3 of 5 dimensions rated)? (Calculate composite from available dimensions, indicate incomplete data)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display relationship nodes colored by composite valence score
- **FR-002**: System MUST calculate composite score as average of 5 valence dimensions (trust_level, communication_quality, mutual_support, professional_respect, goal_alignment)
- **FR-003**: System MUST map valence scores (-5 to +5) to color gradient (red through yellow to green)
- **FR-004**: Users MUST be able to click a node to view dimension breakdown
- **FR-005**: System MUST display valence values as integers between -5 and +5 per specs/relationships/valence.yml

### Key Entities

- **Relationship Node**: A person in the client's network (see specs/entities/relationship_node.yml)
- **Valence**: The scored relationship quality across 5 dimensions (see specs/relationships/valence.yml)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Coaches can identify lowest-scored relationships within 5 seconds of viewing the map
- **SC-002**: Valence colors correctly reflect score ranges (red: -5 to -2, yellow: -1 to +1, green: +2 to +5)
- **SC-003**: Dimension breakdown loads within 200ms of node click
- **SC-004**: All 5 valence dimensions from spec are displayed with correct labels
