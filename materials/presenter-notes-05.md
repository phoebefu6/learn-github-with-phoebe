# Presenter notes - Session 5 · Publish with GitHub Pages

## Preflight (15 min before)
- [ ] A pre-made handbook repo of your own, NOT yet published, so you can flip Settings → Pages live on screen - and as a loaner for anyone whose Session 2 repo is broken or missing.
- [ ] Your published demo site already live in a second tab (proof it works before anyone tries).
- [ ] The two _config.yml lines (title + theme: jekyll-theme-cayman) in a paste-ready snippet in the room chat.
- [ ] Test the checklist widget (tick rows, confirm the three verdicts appear at the right scores).
- [ ] Room chat thread titled "LIVE URLS" created and pinned - the applause moment needs a home.

## Run of show
- 0-3 · Welcome. "Four sessions of prep end today: you leave this room with a website." Show your live demo site first thing - proof, not promise.
- 3-7 · Part 1 what Pages is. Pipeline SVG: repo → Pages build → live URL, then trace the loop arrow: every merge republishes. Define deploy plainly: GitHub converts and publishes, ~60 seconds, green check in Actions.
- 7-12 · Part 2 zero-code polish. The _config.yml SVG: one file, two lines, whole new outfit. README becomes the homepage; relative links and dragged images just work. Real world: this very course is a Pages site.
- 12-16 · Part 3 right tool. The perfect-for vs wrong-for table, then land the non-negotiable: free-plan Pages sites are PUBLIC even from private repos. Privacy sweep before shipping, always.
- 16-26 · Apply-along 1: SHIP IT. Settings → Pages → Deploy from a branch → main → Save; watch Actions to green; open the URL. Everyone posts their link in the LIVE URLS thread - applaud each one by name. Then: fix one thing you hate via the Session 4 PR flow and watch it redeploy.
- 26-32 · Apply-along 2: theme it. Create _config.yml, paste the two lines, commit, reload. Offer cayman, minimal, slate. Second theme swap goes via a PR to feel the pipeline.
- 32-38 · Apply-along 3: go-live checklist widget. Give them quiet minutes to audit honestly; remind them the privacy row is worth triple.
- 38-45 · Q&A + homework: polish to 3 linked pages, share the URL with one real colleague who files an issue, watch board + PRs + site work as one system.

## Never cut
- The live-URL applause moment. Every single learner posts a link and hears their name. This is the payoff of the whole course - protect the full 10 minutes.
- The merge-redeploys loop (the fix-one-thing step in Apply-along 1). Without it, Pages feels like a one-time trick instead of a pipeline.

## Cut if long
- The second theme swap in Apply-along 2 (first theme is enough; PR-powered swap becomes homework).
- The custom domains / URL anatomy self-study card (point at the card, move on).
- Checklist debrief discussion - the verdicts speak for themselves.

## Expected questions
1. "Can the site be private?" - Not on the free plan; free Pages sites are public. Private Pages exists on paid organization plans (Enterprise). For team-internal docs, either keep it repo-only or talk to IT about the org plan.
2. "Is this a real website?" - Completely real: a public URL on GitHub's infrastructure, shareable anywhere, indexable by search engines. Custom domain optional on top.
3. "My site shows a 404" - Usually one of three: the deploy has not finished (check Actions for the green check), no README/index at the root, or the wrong branch selected in Settings. Walk those in order.
4. "Does it cost anything, ever?" - Free for public sites within generous limits; a handbook will never touch them. No card, no trial, no expiry.
5. "Can I undo publishing?" - Yes: Settings → Pages → unpublish (or switch Source to None). The site vanishes; the repo is untouched. Remember search engines may have cached it - one more reason for the privacy sweep first.
