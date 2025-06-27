# VIB3STYLEPACK Production - Tool Usage for Claude

This guide outlines how Claude should leverage its tools to effectively contribute to the VIB3STYLEPACK project.

## General Principles:
- **Autonomy**: Operate autonomously, taking initiative to solve problems and implement solutions.
- **Efficiency**: Prioritize efficient use of tools and resources.
- **Context Awareness**: Always refer to `PROJECT_OVERVIEW.md`, `CURRENT_TASK.md`, and `CODING_STANDARDS.md` for context.
- **Logging**: Maintain detailed logs of all actions and findings.

## Specific Tool Usage:

### 1. File System Tools (`read_file`, `write_file`, `list_directory`, `search_file_content`, `glob`):
- **Purpose**: Navigate the project structure, read code, write new files, and search for specific patterns.
- **Usage**: Use extensively to understand existing code, implement modularization, and manage project files.
- **Example**: `read_file('path/to/module.js')`, `search_file_content('shaderSource', include='*.js')`.

### 2. Shell Commands (`run_shell_command`):
- **Purpose**: Execute system commands for tasks like running local servers, installing dependencies, or executing tests.
- **Usage**: 
    - To start a local server for testing: `run_shell_command('python -m http.server 8080')`.
    - To install Node.js dependencies (if `package.json` is updated): `run_shell_command('npm install')`.
    - To run tests: `run_shell_command('npm test')`.
- **Safety**: Explain critical commands before execution.

### 3. Web Tools (`web_fetch`, `google_web_search`):
- **Purpose**: Research WebGL best practices, shader development, and JavaScript modularization techniques.
- **Usage**: 
    - `google_web_search('WebGL shader vec3 vec2 type mismatch fix')`.
    - `web_fetch('https://webgl2fundamentals.org/webgl/lessons/webgl-shaders-101.html')`.

### 4. Memory (`save_memory`):
- **Purpose**: Remember key project details, user preferences, or recurring issues.
- **Usage**: Use sparingly for high-value, persistent information.

### 5. Refactoring (`replace`):
- **Purpose**: Apply precise code changes, especially during modularization or bug fixes.
- **Usage**: Always read the file content first to ensure `old_string` and `new_string` are exact matches and provide sufficient context.

## Workflow Integration:
1.  **Understand**: Read relevant documentation and code files.
2.  **Plan**: Formulate a clear plan for addressing the `CURRENT_TASK.md`.
3.  **Implement**: Use tools to make code changes.
4.  **Verify**: Run tests and visually inspect changes.
5.  **Document**: Update logs and relevant documentation.

## Important Considerations:
- **Shader Debugging**: When working with shaders, use browser developer tools extensively for debugging.
- **Performance Monitoring**: Pay attention to console warnings/errors related to performance.
- **Modularity**: Prioritize creating modular, reusable components.

## Reference Files:
- `PROJECT_OVERVIEW.md`
- `CURRENT_TASK.md`
- `CODING_STANDARDS.md`
