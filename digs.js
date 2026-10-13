/**
 * DIGCIPHER EDITORIAL DIGS — sourced facts and separate reading prompts.
 * Facts have source IDs; interpretations only point to facts. No lyrics/audio/artwork.
 * Add an entry only after inspecting its supporting sources.
 */
window.DIGCIPHER_DIGS = {
  version: 1,
  reviewed_on: "2026-10-13",
  sources: [
    {id:"amazon-soulquake2", type:"music_catalog", publisher:"Amazon Music", title:"Watson — Soul Quake 2 / tracklist", url:"https://music.amazon.co.jp/albums/B0GN69286M", checked_on:"2026-10-13"},
    {id:"tokushima-dialect", type:"government_context", publisher:"徳島県移住交流促進センター", title:"移住なんでも相談室① — 徳島の方言（阿波弁）", url:"https://iju.pref.tokushima.lg.jp/news/4318/", checked_on:"2026-10-13"},
    {id:"watson-awaben-mv", type:"artist_primary", publisher:"Watson Official Artist Channel", title:"Watson — 阿波弁 (Official Video)", url:"https://www.youtube.com/watch?v=LC2ccvykRRU", checked_on:"2026-10-13"}
  ],
  facts: [
    {id:"sq2-release", statement:"Watson『Soul Quake 2』は2024年11月1日発売の10曲入り作品として掲載されている。", sources:["amazon-soulquake2"], verification:"externally_sourced"},
    {id:"sq2-awaben", statement:"『Soul Quake 2』には7曲目に『阿波弁』が収録されている。", sources:["amazon-soulquake2"], verification:"externally_sourced", entity:{type:"track",release:"soul-quake-2",title:"阿波弁"}},
    {id:"sq2-tokushima", statement:"同じ作品の10曲目は『TOKUSHIMA』。", sources:["amazon-soulquake2"], verification:"externally_sourced", entity:{type:"track",release:"soul-quake-2",title:"TOKUSHIMA"}},
    {id:"awaben-local", statement:"徳島県の公式移住情報サイトは、阿波弁を『徳島県の方言』として紹介している。", sources:["tokushima-dialect"], verification:"externally_sourced"},
    {id:"awaben-mv", statement:"『阿波弁』の公式ミュージックビデオがWatsonの公式アーティストチャンネルに公開されている。", sources:["watson-awaben-mv"], verification:"externally_sourced"}
  ],
  readings: [
    {id:"sq2-locality", headline:"同じアルバムの中に、地元の『言葉』と『地名』が並ぶ。", body:"『阿波弁』と『TOKUSHIMA』という曲名を並べると、地元を手がかりに作品を聴き比べる入口が見えてくる。これはDIGCIPHERによるタイトルと地域資料に基づく編集上の着眼点であり、本人の制作意図や歌詞全体の意味を確定するものではない。", based_on:["sq2-awaben","sq2-tokushima","awaben-local"], status:"EDITORIAL INTERPRETATION", confidence:"interpretive", limit:"曲名からの観察。歌詞・本人発言・制作意図については未検証。"}
  ],
  trails: [
    {slug:"awa-tokushima", kind:"PLACE / LANGUAGE", title:"『阿波弁』から『TOKUSHIMA』へ。", hook:"曲名に現れる地元の言葉と地名。2曲をつなぐのは、制作クレジットだけではない。", duration:"2 MIN", release:"soul-quake-2", fact_ids:["sq2-release","sq2-awaben","sq2-tokushima","awaben-local","awaben-mv"], reading_ids:["sq2-locality"], track_titles:["阿波弁","TOKUSHIMA"], path_reason:"同一作品に収録され、片方は地域の方言、もう片方は地名を曲名にしているため。関係はタイトルと公的資料に基づく編集上の選定。", question:"2曲を聴き比べたとき、言葉の使い方や地元の描き方にどんな違いを感じるだろう？"}
  ]
};