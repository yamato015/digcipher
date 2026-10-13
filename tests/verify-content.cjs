// No external packages. Validate the editorial source trail and existing catalog.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const ctx={window:{}};
vm.runInNewContext(fs.readFileSync('data.js','utf8'),ctx,{filename:'data.js'});
vm.runInNewContext(fs.readFileSync('digs.js','utf8'),ctx,{filename:'digs.js'});
const D=ctx.window.DIGCIPHER_DATA, G=ctx.window.DIGCIPHER_DIGS;
assert(D&&G,'Global data collections must load');
const sourceById=new Map(G.sources.map(s=>[s.id,s]));
const factById=new Map(G.facts.map(f=>[f.id,f]));
const readingById=new Map(G.readings.map(i=>[i.id,i]));
assert.equal(sourceById.size,G.sources.length,'Source IDs must be unique');
assert.equal(factById.size,G.facts.length,'Fact IDs must be unique');
assert.equal(readingById.size,G.readings.length,'Reading IDs must be unique');
for(const s of G.sources){
 assert.match(s.url,/^https:\/\//,'Sources must have HTTPS URL');
 assert.match(s.checked_on,/^\d{4}-\d{2}-\d{2}$/,'Source check date required');
}
for(const f of G.facts){
 assert(f.sources.length>0,'Fact must have at least one source: '+f.id);
 assert.equal(f.verification,'externally_sourced','Fact cannot pretend unverified content is verified: '+f.id);
 for(const id of f.sources)assert(sourceById.has(id),'Missing source '+id+' for '+f.id);
}
for(const i of G.readings){
 assert(i.based_on.length>0,'Interpretation must cite fact IDs');
 for(const id of i.based_on)assert(factById.has(id),'Missing fact '+id+' for interpretation '+i.id);
 assert(i.limit,'Interpretation limitations must be explicit');
 assert.notEqual(i.status,'FACT','Interpretation cannot be labelled FACT');
}
for(const t of G.trails){
 for(const id of t.fact_ids)assert(factById.has(id),'Missing fact reference '+id);
 for(const id of t.reading_ids)assert(readingById.has(id),'Missing interpretation '+id);
 const rel=D.releases.find(r=>r.slug===t.release);
 assert(rel,'Unknown release: '+t.release);
 for(const name of t.track_titles){
  const count=D.tracks.filter(x=>x.release===t.release&&x.title===name).length;
  assert.equal(count,1,'Expected one matching track '+name);
 }
 assert(t.path_reason&&t.question,'Trail needs explanation and listening prompt');
}
assert.equal(D.tracks.length,71,'Watson seed count changed');
const idx=fs.readFileSync('index.html','utf8');
assert(idx.indexOf('data.js')<idx.indexOf('digs.js')&&idx.indexOf('digs.js')<idx.indexOf('app.js'),'Script load order matters');
const app=fs.readFileSync('app.js','utf8');
assert(app.includes("p[0]==='dig'?dig(p[1])"),'Route must include editorial DIG');
assert(app.includes('WHY CONNECTED?'),'Why-connected section is essential');
assert(!G.trails.some(t=>Object.keys(t).some(k=>/lyrics|audio|cover|excerpt/i.test(k))),'Do not embed unauthorized copyrighted material');
console.log('PASS: editorial source integrity, catalogs, routes, and rights-oriented structure');
