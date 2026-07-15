# Presenter notes - Session 4 · Branches + PRs without code

## Preflight (15 min before)
- [ ] Demo repo ready with ONE PR already open (a one-line handbook edit) so you can show a real diff, conversation and reviewers box without live typing.
- [ ] Collaborator invite link for the demo repo pasted in the room chat (solo attendees pair-review against it in Apply-along 2).
- [ ] Test the sorter widget on the page (drag two items, check the "why" reveals).
- [ ] Projector zoom ON for the two SVGs; the PR anatomy one carries Part 2.
- [ ] Your own handbook repo open in a second tab for the live loop demo.

## Run of show
- 0-3 · Welcome. Tell the final_v3_FINAL.docx horror story, ask who has lived it (all hands go up). "Today is the session that kills that file forever."
- 3-7 · Part 1 branches. Railway SVG: main = published truth, branch = your draft, merge = draft accepted. Key line: "you never create a branch on purpose - the web editor offers it to you."
- 7-13 · Part 2 pull requests. Walk the PR anatomy SVG zone by zone (title, diff, conversation, reviewers, merge button). Red = removed, green = added, say it twice. GitLab handbook story + "this course ships via PRs too."
- 13-18 · Part 3 reviews. The four moves: comment, suggest, request changes, approve. Slow down on SUGGEST - "the reviewer types the exact fix, the author accepts it with one click." Author merges after approval; purple badge; branch deleted; history kept.
- 18-26 · Apply-along 1: the full loop solo. Everyone edits their handbook README, chooses "Create a new branch... and start a pull request", reads their own diff, merges. Celebrate the first purple badge out loud.
- 26-34 · Apply-along 2: pair review. A opens a PR; B leaves one comment AND one suggestion; A clicks Commit suggestion; B approves; A merges. Circulate - the collaborator-invite step is where pairs get stuck.
- 34-40 · Apply-along 3: sorter widget. Let them argue about the typo-fix item (it is a commit, not a new PR) - that argument teaches the "new commits join the open PR" idea better than you can.
- 40-45 · Q&A + homework: every change via PR this week, turn on branch protection, close one Session 3 issue with "closes #N".

## Never cut
- The pair review - everyone must feel BOTH sides of the flow. It is the whole session.
- The Commit suggestion one-click moment. If time collapses, demo it yourself on the pre-made PR, but it must be seen.

## Cut if long
- Draft PRs and closing-without-merging (one sentence each, point to the page).
- The merge conflicts self-study card (say "read the card, one paragraph, tech track drives").
- Sorter debrief discussion - the widget explains itself.

## Expected questions
1. "What if two people edit the same line?" - That is a merge conflict: GitHub shows both versions and a human picks. The web UI handles simple ones; the self-study card has the paragraph. Small PRs merged promptly make it rare.
2. "Can I delete a branch after merging?" - Yes, and you should (GitHub offers the button). History is safe; the branch's story already moved into main.
3. "Can I edit a PR after opening it?" - Yes. New commits on the same branch flow into the open PR automatically. No need to close and reopen.
4. "Do I need a reviewer if I work alone?" - The PR still pays: reading your own red/green diff catches your own mistakes. Solo PRs are self-review with a permanent receipt.
5. "Who is allowed to merge?" - Anyone with write access can press the button; convention is the author merges after approval. Branch protection (homework) makes the approval mandatory rather than polite.
