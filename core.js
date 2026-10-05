(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.DIGCIPHER_CORE = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  function normalize(value) {
    return String(value ?? '').normalize('NFKC').toLowerCase()
      .replace(/[ァ-ヶ]/g, c => String.fromCharCode(c.charCodeAt(0) - 0x60))
      .replace(/[\s\p{P}\p{S}]+/gu, '');
  }

  function decode(value) {
    try { return decodeURIComponent(value); } catch { return null; }
  }

  function createCatalog(data) {
    const artists = new Map(data.artists.map(a => [a.slug, a]));
    const names = new Map(data.artists.map(a => [a.name, a]));
    const releases = new Map(data.releases.map(r => [r.slug, r]));
    const sources = new Map((data.sources || []).map(s => [s.id, s]));
    const tracks = new Map(data.tracks.map(t => [t.id, t]));
    const terms = new Map(data.terms.map(t => [t.id, t]));
    const orderedTracks = slug => data.tracks.filter(t => t.release === slug).sort((a, b) => a.n - b.n);
    const artistReleases = slug => data.releases.filter(r => r.artist === slug).sort((a, b) => a.date.localeCompare(b.date));
    const credits = slug => data.tracks.filter(t => t.features.includes(artists.get(slug)?.name));
    const artistWords = a => a ? [a.name, ...(a.aliases || [])] : [];

    const entries = [
      ...data.artists.map(a => ({
        key: 'artist:' + a.slug, type: 'artists', title: a.name,
        href: '#/artist/' + encodeURIComponent(a.slug),
        primary: artistWords(a), secondary: [a.archive_status === 'first' ? 'FIRST ARCHIVE' : 'CONNECTED INDEX'],
        meta: a.archive_status === 'first' ? 'FIRST ARCHIVE' : '客演から辿る'
      })),
      ...data.releases.map(r => ({
        key: 'release:' + r.slug, type: 'releases', title: r.title,
        href: '#/release/' + encodeURIComponent(r.slug),
        primary: [r.title, ...(r.aliases || [])],
        secondary: [...artistWords(artists.get(r.artist)), r.date],
        meta: (artists.get(r.artist)?.name || '') + ' · ' + r.date.slice(0, 4) + ' · ' + orderedTracks(r.slug).length + '曲'
      })),
      ...data.tracks.map(t => {
        const r = releases.get(t.release);
        return {
          key: t.id, type: 'tracks', title: t.title, href: '#/track/' + encodeURIComponent(t.id),
          primary: [t.title, ...(t.aliases || [])],
          secondary: [r?.title, ...(r?.aliases || []), ...artistWords(artists.get(r?.artist)),
            ...t.features.flatMap(name => artistWords(names.get(name)))],
          meta: (artists.get(r?.artist)?.name || '') + ' · ' + (r?.title || '')
        };
      }),
      ...data.terms.map(t => ({
        key: t.id, type: 'terms', title: t.term, href: '#/term/' + encodeURIComponent(t.id.slice(5)),
        primary: [t.term, t.reading, ...(t.aliases || [])],
        secondary: [t.short_definition, t.category],
        meta: t.reading + ' · ' + t.category
      }))
    ];
    const index = entries.map(entry => ({
      ...entry, primary: entry.primary.map(normalize),
      secondary: entry.secondary.map(normalize)
    }));

    function search(query, type = 'all') {
      const tokens = String(query).normalize('NFKC').trim().split(/\s+/).map(normalize).filter(Boolean);
      if (!tokens.length) return [];
      const whole = normalize(query);
      return index.filter(entry => type === 'all' || entry.type === type).map(entry => {
        const fields = [...entry.primary, ...entry.secondary];
        if (!tokens.every(token => fields.some(field => field.includes(token)))) return null;
        const score = entry.primary.some(field => field === whole) ? 120 :
          entry.primary.some(field => field.startsWith(whole)) ? 90 :
          entry.primary.some(field => field.includes(whole)) ? 60 : 20;
        return { ...entry, score };
      }).filter(Boolean).sort((a, b) => b.score - a.score || a.title.localeCompare(b.title, 'ja') || a.key.localeCompare(b.key));
    }

    function evidence(item, field) {
      return (item?.evidence || []).filter(ref => sources.has(ref.source_id) &&
        /^\d{4}-\d{2}-\d{2}$/.test(ref.checked_on || '') && ref.checked_by &&
        (!field || ref.fields.includes(field)));
    }

    return { artists, names, releases, sources, tracks, terms, entries, search,
      orderedTracks, artistReleases, credits, evidence,
      verified: (item, field) => evidence(item, field).length > 0 };
  }

  return { normalize, decode, createCatalog };
});
