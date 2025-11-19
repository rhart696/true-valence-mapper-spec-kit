# True Valence Relationship Mapper (Spec-Kit Edition)

**Short name:** True Valence Mapper
**Edition type:** Methodology/Tooling Integration
**Status:** 🚧 In Development

## Edition Focus

This edition integrates [GitHub Spec-Kit](https://github.com/github/spec-kit) for specification-driven development with AI coding assistants.

## About Spec-Kit

**Spec-Kit** is GitHub's framework for creating and managing specifications that guide AI coding assistants through complex software development tasks.

### Key Features
- **Specification-Driven Development**: Write specs that AI agents can follow
- **AI Agent Integration**: Works with Claude Code, GitHub Copilot, Gemini, Cursor, and others
- **Quality Validation**: Built-in checking and validation of specifications
- **Template System**: Reusable specification patterns

## Installation

### Prerequisites
- Python 3.11 or later
- Git
- uv package manager (recommended)

### Install Spec-Kit

**Persistent Installation (Recommended):**
```bash
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git
```

**One-Time Usage:**
```bash
uvx --from git+https://github.com/github/spec-kit.git specify init <PROJECT_NAME>
```

### Initialize a Spec-Kit Project

```bash
# Create a new specification
specify init true-valence-specs

# Check specification validity
specify check

# Generate code from specification
specify generate
```

## Integration with True Valence Mapper

This edition explores how Spec-Kit's specification framework can enhance relationship mapping:

1. **Relationship Specifications**: Define relationship types and validation rules formally
2. **Mapping Workflows**: Create reusable specifications for common mapping patterns
3. **Quality Assurance**: Validate relationship data against specifications
4. **AI Guidance**: Provide clear specifications for AI agents to follow when building features
5. **Documentation**: Auto-generate documentation from specifications

## Project Structure

```
specs/
├── relationships/          # Relationship type specifications
├── mappings/              # Mapping workflow specifications
├── validations/           # Data validation specifications
└── templates/             # Reusable specification templates
```

## Usage Examples

### Define a Relationship Specification

```yaml
# specs/relationships/person-organization.yml
specification:
  name: Person-Organization Relationship
  version: 1.0.0

  entities:
    - person:
        required_fields: [name, id]
        optional_fields: [email, title]
    - organization:
        required_fields: [name, id, type]

  relationship_types:
    - employment:
        start_date: required
        end_date: optional
        role: required

  validation:
    - rule: "start_date must be before end_date if both present"
    - rule: "role must be non-empty string"
```

### Validate Specifications

```bash
# Check all specifications
specify check

# Check specific specification
specify check specs/relationships/person-organization.yml
```

## Resources

- [Spec-Kit GitHub Repository](https://github.com/github/spec-kit)
- [Spec-Kit Documentation](https://github.com/github/spec-kit/blob/main/README.md)
- [Upgrade Guide](https://github.com/github/spec-kit/blob/main/docs/upgrade.md)

## Development Workflow

1. Write specification in `specs/` directory
2. Run `specify check` to validate
3. Use AI agent (Claude Code, Copilot, etc.) to implement
4. Generate documentation with `specify generate`
5. Iterate based on feedback

## License

This edition follows the license of the True Valence Mapper project.

Spec-Kit is separately licensed - see the [Spec-Kit repository](https://github.com/github/spec-kit) for details.

---

**Parent Repository**: [true-valence-mapper](https://github.com/rhart696/true-valence-mapper)
**Edition Status**: Tool/Dependency Integration
**Last Updated**: 2025-11-18
