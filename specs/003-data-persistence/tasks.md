# Tasks: Data Persistence

**Input**: Design documents from `/specs/003-data-persistence/`
**Prerequisites**: plan.md (complete), spec.md (complete), research.md (complete), data-model.md (complete), quickstart.md (complete)

**Tests**: Not required per specification. Manual testing via quickstart.md scenarios.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app frontend**: `app/client/src/`
- Hooks: `app/client/src/hooks/`
- Services: `app/client/src/services/`
- Types: `app/client/src/types/`
- Components: `app/client/src/components/`

---

## Phase 1: Setup

**Purpose**: Create types and service abstractions

- [ ] T001 [P] Create PersistedCanvasState type in app/client/src/types/storage.ts
- [ ] T002 [P] Export storage types from app/client/src/types/index.ts
- [ ] T003 [P] Create services directory: mkdir -p app/client/src/services

**Checkpoint**: Type infrastructure ready

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core storage service that ALL user stories depend on

**CRITICAL**: No user story work can begin until this phase is complete

- [ ] T004 Create StorageService with isAvailable() method in app/client/src/services/storage.ts
- [ ] T005 Add load() method to StorageService with validation and error recovery in app/client/src/services/storage.ts
- [ ] T006 Add save() method to StorageService with error handling in app/client/src/services/storage.ts
- [ ] T007 Add clear() method to StorageService in app/client/src/services/storage.ts
- [ ] T008 Add createDefaultState() helper to StorageService in app/client/src/services/storage.ts

**Checkpoint**: StorageService fully implemented, ready for hook integration

---

## Phase 3: User Story 1+2 - Auto-Save and Restore (Priority: P1) MVP

**Goal**: Canvas state automatically saves on changes and restores on load

**Independent Test**: Add nodes, set trust scores, refresh page - map should be fully restored

### Implementation for User Stories 1 and 2

- [ ] T009 [US1+2] Modify useCanvasState to accept optional initial state parameter in app/client/src/hooks/useCanvasState.ts
- [ ] T010 [US1+2] Load initial state from StorageService in useCanvasState in app/client/src/hooks/useCanvasState.ts
- [ ] T011 [US1+2] Add debounced save effect that triggers on state.nodes and state.viewTransform changes in app/client/src/hooks/useCanvasState.ts
- [ ] T012 [US1+2] Implement DEBOUNCE_MS constant (500ms) in app/client/src/hooks/useCanvasState.ts
- [ ] T013 [US1+2] Verify save only includes nodes and viewTransform (not editingNodeId/selectedNodeId) in app/client/src/hooks/useCanvasState.ts
- [ ] T014 [US1+2] Test Scenario 5 from quickstart.md: Restore on Refresh

**Checkpoint**: Auto-save and restore working. This is the MVP.

---

## Phase 4: User Story 3 - Reset Map (Priority: P2)

**Goal**: User can clear their map and start fresh with confirmation

**Independent Test**: Create map, click reset, confirm, verify only "You" node remains

### Implementation for User Story 3

- [ ] T015 [US3] Add resetCanvas action to useCanvasState that resets to default state and clears storage in app/client/src/hooks/useCanvasState.ts
- [ ] T016 [US3] Create ResetMapButton component with window.confirm() dialog in app/client/src/components/Canvas/ResetMapButton.tsx
- [ ] T017 [US3] Create ResetMapButton.module.css with button styles in app/client/src/components/Canvas/ResetMapButton.module.css
- [ ] T018 [US3] Integrate ResetMapButton into Canvas component topControls in app/client/src/components/Canvas/Canvas.tsx
- [ ] T019 [US3] Test Scenario 9+10 from quickstart.md: Reset flow with confirm/cancel

**Checkpoint**: Reset feature complete with confirmation protection

---

## Phase 5: Polish & Edge Cases

**Purpose**: Error handling, graceful degradation, validation

- [ ] T020 [P] Add console.warn logging for load errors in StorageService in app/client/src/services/storage.ts
- [ ] T021 [P] Add console.warn logging for save errors in StorageService in app/client/src/services/storage.ts
- [ ] T022 Test Scenario 7 from quickstart.md: Fresh browser with no data
- [ ] T023 Test Scenario 8 from quickstart.md: Corrupted data recovery
- [ ] T024 Verify app works when localStorage is disabled (graceful degradation)
- [ ] T025 Run all 10 quickstart.md test scenarios and document results

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 - BLOCKS all user stories
- **US1+2 (Phase 3)**: Depends on Phase 2 completion
- **US3 (Phase 4)**: Depends on Phase 3 completion (uses resetCanvas from same hook)
- **Polish (Phase 5)**: Depends on Phases 3 and 4 completion

### Within Each Phase

- Types before services
- Services before hooks
- Hooks before components
- Implementation before testing

### Parallel Opportunities

- T001, T002, T003 can run in parallel (different files)
- T020, T021 can run in parallel (different parts of same file, no conflicts)

---

## Implementation Strategy

### MVP First (US1+2 Only)

1. Complete Phase 1: Setup (T001-T003)
2. Complete Phase 2: Foundational (T004-T008)
3. Complete Phase 3: User Stories 1+2 (T009-T014)
4. **STOP and VALIDATE**: Test save/restore independently
5. Deploy/demo if ready - persistence works!

### Full Feature

1. Complete MVP (Phases 1-3)
2. Add Phase 4: User Story 3 - Reset (T015-T019)
3. Complete Phase 5: Polish (T020-T025)

---

## Summary

| Phase | Tasks | User Story | Description |
|-------|-------|------------|-------------|
| 1 | T001-T003 | Setup | Types, directory structure |
| 2 | T004-T008 | Foundation | StorageService implementation |
| 3 | T009-T014 | US1+US2 (P1) | Auto-save and restore MVP |
| 4 | T015-T019 | US3 (P2) | Reset map feature |
| 5 | T020-T025 | Polish | Error handling, testing |

**Total Tasks**: 25
**MVP Scope**: Phases 1-3 (14 tasks) - Auto-save and restore functionality

---

## Notes

- StorageService is a pure function module (no class), keeps things simple
- Debounce in useEffect, not external library
- window.confirm() for reset dialog - simple and native
- All error handling logs warnings but doesn't crash app
- Manual testing per quickstart.md scenarios
