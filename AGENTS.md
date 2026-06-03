# AGENTS.md

## Cursor Cloud specific instructions

This repository is a **single static landing page** (HTML + CSS only). There is no `package.json`, Docker stack, database, or backend API.

### Running the site locally

From the repository root:

```bash
python3 -m http.server 8000
```

Open http://127.0.0.1:8000/ (or http://localhost:8000/). The server must be started in a **tmux** session if it should keep running in the background (see Cloud Agent shell rules).

### Lint / test / build

| Task | Status |
|------|--------|
| Lint | Not configured in-repo (no ESLint, Stylelint, or HTML validator config) |
| Unit / integration tests | None |
| Build | None — deploy `index.html` and `styles.css` as static assets |

Smoke-check after changes: confirm HTTP 200 for `/` and `/styles.css`, and spot-check in-page anchors (`#services`, `#work`, `#assessment`, `#roi`) and `mailto:hello@example.com` CTAs.

### Product context

Content and positioning notes live in `readme.md` (marketing brief, not dev setup). The live page is `index.html` with styles in `styles.css`.
