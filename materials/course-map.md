# learn-github-with-phoebe - course map (non-tech track)

Audience: **non-technical professionals** - PMs, execs, ops, content, analysts. Everything happens in the browser (github.com web UI). Zero git CLI, zero code.
Format: 6 sessions x 45 min (3 welcome / ~15 concepts / ~22 apply-along / 5 Q&A).
Running artifact: **each learner's own handbook repo** - created in Session 2, planned in 3, collaborated on in 4, LIVE on the internet in 5, health-checked in 6.
Design: GitHub Primer look - ink masthead #24292F, action green #2DA44E, link blue #0969DA, merged-PR purple #8250DF flagship, dark code blocks #0D1117.
Sibling track (later): learn-github-for-builders-with-phoebe (git CLI, branching, conflicts, Actions, releases).

## Official GitHub Skills mapping (fetched from the skills org 2026-07-14)

| Skills course | Covered in | Depth |
|---|---|---|
| introduction-to-github | S1 + S2 + S4 | ✓ full working content |
| communicate-using-markdown | S2 | ✓ full working content |
| review-pull-requests | S4 | ✓ review flow via web UI |
| github-pages | S5 | ✓ settings-only path |
| hello-github-actions | S6 | ◐ literacy level (read + install, not write) |
| introduction-to-repository-management | S3 + S6 | ◐ community-health basics |
| introduction-to-git, resolve-merge-conflicts, Copilot/CodeQL/Codespaces courses | not covered | ✗ by design - tech track |

Projects boards have no dedicated Skills course; S3 maps to docs.github.com (GitHub Projects).

## Session map

| # | Title | Diff | Core content | Widget(s) |
|---|-------|------|--------------|-----------|
| 1 | Meet GitHub | 🟢 | What GitHub is (100M+ people, not just code - handbooks, laws, courses live there); account/org/repo mental map; repo anatomy (README, files, Issues, PRs tabs); the social layer: profiles, stars, follow, explore | sorter: "where does this live on GitHub" |
| 2 | Your first repo + Markdown | 🟢 | Create a repo in the browser; README = the front door; commit = save with a message; Markdown that covers 95% of daily writing: headings, bold/italic, lists, links, images, tables, quotes | mdpreview: live markdown playground |
| 3 | Issues + Projects | 🟡 | Issues as the universal todo (not just bugs); good issue anatomy; labels, assignees, milestones; Projects kanban boards; issue-driven work for non-dev teams | sorter: triage this issue |
| 4 | Branches + PRs without code | 🟡 | Why branches exist (safe copies); edit on a branch in the web UI; pull request = proposal + conversation; review: comment, suggest changes, approve; merge (and the purple badge); this is how teams stop emailing final_v3_FINAL.docx | sorter: PR journey steps |
| 5 | Publish with GitHub Pages | 🟠 | Repo to live website via Settings only; what deploy means; themes; editing the live site; when Pages is the right tool (handbooks, portfolios, docs, courses - this course itself runs on it) | checklist: go-live checklist |
| 6 | Speak fluent GitHub | 🟠 | Green checks and Actions at literacy level (what CI means, install a marketplace action); how to READ any repo like a pro (README, releases, issue health, last commit, license, stars); public vs private + safety basics (never paste secrets); dev vocabulary phrasebook (fork, clone, upstream, CI, merge conflict) | checklist: repo health scorecard + sorter: dev phrasebook |

## Widgets (assets/widgets.js - shared engine + 2 new)

sorter (reused 4x with different configs) · mdpreview (NEW: textarea + live rendered preview) · checklist (NEW: configurable scorecard with verdicts)

## Not covered by design

git CLI, clone/push/pull, merge conflicts, Actions authoring, Copilot, Codespaces, code review of actual code - all reserved for learn-github-for-builders-with-phoebe (tech track). Say so on Session 6 + index.
