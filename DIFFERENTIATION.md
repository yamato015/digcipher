# DIGCIPHER — defendable differentiation (2026-10-13)

## Reality check

Spotify SongDNA already exposes creators, samples, covers and collaborator graphs. Spotify About the Song already offers contextual editorial cards assembled from third-party sources. A credit graph, song trivia, or a generalized summary is **not** a defensible product on its own.

**Positioning:** DIGCIPHER is an independently edited, source-traceable archive of Japanese hip-hop **cultural context**. Its unit of value is a **DIG**: a question worth asking, evidence visible to the reader, a clearly qualified editorial reading, and a next listening action.

WAXETCH is the parent brand. The next research area (CLASSICAL) can eventually reuse the *editorial integrity standards*, not the HIPHOP-specific UX.

## Differentiation pillars

1. **Original primary-source evidence.** Work with artists, producers, journalists and local cultural historians to obtain permissioned interviews, contemporaneous statements, and corrections. Claims from such materials should keep a linked evidence record and rights status. Distinctive first-party interviews cannot simply be assembled from generic public metadata.
2. **Longitudinal cultural relationships.** Connect a place/word/event to multiple records over time, explaining *why* each connection was chosen and when it was confirmed. This is distinct from just listing shared credits. Never infer themes from song titles alone as fact.
3. **An editorial question that changes the next listen.** Each published DIG must end with a specific listening question and deep links to involved tracks. An article that merely restates release facts does not meet the final bar.

## Already implemented (narrow vertical slice)

- `digs.js`: source records (URL, publisher, date, type), sourced factual statements, separately stored editorial readings (fact dependencies, confidence, limits), and ordered paths.
- `#/dig/awa-tokushima`: one source-backed question about two track titles on `Soul Quake 2`. It connects a commercial album tracklist to local government information about Awa dialect. **This does not establish Watson's artistic intention or any particular lyric interpretation.**
- Home and Discover lead to the DIG; the two track pages point back to it.
- Each source is navigable. `tests/verify-content.cjs` and `validate.yml` check basic ID integrity, track references and script syntax.
- Generic track catalog fields are no longer labelled verified before item-level source review.

## Not implemented / not claimed

- An exclusive interview, a new interview-derived fact, a licensed lyric annotation, or a substantive artist-approved analysis.
- Broad multi-artist cross-track cultural connections.
- A moderation/editing workflow, revisions, external DB, mobile usability study, traffic, user retention, or a defensible commercial moat.
- Guaranteed market uniqueness. Competitors can add similar interaction patterns; only proprietary evidence, deep context and sustained editorial quality are harder to copy.

## Next vertical slices (ranked)

1. **DIG 002:** one longer Watson timeline from 2–3 externally supported statements with dates, not inferred life events; include a new listening question and corrections workflow.
2. **DIG 003:** one documented cultural term with a local/expert reference and **a verified track-specific use**; do not equate a dictionary definition with how the artist used a word.
3. **Original-source pilot:** contact a willing artist/producer or local reporter and collect 3–5 original facts or answers, with explicit consent for publication and editorial attribution.
4. **Multi-artist architecture:** replace Watson hard-coded ownership in app.js/data.js with track-artist relationships; keep existing URLs.
5. **Reader test:** 5–10 Japanese rap listeners complete Search → DIG → next track. Ask “What did you learn that you could not find on your usual streaming screen?” Track source-clicks, article completion, navigation to a second track and replay intent. Do not infer product/market fit solely from Spotify launching similar features.

## Publication gate

Before publishing an editorial DIG:
- Verify at least one independently accessible reference per factual claim; record URL/source title/check date.
- Separate source observation from editorial conclusion. Include counterevidence/uncertainty where relevant.
- Add **WHY CONNECTED?** with a precise reason supported by facts, not a generic “related.”
- Include a track-level listening question and navigation that does not require reading full lyrics.
- Confirm permission for quoted interviews and any reproduced images/audio/lyrics; prefer links instead of reproductions.
- Reviewer signs off on correctness, scope, copyright, and the line between inference and fact.
- If no evidence is available, mark draft/unpublished rather than generating a plausible explanation.

## Success criterion for “not replaceable”

A listener should find one clearly sourced and compelling insight not already presented in their listening service, understand **why it is supported**, and be motivated to listen to a *different* track. Until tested, this is an explicit hypothesis, not a proven competitive advantage.
