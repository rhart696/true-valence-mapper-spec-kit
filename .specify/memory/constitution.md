<!--
SYNC IMPACT REPORT
==================
Version: 0.0.0 → 1.0.0 (MAJOR - Initial ratification)
Date: 2025-12-03

Changed Principles:
- [NEW] I. Specification-First Development
- [NEW] II. User Story Driven
- [NEW] III. Test-Conscious (Contextual)
- [NEW] IV. Modularity & Composability
- [NEW] V. Type Safety & Contracts
- [NEW] VI. Incremental Delivery

Added Sections:
- Design Constraints
- Development Workflow
- Governance

Templates Requiring Updates:
- ✅ .specify/templates/plan-template.md - Constitution Check gate already present
- ✅ .specify/templates/spec-template.md - User story prioritization aligns with Principle II
- ✅ .specify/templates/tasks-template.md - Task organization by user story aligns with Principles II & VI
- ✅ .specify/templates/commands/*.md - Generic, agent-agnostic guidance confirmed

Follow-up TODOs:
- None - all placeholders filled

Notes:
- Initial ratification establishes baseline governance for Spec-Kit edition
- Principles are technology-agnostic; specific tools chosen per feature requirements
- Test principle is contextual (not mandatory) per Spec-Kit's optional test approach
- Current Implementation section documents existing code, not prescriptive requirements
-->

# True Valence Mapper (Spec-Kit Edition) Constitution

## Core Principles

### I. Specification-First Development

Every feature MUST begin with a specification document created via `/speckit.specify` command. Specifications MUST be completed and reviewed before planning or implementation begins. No feature work may proceed without a corresponding specification in `specs/[###-feature-name]/spec.md`.

**Rationale**: Specification-driven development ensures clear requirements, reduces rework, and provides context for AI coding assistants. This principle is foundational to the Spec-Kit methodology and non-negotiable.

### II. User Story Driven

All features MUST be broken down into independently testable user stories with explicit priorities (P1, P2, P3...). Each user story MUST be:
- Implementable independently
- Testable independently
- Deployable as a standalone MVP increment
- Ordered by business value

**Rationale**: Independent user stories enable incremental delivery, reduce risk, and allow parallel development. Priority ordering ensures highest-value work is completed first.

### III. Test-Conscious (Contextual)

Tests are OPTIONAL unless explicitly requested in the feature specification. When tests are required:
- Tests MUST be written before implementation (Red-Green-Refactor)
- Contract tests MUST be provided for all public APIs/endpoints
- Integration tests MUST cover critical user journeys
- Tests MUST fail before implementation begins

**Rationale**: Spec-Kit allows flexibility in testing approach. Test-First discipline applies only when testing is explicitly scoped, avoiding overhead while maintaining quality when needed.

### IV. Modularity & Composability

All code MUST be organized into self-contained, independently reusable modules. Modules MUST:
- Have clearly defined interfaces/contracts
- Maintain single responsibility
- Be independently testable
- Document their purpose and dependencies

**Rationale**: Modular design improves maintainability, enables reuse across the multi-edition architecture, simplifies testing, and allows features to choose appropriate implementation patterns.

### V. Type Safety & Contracts

All public interfaces, APIs, and contracts MUST have explicit type definitions or schemas. Implementation language and type system chosen per feature requirements, but type information MUST be:
- Explicit, not inferred
- Documented at boundaries
- Validated at runtime where appropriate
- Justification required for type assertions or bypasses

**Rationale**: Type safety prevents runtime errors, documents intent, enables better tooling support, and reduces cognitive load when working with AI coding assistants.

### VI. Incremental Delivery

Features MUST be structured to allow incremental delivery of user stories. Each completed user story MUST deliver measurable user value and be deployable independently without breaking existing functionality.

**Rationale**: Incremental delivery reduces risk, enables faster feedback cycles, and allows course correction based on real usage. This aligns with Spec-Kit's MVP-first approach.

## Design Constraints

### Technology Selection Criteria

When selecting tools, languages, or frameworks for a feature, evaluate against these criteria:
1. **Fitness for purpose** - Does it solve the specific problem effectively?
2. **Type safety support** - Can public contracts be explicitly typed?
3. **Modularity support** - Does it enable self-contained components/modules?
4. **Testing support** - Can components be tested independently?
5. **Team familiarity** - Is expertise available or easily acquired?
6. **Multi-edition impact** - Does it create conflicts with other editions?

Technology choices are made during the `/speckit.plan` phase and documented in the implementation plan.

### Current Implementation

The `app/` directory contains an existing React 18 + TypeScript frontend implementation. When working with this codebase:
- Follow existing patterns unless feature requirements necessitate change
- Maintain type safety (TypeScript strict mode)
- Keep component modularity
- Coordinate dependency changes per multi-edition workflow

**Note**: This documents what exists, not what must be used for new features. New features should evaluate tools based on requirements.

### Multi-Edition Coordination

This edition is part of a multi-repository architecture with 7 coordinated editions. Before adding dependencies or making architectural changes:
1. Check parent repository's `shared/` directory for existing resources
2. Verify no other edition has solved the same problem
3. Consult [AGENTS.md](../../AGENTS.md) and [AGENTS.local.md](../../AGENTS.local.md) for edition-specific guidance
4. Obtain explicit human approval for dependency changes

**Rationale**: Uncoordinated changes cause sync conflicts across editions and duplicate functionality. Central coordination prevents technical debt.

### Performance & Quality Expectations

Features should target reasonable performance goals based on their domain:
- User-facing web interfaces: <3s initial load, <5s interactive on 3G
- CLI tools: <100ms for simple operations, progress indicators for long operations
- APIs: Document expected throughput and latency targets
- Define metrics during planning phase, not prescribed globally

## Development Workflow

### Spec-Kit Command Sequence

Features MUST follow this workflow in order:

1. **`/speckit.constitution`** - Update constitution (as needed)
2. **`/speckit.specify`** - Create feature specification with user stories
3. **`/speckit.plan`** - Generate implementation plan (research, architecture, contracts)
4. **`/speckit.tasks`** - Break down into atomic tasks organized by user story
5. **`/speckit.implement`** - Execute tasks following plan

Skipping steps or proceeding out of order violates Principle I (Specification-First Development).

### Branch & Commit Strategy

- Branch naming: `###-feature-name` where `###` is sequential feature number
- Commit format: `type(scope): description` (feat, fix, docs, chore, refactor, test)
- Commits MUST be atomic and reference relevant spec/task IDs
- All changes pushed to `main` trigger auto-sync to parent repository

### Code Review Requirements

- All PRs MUST reference the originating specification
- All PRs MUST pass automated quality checks (linting, type checking, etc.)
- Breaking changes MUST be documented in commit message and PR description
- Tests (if present) MUST pass before merge
- Constitution compliance MUST be verified

## Governance

### Amendment Procedure

1. Propose amendment with clear rationale and impact analysis
2. Identify affected templates, commands, and existing specs
3. Version bump according to semantic versioning:
   - **MAJOR**: Backward incompatible principle removals/redefinitions
   - **MINOR**: New principles or materially expanded guidance
   - **PATCH**: Clarifications, wording fixes, non-semantic refinements
4. Update `LAST_AMENDED_DATE` to amendment date
5. Propagate changes to all dependent templates and documentation
6. Document migration path for active specifications

### Compliance Review

- Constitution MUST be checked at "Constitution Check" gate in implementation plans
- Violations MUST be explicitly justified in Complexity Tracking section of plan
- Simpler alternatives MUST be documented when requesting exception
- Recurring violations indicate need for constitutional amendment or clarification

### Runtime Guidance

For day-to-day development guidance beyond governance rules, consult:
- [AGENTS.md](../../AGENTS.md) - Global multi-edition governance
- [AGENTS.local.md](../../AGENTS.local.md) - Edition-specific approvals and context
- `.specify/templates/commands/*.md` - Spec-Kit command workflows

**Version**: 1.0.0 | **Ratified**: 2025-12-03 | **Last Amended**: 2025-12-03
