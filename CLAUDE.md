# AGENTS.md - True Valence Mapper (Spec-Kit Edition)

> **📚 GOVERNANCE DOCUMENTATION**
> - This file: Global governance (applies to ALL editions)
> - [AGENTS.local.md](./AGENTS.local.md): Edition-specific governance (if present)
> - [Full Governance Workflow](https://github.com/rhart696/true-valence-mapper/blob/main/docs/GOVERNANCE-WORKFLOW.md)

## STOP - READ THIS FIRST

**DO NOT install dependencies, add packages, or make architectural changes without explicit human approval.**

This repository is ONE EDITION of a **multi-repository architecture** with 7 coordinated editions. Actions you take here affect the entire system.

### Before ANY of these actions, STOP and ask the human:
- Installing npm packages (`npm install <package>`)
- Adding new dependencies to package.json
- Creating new configuration files
- Changing build tooling or project structure
- Any action that modifies the dependency tree

### Why this matters:
- Dependencies may already exist in the parent repo's `shared/` directory
- Other editions may have solved the same problem differently
- Uncoordinated changes cause sync conflicts across 7 repositories

### Edition-Specific Guidance
If `AGENTS.local.md` exists in this repository, **read it after this file**. It contains edition-specific approvals, exceptions, and context that override or extend this global governance.

## Project Overview

React 18 + TypeScript visualization tool for relationship pattern mapping.

| Key | Value |
|-----|-------|
| Parent Repository | https://github.com/rhart696/true-valence-mapper |
| This Edition | Spec-Kit |
| Edition Focus | GitHub Spec-Kit integration, specification-driven development with AI agent guidance |
| Auto-Sync | Changes to main trigger parent repo submodule update |

**To understand the full architecture before making changes:**
1. Clone parent repo: `git clone --recursive git@github.com:rhart696/true-valence-mapper.git`
2. Check `shared/` directory for existing resources
3. Review [GOVERNANCE.md](https://github.com/rhart696/true-valence-mapper/blob/main/docs/GOVERNANCE.md)
4. Review [REPOSITORY-STRUCTURE.md](https://github.com/rhart696/true-valence-mapper/blob/main/docs/REPOSITORY-STRUCTURE.md)

## Commands (for existing dependencies only)

```bash
npm install          # Install dependencies
npm run dev          # Development server (usually port 5173)
npm run build        # Production build
npm test             # Run test suite
npm run lint         # Lint codebase
```

## Project Structure

```
src/
├── components/      # React components
├── hooks/           # Custom React hooks
├── utils/           # Utility functions
├── types/           # TypeScript type definitions
└── styles/          # CSS/styling
public/              # Static assets
docs/                # Documentation
```

## Code Style

- TypeScript strict mode enabled
- Functional components with hooks (no class components)
- Named exports preferred over default exports
- Tailwind CSS for styling (where applicable)

Example component pattern:
```typescript
import { useState } from 'react';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export function ExampleComponent({ value, onChange }: Props) {
  const [localState, setLocalState] = useState('');

  return (
    <div className="container">
      {/* Component content */}
    </div>
  );
}
```

## Testing

- Jest + React Testing Library
- Test files: `*.test.ts` or `*.test.tsx`
- Run specific test: `npm test -- --testPathPattern="ComponentName"`

## Git Workflow

- Branch from `main` for features
- Commit format: `type: description` (feat, fix, docs, chore, refactor, test)
- Push to `main` triggers auto-sync to parent repository
- PRs require passing CI checks

## Boundaries

### Always Do
- Check parent repo's `shared/` before adding new dependencies
- Follow existing patterns in the codebase
- Run tests before committing
- Keep commits atomic and well-described

### Ask First
- Adding new npm dependencies (check if exists in shared or other editions)
- Changing build configuration (vite.config, tsconfig, etc.)
- Modifying CI/CD workflows
- Architectural changes affecting multiple files

### Never Do
- Commit secrets, API keys, or credentials
- Treat this as a standalone project (it's part of multi-edition architecture)
- Force push to main branch
- Skip the parent repo context for major decisions
- Duplicate functionality that exists in parent's `shared/` directory

## Related Resources

- [Parent Repo README](https://github.com/rhart696/true-valence-mapper/blob/main/README.md)
- [Governance Model](https://github.com/rhart696/true-valence-mapper/blob/main/docs/GOVERNANCE.md)
- [Sync Reference Models](https://github.com/rhart696/true-valence-mapper/blob/main/docs/SYNC-REFERENCE-MODELS.md)
- [Architecture Documentation](https://github.com/rhart696/true-valence-mapper/blob/main/docs/ARCHITECTURE.md)

---

*This file is auto-generated from parent repo template. Manual edits may be overwritten.*
*Template version: 1.2.0*
*Last sync: 2025-12-02*

## Active Technologies
- TypeScript 5.x with React 19.2.0 + React (hooks, events), existing useCanvasState hook, existing useDragAndDrop hook (002-keyboard-shortcuts)
- N/A (all state in existing React context) (002-keyboard-shortcuts)

## Recent Changes
- 002-keyboard-shortcuts: Added TypeScript 5.x with React 19.2.0 + React (hooks, events), existing useCanvasState hook, existing useDragAndDrop hook
