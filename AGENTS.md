<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Git Commit Workflow (MANDATORY)

After every fully finished module/task, commit + push immediately. Do NOT ask for permission.

```
git add .
git commit -m "[TAG]: <imperative verb description>"
git push
```

Tags (ALL CAPS in brackets): `[FEATURE]` new feature/component · `[UPDATED]` enhance existing code/UI · `[FIXED]` bug fix · `[SETUP]` packages/config · `[DOCS]` documentation.

Full module map + rules: `../Docs/Frontend-modules.md` (read it before coding).
