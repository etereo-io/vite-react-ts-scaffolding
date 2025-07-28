# Pull Request Review Guidelines

## Overview

This document provides comprehensive guidelines for conducting thorough and consistent pull request reviews. Reviews should ensure code quality, architectural consistency, and adherence to established project patterns.

## Review Process

### Pre-Review Checklist

Before starting the review, ensure:

1. **CI/CD Status**: All automated checks (tests, linting, type checking) are passing
2. **PR Description**: Contains clear description of changes and motivation
3. **Scope**: PR is focused and not mixing unrelated changes
4. **Size**: PR is reasonably sized (ideally < 400 lines of changes)

### Review Focus Areas

> **Reference**: [general-principles.instruction.md](./general-principles.instruction.md)

> **Reference**: [project-structure.instruction.md](./project-structure.instruction.md)

> **Reference**: [naming-conventions.instruction.md](./naming-conventions.instruction.md)

> **Reference**: [imports-exports.instruction.md](./imports-exports.instruction.md)

> **Reference**: [testing.instruction.md](./testing.instruction.md)

> **Reference**: [internationalization.instruction.md](./internationalization.instruction.md)

> **Reference**: [state-and-data.instruction.md](./state-and-data.instruction.md)


## Review Comment Guidelines

### Constructive Feedback Format

#### For Required Changes
```markdown
**Issue**: [Brief description]

**Problem**: [Explain why this needs to change]

**Suggestion**: 
```typescript
// Proposed solution
```

**Reference**: [Link to relevant instruction file if applicable]
```

#### For Optional Improvements
```markdown
**Optional**: [Brief description]

**Benefit**: [Explain potential improvement]

**Suggestion**: 
```typescript
// Proposed enhancement
```
```

#### For Positive Recognition
```markdown
**Great work**: [Highlight good practices]

This follows our [pattern/principle] perfectly and will be maintainable long-term.
```

### Comment Categories

Use these labels to categorize feedback:

- **🚨 Blocking**: Must be fixed before merge
- **💡 Suggestion**: Optional improvement
- **❓ Question**: Seeking clarification
- **📚 Learning**: Educational comment
- **✅ Approved**: Acknowledging good work

## Common Review Patterns

### Code Smells to Watch For

1. **Large Components** (>150 lines): Consider breaking down
2. **Deep Nesting** (>3 levels): Refactor for readability
3. **Magic Numbers/Strings**: Extract to constants
4. **Missing Error Handling**: Add appropriate error boundaries
5. **Inconsistent Patterns**: Ensure consistency with existing code

### Red Flags

- ❌ Any use of `any` inside application code type without justification
- ❌ Console.log statements in production code
- ❌ Commented-out code blocks
- ❌ TODO comments without GitHub issues
- ❌ Missing tests for new business logic
- ❌ Hardcoded configuration values
- ❌ Direct DOM manipulation in React components

## Final Review Checklist

Before approving a PR, ensure:

- [ ] **Architecture**: Follows established patterns and principles
- [ ] **Types**: Proper TypeScript usage with strong typing
- [ ] **Testing**: Adequate test coverage for new functionality
- [ ] **Performance**: No obvious performance regressions
- [ ] **Consistency**: Matches existing codebase style and patterns
- [ ] **Accessibility**: Meets basic accessibility requirements
- [ ] **Documentation**: Code is self-documenting or includes necessary comments
- [ ] **Security**: No obvious security vulnerabilities
- [ ] **UX**: Changes improve or maintain user experience
- [ ] **i18n**: All user-facing text is internationalized

## Post-Review Actions

### For Authors
- Address all blocking feedback before requesting re-review
- Respond to questions and optional suggestions
- Update tests if implementation changes significantly
- Add regression tests for bug fixes

### For Reviewers
- Re-review promptly after changes are made
- Acknowledge when feedback has been addressed
- Approve when all concerns are resolved
- Consider mentioning positive aspects of the implementation

## Resources

- [General Principles](./general-principles.instruction.md)
- [Testing Guidelines](./testing.instruction.md)
- [Component Architecture](./component-architecture.instruction.md)
- [State Management](./state-and-data.instruction.md)
- [UI and Styling](./ui-and-styling.instruction.md)
- [Project Structure](./project-structure.instruction.md)
