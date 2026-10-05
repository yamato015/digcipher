const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function loadData() {
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', 'data.js'), 'utf8'), context);
  return JSON.parse(JSON.stringify(context.window.DIGCIPHER_DATA));
}

function validateData(data) {
  const errors = [];
  const fail = text => errors.push(text);
  const collections = ['artists', 'releases', 'tracks', 'terms', 'sources'];
  for (const key of collections) if (!Array.isArray(data[key])) fail(key + ' must be an array');
  if (errors.length) return errors;
  function unique(records, field, kind) {
    const seen = new Set();
    for (const record of records) {
      if (typeof record[field] !== 'string' || !record[field]) fail(kind + ': missing ' + field);
      else if (seen.has(record[field])) fail(kind + ': duplicate ' + record[field]);
      seen.add(record[field]);
    }
    return seen;
  }
  function date(value) {
    return /^\d{4}-\d{2}-\d{2}$/.test(value || '') &&
      Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;
  }
  const artists = unique(data.artists, 'slug', 'artist');
  const names = unique(data.artists, 'name', 'artist name');
  const releases = unique(data.releases, 'slug', 'release');
  unique(data.tracks, 'id', 'track');
  unique(data.terms, 'id', 'term');
  const sources = unique(data.sources, 'id', 'source');
  if (data.artists.filter(a => a.archive_status === 'first').length !== 1) fail('Exactly one FIRST ARCHIVE is required');
  for (const a of data.artists) if (!['first', 'connected', 'archive'].includes(a.archive_status)) fail('Unknown archive status: ' + a.slug);
  for (const source of data.sources) {
    try { if (new URL(source.url).protocol !== 'https:') fail('Source must use HTTPS: ' + source.id); }
    catch { fail('Invalid source URL: ' + source.id); }
    if (!source.title || !source.publisher) fail('Source needs title and publisher: ' + source.id);
    if (source.rights !== 'external_link_only') fail('Unsupported source rights: ' + source.id);
  }
  for (const r of data.releases) {
    if (!artists.has(r.artist)) fail('Unknown release artist: ' + r.slug);
    if (!date(r.date)) fail('Invalid release date: ' + r.slug);
    const tracks = data.tracks.filter(t => t.release === r.slug);
    if (tracks.length !== r.track_count) fail('Track count differs: ' + r.slug);
    const positions = tracks.map(t => t.n).sort((a, b) => a - b);
    if (positions.some((n, i) => n !== i + 1)) fail('Track order is not contiguous: ' + r.slug);
  }
  for (const t of data.tracks) {
    if (!releases.has(t.release)) fail('Unknown track release: ' + t.id);
    if (!Number.isInteger(t.n) || t.n < 1 || !Number.isInteger(t.dur) || t.dur < 1) fail('Invalid track order/duration: ' + t.id);
    if (!date(t.date)) fail('Invalid track date: ' + t.id);
    if (!Array.isArray(t.features)) fail('Track features must be an array: ' + t.id);
    else for (const name of t.features) if (!names.has(name)) fail('Unknown featured artist: ' + name);
  }
  for (const term of data.terms) {
    if (!term.id.startsWith('term:') || !term.term || !term.short_definition || !term.long_definition) fail('Incomplete term: ' + term.id);
  }
  for (const key of collections) for (const item of data[key]) {
    for (const prohibited of ['lyrics', 'full_lyrics', 'audio', 'audio_url', 'cover_art', 'cover_url', 'artwork']) {
      if (prohibited in item) fail('Unlicensed media field is not supported: ' + prohibited);
    }
    if (item.aliases && (!Array.isArray(item.aliases) || item.aliases.some(a => typeof a !== 'string'))) fail('Invalid aliases');
    if (item.evidence && !Array.isArray(item.evidence)) { fail('Evidence must be an array'); continue; }
    for (const ref of item.evidence || []) {
      if (!sources.has(ref.source_id)) fail('Unknown evidence source: ' + ref.source_id);
      if (!date(ref.checked_on) || typeof ref.checked_by !== 'string' || !ref.checked_by.trim()) fail('Incomplete source review: ' + ref.source_id);
      if (!Array.isArray(ref.fields) || !ref.fields.length) fail('Evidence fields are required: ' + ref.source_id);
      else for (const field of ref.fields) if (!(field in item)) fail('Evidence targets unknown field: ' + field);
    }
  }
  return errors;
}

if (require.main === module) {
  const errors = validateData(loadData());
  if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1; }
  else console.log('Fixed database references, track order, sources and rights checks passed.');
}
module.exports = { loadData, validateData };
