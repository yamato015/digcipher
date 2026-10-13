# ERA TRACE — visual and interaction specification

Updated 2026-10-13. Primary visual reference: the dark DIGCIPHER / Watson artist-timeline concept image from the user conversation. Implement the composition and atmosphere, but **not unlicensed source imagery or invented historical events**.

## Product intent

Japanese HIPHOP only, deeply centered on **one artist at a time**, starting with Watson (FIRST ARCHIVE, not the whole product). Era Trace lets a listener understand a person's work through **year → records → relevant events → editorial DIGs → tracks**. This is an artist-first cultural chronology, not Spotify SongDNA's credit graph.

## Composition / typography / palette

- Desktop: approximately 208px dark left rail / flexible center content / ~300px sticky right detail panel. Artist hero is wide, cinematic, restrained. Above the timeline, an understated tab strip and compact pill filters.
- Center: 2021–2026 as horizontal chronological year columns, small original abstract album artwork substitutes, music dots, separate evidence-backed culture DIGs. The selected year and release become more visible.
- Right: a time capsule with abstract artwork, actual catalog metadata, the first five track links, link to the full release, and verified editorial DIG if available.
- Below: archive vocabulary cards **not falsely attributed to any year**, then a compact footer.
- Visual: near-black / charcoal (#090c0e, #151b1e), cool white type, desaturated music-blue / artist-gold / culture-lavender, Georgia serif for artist/title/era headings, sober small sans-serif for metadata.
- Hero artwork: `assets/era-night.svg` is an original anonymous person/night street composition. Albums are CSS typography and gradients. These are **not** Watson portraits or official covers.
- WAXETCH’s independent brand page remains separate and retains its existing parent-brand styling and CLASSICAL / PROJECT 002 research card.

## Interaction

- `#/ ` (without the space) and `#/era` display Era Trace. Legacy `#/artist/watson`, release, track, term, Discover and source-backed DIG routes remain.
- Every year button selects the latest catalog release in that year; a release card selects that specific work; right details change without page navigation.
- Filters: ALL / MUSIC / ARTIST / CULTURE. Categories with no verified entries show honest empty states rather than fictional history. The culture DIG in 2024 is explicitly an **editorial note**, not a claim that a real-world event occurred then.
- Tracks, albums, and source-backed DIGs are deep links into their relevant pages. Search overlay, sidebar navigation, hash routes and mobile bottom navigation remain operable.
- Responsive: at narrow desktop widths the detail panel flows below the timeline; on smartphones the fixed left rail disappears, the year columns become horizontally swipeable, and selecting a year or release scrolls to its details.

## Accuracy and publishing constraints

- Existing 7 releases and 71 tracks are **catalog seed records, not individually verified facts**; no “VERIFIED” blanket claims.
- Nothing can imply an artist career milestone, a live show, an influence, a lyric interpretation, or an event without sourced evidence. 2025 therefore has an explicit archive-empty state.
- Verify each added cultural item with source title, URL, time and confirmation date; show editorial vs fact.
- No third-party photos, actual album jackets, audio, long lyrics, text attributed to Watson, or fabricated imagery of a named artist unless rights have been cleared.
- This UI is a working first implementation, not a validated audience preference or the full envisioned historical archive.

## Test / acceptance

Run:
- `node --check data.js && node --check digs.js && node --check era.js && node --check app.js`
- `node tests/verify-content.cjs`
- `node tests/verify-era.cjs`

Manual acceptance:
- Desktop 1440px and 1024px: chronology is legible, scrolling works, sidebar + artist hero + time capsule have intact layout.
- Mobile 390px and 320px: no page-wide horizontal overflow; timeline alone scrolls horizontally; mobile bottom navigation reachable.
- Selection: choose 2021 (two releases), 2024 (Soul Quake 2 and DIG), 2025 (no entries), and 2026. Select album, open release, open track, open DIG, reopen browser/back.
- Filters: MUSIC shows release cards, CULTURE shows 2024 contextual DIG only, ARTIST correctly has empty states, ALL combines.
- Search, Discover, existing detail routes, factual editorial link integrity, and reading-source links remain functional.
- GitHub Pages must succeed and public URL must be inspected before claiming public availability.
