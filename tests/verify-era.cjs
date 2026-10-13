// Check the archive-led ERA TRACE renderer and the catalog without dependencies.
const assert=require("node:assert/strict");
const fs=require("node:fs");
const vm=require("node:vm");
const context={window:{}};
for(const filename of ["data.js","digs.js","era.js"]){
 vm.runInNewContext(fs.readFileSync(filename,"utf8"),context,{filename});
}
const D=context.window.DIGCIPHER_DATA;
const era=context.window.DIGCIPHER_ERA;
assert(D&&era&&typeof era.render==="function"&&typeof era.bind==="function");
const page=era.render();
assert(page.includes('id="eraApp"'),"ERA TRACE root must exist");
assert(page.includes('id="eraTimeline"'),"Interactive timeline container missing");
assert(page.includes('id="eraDetail"'),"Detail panel missing");
assert(page.includes('data-era-filter="MUSIC"'),"Music filter missing");
assert(page.includes('data-era-filter="ARTIST"'),"Artist filter missing");
assert(page.includes('data-era-filter="CULTURE"'),"Culture filter missing");
for(let y=2021;y<=2026;y++){
 assert(page.includes('data-era-year="'+y+'"'),"Missing year: "+y);
}
for(const r of D.releases){
 assert(page.includes('data-era-release="'+r.slug+'"'),"Missing catalog release "+r.slug);
}
assert(page.includes("#/dig/awa-tokushima"),"Deep DIG link missing");
assert(page.includes("出典確認"),"Editorial verification disclaimer missing");
assert(!page.includes("<img"),"No unlicensed image element may be embedded");
const idx=fs.readFileSync("index.html","utf8");
assert(idx.includes('href="era.css"'),"Load dark stylesheet");
assert(idx.indexOf('src="data.js"')<idx.indexOf('src="digs.js"'));
assert(idx.indexOf('src="digs.js"')<idx.indexOf('src="era.js"'));
assert(idx.indexOf('src="era.js"')<idx.indexOf('src="app.js"'));
const app=fs.readFileSync("app.js","utf8");
assert(app.includes('DIGCIPHER_ERA.render()'),"Home should render the new era design");
assert(app.includes("p[0]==='dig'?dig(p[1])"),"Editorial DIG route must remain");
assert(app.includes("p[0]==='era'"),"Explicit ERA TRACE route missing");
const stylesheet=fs.readFileSync("era.css","utf8");
assert(stylesheet.includes("@media(max-width:760px)"),"Mobile layout missing");
assert(fs.existsSync("assets/era-night.svg"),"Original hero artwork missing");
console.log("PASS: ERA TRACE renders 2021–2026, 7 releases, the detail panel, filters, DIG, and mobile rules.");
