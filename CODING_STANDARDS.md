# VIB3STYLEPACK Production - Coding Standards

Adherence to these standards is critical for maintaining code quality and project consistency.

## 1. Code Style Rules:
- **JavaScript**: 2-space indentation, ES6+, `const` > `let` > `var` (never `var`).
- **React**: Functional components ONLY, hooks always (if React is introduced).
- **CSS**: CSS modules or styled-components, BEM naming (where applicable).
- **General**: Avoid hard-coding values; always make parameters configurable via the preset system.

## 2. Git Workflow:
- **Branch Naming**: `feature/description`, `fix/issue-description`, `refactor/description`, `docs/description`.
- **Commit Format**: `type(scope): description` (e.g., `feat(auth): add JWT token validation`).
- **Always**: Pull before starting work, create feature branches, write descriptive commits, update tests, update documentation.

## 3. Testing Requirements:
- **Always Write Tests**: For all new features and bug fixes.
- **Test Coverage**: Aim for high test coverage, especially for core modules.
- **Types of Tests**: Implement unit tests for individual modules, integration tests for module interactions, and visual regression tests (using Puppeteer) for UI changes.

## 4. Error Handling:
- Implement robust error handling using `try...catch` blocks.
- Provide clear, actionable error messages, especially for WebGL and shader-related issues.
- Log errors appropriately for debugging.

## 5. Documentation:
- Keep documentation up-to-date, especially `PROJECT_OVERVIEW.md` and `CURRENT_TASK.md`.
- Document new modules, functions, and complex logic.

## 6. Performance:
- Optimize for 60fps WebGL rendering.
- Minimize load times and memory usage.

## Reference Files:
- `PROJECT_OVERVIEW.md`
- `CURRENT_TASK.md`
- `package.json` (for existing dependencies like Puppeteer)
