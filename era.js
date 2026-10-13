(()=>{
"use strict";
const D=window.DIGCIPHER_DATA;
const G=window.DIGCIPHER_DIGS;
const YEARS=[2021,2022,2023,2024,2025,2026];
const state={year:2024,release:"soul-quake-2",filter:"ALL"};
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const releasesOf=y=>D.releases.filter(r=>Number(r.date.slice(0,4))===y);
const releaseBySlug=slug=>D.releases.find(r=>r.slug===slug);
const tracksOf=slug=>D.tracks.filter(t=>t.release===slug).sort((a,b)=>a.n-b.n);
const hasCurated=y=>y===2024&&!!G?.trails?.length;
const dateLabel=s=>s?s.slice(0,4)+"."+s.slice(5,7)+"."+s.slice(8,10):"";
const albumArt=(r,compact=false)=>'<div class="era-cover era-cover-'+esc(r.slug)+(compact?' era-cover-mini':'')+'" aria-hidden="true"><div class="era-cover-orbit"></div><span class="era-cover-top">WATSON / ARCHIVE</span><strong>'+esc(r.title)+'</strong><small>'+esc(r.date.slice(0,4))+' · ORIGINAL ARTWORK NOT REPRODUCED</small></div>';

function releaseTile(r){
 const first=tracksOf(r.slug).slice(0,2);
 return '<button type="button" class="era-release-tile'+(state.release===r.slug?' is-selected':'')+'" data-era-release="'+esc(r.slug)+'" aria-pressed="'+(state.release===r.slug)+'">'+
 '<span class="era-event-kind"><i class="era-dot era-dot-music"></i>MUSIC / '+esc(dateLabel(r.date))+'</span>'+
 albumArt(r,true)+'<strong class="era-release-name">'+esc(r.title)+'</strong>'+
 '<small>'+r.track_count+' TRACKS</small>'+
 '<span class="era-track-peek">'+first.map(x=>esc(x.title)).join(' / ')+'</span></button>';
}
function cultureTile(){
 const t=G.trails[0];
 return '<a class="era-culture-tile" href="#/dig/'+esc(t.slug)+'"><span class="era-event-kind"><i class="era-dot era-dot-culture"></i>CONTEXT / EDITORIAL</span>'+
 '<strong>阿波弁 × TOKUSHIMA</strong><span>同じ作品にある2曲を、地元の言葉と地名から聴き比べる。</span><em>VIEW THE DIG ↗</em></a>';
}
function eventsOf(y){
 const cards=[];
 if(state.filter==="ALL"||state.filter==="MUSIC"){
  for(const r of releasesOf(y))cards.push(releaseTile(r));
 }
 if((state.filter==="ALL"||state.filter==="CULTURE")&&hasCurated(y)){
  cards.push(cultureTile());
 }
 if(!cards.length) return '<div class="era-era-empty"><span>—</span><p>'+(
  state.filter==="ARTIST"?'人物の出来事は現在、出典確認中':
  state.filter==="CULTURE"?'出典付きの文化記事は準備中':
  '現在の収録作品はありません')+'</p><small>NOT AN ASSERTION OF INACTIVITY</small></div>';
 return cards.join("");
}
function columns(){
 return YEARS.map(y=>{
  const count=releasesOf(y).length;
  return '<section class="era-year-column'+(state.year===y?' is-active':'')+'" aria-label="'+y+'年">'+
  '<button type="button" class="era-year-select" data-era-year="'+y+'" aria-pressed="'+(state.year===y)+'"><strong>'+y+'</strong><span>'+count+' RELEASE'+(count===1?'':'S')+'</span></button>'+
  '<div class="era-year-rule"><span></span></div>'+
  '<div class="era-year-events">'+eventsOf(y)+'</div>'+
  '</section>';
 }).join("");
}
function eraDetail(){
 const y=state.year,r=releaseBySlug(state.release),records=releasesOf(y);
 let content='';
 if(r&&Number(r.date.slice(0,4))===y){
  const tt=tracksOf(r.slug);
  content='<div class="era-detail-art">'+albumArt(r)+'</div>'+
  '<div class="era-detail-caption"><span>SELECTED RELEASE / '+y+'</span><h2>'+esc(r.title)+'</h2><p>Watson · '+esc(dateLabel(r.date))+' · '+r.track_count+' tracks</p></div>'+
  '<div class="era-detail-actions"><a href="#/release/'+esc(r.slug)+'" class="era-action">全収録曲を見る ↗</a></div>'+
  '<div class="era-detail-tabs"><span class="is-current">TRACKLIST</span><span>CONTEXT</span><span>SOURCES</span></div>'+
  '<ol class="era-detail-tracklist">'+tt.slice(0,5).map(t=>'<li><span>'+String(t.n).padStart(2,'0')+'</span><a href="#/track/'+encodeURIComponent(t.id)+'">'+esc(t.title)+'</a><b>↗</b></li>').join('')+'</ol>'+
  (tt.length>5?'<a class="era-more-tracks" href="#/release/'+esc(r.slug)+'">+ '+(tt.length-5)+' more tracks →</a>':'');
 }else{
  content='<div class="era-detail-empty"><span>ARCHIVE / '+y+'</span><div class="era-empty-symbol">∅</div><h2>まだ掲載していない時代。</h2><p>この年の作品・出来事は、現在の公開アーカイブには未収録です。活動がなかったという意味ではありません。</p></div>';
 }
 const editorial=hasCurated(y)?'<div class="era-detail-editorial"><div class="era-detail-kicker"><i class="era-dot era-dot-culture"></i>DEEP DIG / VERIFIED REFERENCES</div><h3>『阿波弁』から<br>『TOKUSHIMA』へ。</h3><p>曲名と徳島県の方言資料から、2曲を聴き比べるための問いを提示。</p><a href="#/dig/'+esc(G.trails[0].slug)+'">根拠と解説を読む ↗</a></div>':
 '<div class="era-detail-editorial is-empty"><div class="era-detail-kicker">CULTURE / UNDER RESEARCH</div><p>出典を伴う時代の出来事・背景解説を、段階的に追加します。</p></div>';
 return '<div class="era-detail-header"><span>TIME CAPSULE</span><strong>'+y+' / WATSON</strong></div>'+content+editorial+
 '<div class="era-detail-disclaimer">作品情報は収録中のカタログデータです。全項目の外部照合は未完了。未許諾のジャケット画像・音源・歌詞は表示していません。</div>';
}
function strip(){
 const terms=D.terms.slice(0,4);
 return '<div class="era-strip"><div class="era-strip-heading"><span>EXPLORE BEYOND THE TIMELINE</span><strong>次に掘る言葉。</strong><small>年代との関連を示すものではありません</small></div><div class="era-word-list">'+terms.map((t,i)=>
 '<a class="era-word" href="#/term/'+encodeURIComponent(t.id.split(':')[1])+'"><span>WORD / '+String(i+1).padStart(2,'0')+'</span><strong>'+esc(t.term)+'</strong><small>'+esc(t.short_definition)+'</small><em>↗</em></a>').join('')+'</div></div>';
}
function render(){
 return '<div class="era-app" id="eraApp">'+
 '<div class="era-center">'+
 '<header class="era-hero">'+
 '<div class="era-mobile-head"><a href="#/" class="era-mobile-brand">DIGCIPHER<small>by WAXETCH</small></a><button type="button" data-search aria-label="検索を開く">⌕</button></div>'+
 '<div class="era-hero-copy"><div class="era-eyebrow"><span class="era-eyebrow-dot"></span> FIRST ARCHIVE / 001 · JAPANESE HIPHOP</div>'+
 '<h1>Watson<span class="era-title-dot">.</span></h1>'+
 '<p class="era-hero-sub">音楽で辿る、ひとりの歩み。</p>'+
 '<p class="era-hero-lead">曲、出来事、言葉、そして時代。<br>ひとりのアーティストを軸に、音楽の奥にある文脈を掘る。</p>'+
 '<div class="era-hero-meta"><span>2021 — 2026</span><span>7 RELEASES / 71 TRACKS</span></div></div>'+
 '<div class="era-hero-quote">“ 音楽だけじゃなく、<br>その時代の空気ごと知りたい。”<small>— DIGCIPHER EDITORIAL</small></div>'+
 '</header>'+
 '<nav class="era-artist-tabs" aria-label="Watsonの探索メニュー"><a href="#/artist/watson">Overview</a><a class="active" href="#/era" aria-current="page">Era Trace</a><a href="#/artist/watson">Discography</a><a href="#/artists">People</a><a href="#/discover">Words</a><a href="#/dig/awa-tokushima">Deep Dig</a></nav>'+
 '<div class="era-timeline-block"><div class="era-section-header"><div><span class="era-section-index">01 / THE ARCHIVE</span><div class="era-section-title-row"><h2>ERA TRACE</h2><p>楽曲・出来事・時代から、アーティストの歩みを辿る。</p></div></div><div class="era-filters" role="group" aria-label="年表フィルター">'+
 ['ALL','MUSIC','ARTIST','CULTURE'].map(k=>'<button type="button" data-era-filter="'+k+'" aria-pressed="'+(state.filter===k)+'" class="'+(state.filter===k?'is-selected':'')+'">'+(k==="ALL"?'すべて':k)+'</button>').join('')+'</div></div>'+
 '<div class="era-timeline-tip"><span><i class="era-dot era-dot-music"></i>MUSIC</span><span><i class="era-dot era-dot-artist"></i>ARTIST</span><span><i class="era-dot era-dot-culture"></i>CULTURE / DIG</span><small>← 横にスクロールして探索 →</small></div>'+
 '<div class="era-timeline-scroll" id="eraTimeline" tabindex="0" aria-label="2021年から2026年までの楽曲年表"><div class="era-timeline-columns" id="eraColumns">'+columns()+'</div></div>'+
 '<div class="era-index-foot"><span><b id="eraSelectedLabel">'+state.year+'</b> / SELECTED YEAR</span><span>収録データに基づく年表 · 出来事は出典確認後に掲載</span></div>'+
 '</div>'+strip()+
 '<footer class="era-foot"><span>DIGCIPHER © WAXETCH</span><a href="about.html">ABOUT ↗</a><a href="waxetch.html">WAXETCH ↗</a><span>ARCHIVE, NOT ALGORITHM.</span></footer>'+
 '</div>'+
 '<aside class="era-detail" id="eraDetail" aria-live="polite">'+eraDetail()+'</aside>'+
 '</div>';
}
function select(year,release){
 state.year=year;
 const rs=releasesOf(year);
 state.release=release || (rs.length?rs[rs.length-1].slug:null);
}
function bind(){
 const root=document.getElementById("eraApp");
 if(!root)return;
 root.addEventListener("click",event=>{
  const filter=event.target.closest("[data-era-filter]");
  if(filter&&root.contains(filter)){
   state.filter=filter.dataset.eraFilter;
   refresh(root);
   return;
  }
  const year=event.target.closest("[data-era-year]");
  if(year&&root.contains(year)){
   select(Number(year.dataset.eraYear));
   refresh(root);
   if(window.matchMedia("(max-width: 750px)").matches){
    const panel=root.querySelector("#eraDetail");
    panel?.scrollIntoView({behavior:"smooth",block:"start"});
   }
   return;
  }
  const release=event.target.closest("[data-era-release]");
  if(release&&root.contains(release)){
   const r=releaseBySlug(release.dataset.eraRelease);
   if(!r)return;
   select(Number(r.date.slice(0,4)),r.slug);
   refresh(root);
   if(window.matchMedia("(max-width: 750px)").matches){
    root.querySelector("#eraDetail")?.scrollIntoView({behavior:"smooth",block:"start"});
   }
  }
 });
}
function refresh(root){
 const scroll=root.querySelector("#eraTimeline"),left=scroll?.scrollLeft??0;
 const cols=root.querySelector("#eraColumns");
 if(cols)cols.innerHTML=columns();
 if(scroll)scroll.scrollLeft=left;
 const detail=root.querySelector("#eraDetail");
 if(detail)detail.innerHTML=eraDetail();
 const label=root.querySelector("#eraSelectedLabel");
 if(label)label.textContent=String(state.year);
 root.querySelectorAll("[data-era-filter]").forEach(b=>{const on=b.dataset.eraFilter===state.filter;b.setAttribute("aria-pressed",String(on));b.classList.toggle("is-selected",on)});
}
window.DIGCIPHER_ERA={render,bind};
})();