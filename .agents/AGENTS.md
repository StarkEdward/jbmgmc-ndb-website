Rule: Do not directly push changes to the main branch unless explicitly asked by the user. Only push changes to the dev branch.

Rule: Use Conventional Commits for all commit messages. Prefix commits with the appropriate type:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for formatting, missing semicolons, etc. (no code changes)
- `refactor:` for code changes that neither fix a bug nor add a feature
- `test:` for adding missing tests or correcting existing tests
- `chore:` for updating build tasks, package manager configs, etc.

Rule: When creating version tags, follow Semantic Versioning (SemVer) and prefix the tag with 'v' (e.g., `v1.0.0`, `v1.2.3-beta.1`).

Rule: Before preparing any merge or pull request from 'dev' to 'main', strictly ensure all documentation (README.md, inline comments, API docs) is fully updated to reflect the new features or changes in 'dev'. Do not automatically merge changes to the 'main' branch; always request user review and explicit approval first.

Rule: Strict Investigation vs. Action Mode. By default, you may proactively implement features if the user's intent to build is clear. HOWEVER, if the prompt contains investigatory phrases like 'check', 'tell me', 'find the issue', 'why', 'what is wrong', 'I want to know', or a question mark (?) that asks for an explanation rather than a feature implementation, you must instantly switch to Read-Only Mode. In Read-Only Mode, you act strictly as an analyst: investigate the codebase, identify the root cause, and PROPOSE a solution. Do NOT write code, modify files, or run commands until the user explicitly replies with approval (e.g., 'fix it', 'go ahead').

Rule: Mandatory Testing and Verification. After implementing a fix or new feature, you must actively test and re-verify that the issue is fully resolved before considering the task complete. This includes running relevant unit tests, build commands, or manual verification steps, and reporting the test results back to the user.

Rule: Mandatory Documentation. It is mandatory to write a comprehensive JSDoc comment above every complex function or class, explaining its purpose, parameters, and return types.
