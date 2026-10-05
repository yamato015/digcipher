const test = require('node:test');
const assert = require('node:assert/strict');
const { normalize, decode, createCatalog } = require('../core.js');
const { loadData, validateData } = require('../scripts/check-data.cjs');
const data = loadData();
const catalog = createCatalog(data);

test('Fixed database has valid references and field-specific evidence', () => {
  assert.deepEqual(validateData(data), []);
});
test('Japanese aliases, width, punctuation and readings find the same entries', () => {
  assert.equal(catalog.search('ワトソン')[0].key, 'artist:watson');
  assert.equal(catalog.search('わとそん')[0].key, 'artist:watson');
  assert.equal(catalog.search('ＶＶＳ')[0].key, 'term:vvs');
  assert.equal(catalog.search('ブイ・ブイ・エス')[0].key, 'term:vvs');
  assert.equal(catalog.search('アイス')[0].key, 'term:ice');
  assert.equal(catalog.search('Yellow Bucks')[0].key, 'artist:¥ellow-bucks');
  assert.equal(normalize('Soul-Quake'), normalize('ＳＯＵＬ QUAKE'));
});
test('Exact title ranks above album and artist context matches', () => {
  const matches = catalog.search('Soul Quake');
  assert.equal(matches[0].key, 'release:soul-quake');
  assert.ok(matches.some(x => x.type === 'tracks'));
  assert.equal(catalog.search('IO')[0].key, 'artist:io');
});
test('All query tokens must match and category counts are not display limits', () => {
  const tracks = catalog.search('ワトソン ソウルクエイク3', 'tracks');
  assert.equal(tracks.length, 10);
  assert.ok(tracks.every(x => x.key.startsWith('track:soul-quake-3:')));
  assert.equal(catalog.search('Watson', 'tracks').length, 71);
  assert.deepEqual(catalog.search('not-in-archive-123'), []);
  assert.deepEqual(catalog.search('   '), []);
  assert.deepEqual(catalog.search('&?'), []);
});
test('Featured artist search exposes their credited tracks', () => {
  const expected = catalog.credits('guca-owl').map(t => t.id);
  const found = catalog.search('guca owl', 'tracks').map(x => x.key);
  assert.ok(expected.length > 0);
  assert.deepEqual(found.sort(), expected.sort());
});
test('Every indexed link round-trips including Japanese track IDs', () => {
  for (const item of catalog.entries) {
    const parts = item.href.slice(2).split('/');
    const id = decode(parts.slice(1).join('/'));
    const collections = { artist: catalog.artists, release: catalog.releases, track: catalog.tracks, term: catalog.terms };
    assert.ok(collections[parts[0]].has(parts[0] === 'term' ? 'term:' + id : id), item.href);
  }
  assert.equal(decode('%E0%A4'), null);
});
test('Verification is per field, requires a source and never spills into interpretation', () => {
  const vvs = catalog.terms.get('term:vvs');
  assert.equal(catalog.verified(vvs, 'short_definition'), true);
  assert.equal(catalog.verified(vvs, 'long_definition'), false);
  assert.equal(catalog.verified(data.tracks.find(t => t.release === 'pose-1'), 'dur'), false);
  assert.equal(catalog.verified({ evidence: [{ source_id: 'unknown', fields: ['title'], checked_on: '2026-10-04', checked_by: 'test' }] }, 'title'), false);
  assert.equal(catalog.verified({ evidence: [{ source_id: 'gia-clarity', fields: ['title'] }] }, 'title'), false);
  const sq3 = data.tracks.filter(t => t.release === 'soul-quake-3');
  assert.ok(sq3.every(t => catalog.verified(t, 'features')));
});
test('Ownership and credits remain distinct when a second archive is added', () => {
  const fixture = structuredClone(data);
  fixture.releases.push({ title: 'Fixture', slug: 'fixture', artist: 'io', date: '2026-10-04', track_count: 0 });
  const c = createCatalog(fixture);
  assert.equal(c.artistReleases('io').length, 1);
  assert.ok(c.credits('io').every(t => t.features.includes('IO')));
  assert.equal(c.artistReleases('watson').length, 7);
});
test('Validator rejects broken references, unsupported media and missing provenance', () => {
  const fixture = structuredClone(data);
  fixture.releases[0].artist = 'missing';
  fixture.tracks[0].features.push('Missing Artist');
  fixture.tracks[0].lyrics = 'unsupported';
  fixture.tracks[0].evidence.push({ source_id: 'missing', fields: ['missing'], checked_on: '2026-99-99' });
  const errors = validateData(fixture);
  assert.ok(errors.some(e => e.includes('Unknown release artist')));
  assert.ok(errors.some(e => e.includes('Unknown featured artist')));
  assert.ok(errors.some(e => e.includes('Unlicensed media')));
  assert.ok(errors.some(e => e.includes('Unknown evidence source')));
  assert.ok(errors.some(e => e.includes('Incomplete source review')));
});
