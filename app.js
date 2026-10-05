(() => {
  'use strict';
  const D = window.DIGCIPHER_DATA, C = window.DIGCIPHER_CORE.createCatalog(D);
  const A = document.getElementById('app'), O = document.getElementById('searchOverlay');
  const I = document.getElementById('searchInput'), RS = document.getElementById('searchResults');
  const filters = document.getElementById('searchFilters'), counts = document.getElementById('searchCount');
  const types = { artists: 'ARTISTS', releases: 'RELEASES', tracks: 'TRACKS', terms: 'WORDS' };
  const fields = { title: 'タイトル', artist: 'アーティスト', date: '日付', track_count: '曲数', release: '収録作品',
    n: '曲順', dur: '時間', features: '客演', short_definition: '一般定義', fact_detail: '定義の補足' };
  const e = value => String(value ?? '').replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const tm = seconds => Math.floor(seconds / 60) + ':' + String(seconds % 60).padStart(2, '0');
  const ha = a => '#/artist/' + encodeURIComponent(a.slug), hr = r => '#/release/' + encodeURIComponent(r.slug);
  const ht = t => '#/track/' + encodeURIComponent(t.id), hw = t => '#/term/' + encodeURIComponent(t.id.slice(5));
  const L = (href, title, meta) => '<a href="' + e(href) + '"><strong>' + e(title) + '</strong><small>' + e(meta) + ' →</small></a>';
  const F = content => content + '<footer class="footer"><div class="shell footer-inner"><p>DIGCIPHER is a WAXETCH project. 権利処理のない歌詞全文・音源・アートワークは掲載しません。</p><div><a href="about.html">ABOUT</a> &nbsp; <a href="waxetch.html">WAXETCH</a></div></div></footer>';
  const di = (i, title, text, href, type) => '<a class="dig-item" href="' + e(href) + '"><span class="dig-no">' + e(i) +
    '</span><div><strong>' + e(title) + '</strong><p>' + e(text) + '</p></div><span class="dig-type">' + e(type) + ' →</span></a>';
  const head = (index, title, text = '') => '<div class="section-head"><div class="section-index">' + e(index) +
    '</div><div><h2>' + title + '</h2>' + (text ? '<p>' + e(text) + '</p>' : '') + '</div></div>';
  const badge = (item, field) => '<span class="verification ' + (C.verified(item, field) ? 'verified' : '') + '">' +
    (C.verified(item, field) ? '出典確認済み' : '確認中') + '</span>';
  const fact = (item, field, value) => '<div class="fact"><b>' + e(fields[field]) + '</b><span>' + e(value) + ' ' + badge(item, field) + '</span></div>';
  const creditState = tracks => tracks.length && tracks.every(t => C.verified(t, 'features')) ? '客演 · 出典確認済み' : '客演データ · 一部確認中';
  const first = () => D.artists.find(a => a.archive_status === 'first');

  function sources(item) {
    const refs = C.evidence(item);
    if (!refs.length) return '<div class="source-note"><p>出典は確認中です。確認できた項目から根拠を公開します。</p></div>';
    return '<details class="source-note"><summary>出典を見る · ' + new Set(refs.map(r => r.source_id)).size + '</summary><ul>' +
      refs.map(ref => {
        const source = C.sources.get(ref.source_id);
        return '<li><a target="_blank" rel="noopener noreferrer" href="' + e(source.url) + '">' + e(source.publisher + ' — ' + source.title) +
          ' ↗</a><p>' + e(ref.fields.map(f => fields[f] || f).join(' / ')) + ' · 確認 ' + e(ref.checked_on) + '</p></li>';
      }).join('') + '</ul></details>';
  }
  function archiveRows(releases) {
    return releases.map(r => '<a class="archive-row" href="' + hr(r) + '"><span class="year">' + e(r.date.slice(0, 4)) +
      '</span><strong>' + e(r.title) + '</strong><span>' + C.orderedTracks(r.slug).length + ' TRACKS →</span></a>').join('');
  }
  function trackRows(tracks) {
    return tracks.map((t, i) => di(String(i + 1).padStart(2, '0'), t.title, C.releases.get(t.release).title +
      ' · ' + creditState([t]), ht(t), 'TRACK')).join('');
  }
  function home(){const a=first(),releases=C.artistReleases(a.slug),tracks=releases.flatMap(r=>C.orderedTracks(r.slug));return F('<section class="hero shell reveal"><div class="brand-word">DIGCIPHER</div><div class="kicker">JAPANESE HIPHOP KNOWLEDGE NETWORK</div><h1>日本語HIPHOPを、<br>言葉から人生まで掘る。</h1><p class="lead">気になった一語から、曲、人物、出来事、過去曲、そのラッパーの背景まで。検索して終わらず、次の発見へつながる。</p><form class="search-bar" id="homeSearchForm" role="search"><label class="sr-only" for="homeSearch">曲・アーティスト・言葉を検索</label><input id="homeSearch" placeholder="曲・アーティスト・言葉を検索"><button id="homeSearchBtn" aria-label="検索する">↗</button></form><div class="try-row"><span>TRY:</span><button class="chip q" data-q="VVS">VVS</button><button class="chip q" data-q="ICE">ICE</button><button class="chip q" data-q="WATSON">WATSON</button><button class="chip q" data-q="SOUL QUAKE">SOUL QUAKE</button></div><div class="hero-art"><div class="record"></div><div class="note">DIG / LISTEN / TRACE / CONNECT</div></div></section><section class="section shell reveal"><div class="section-head"><div class="section-index">FEATURED / 001</div><div><h2>FIRST ARCHIVE</h2><p>最初の深掘り対象はWatson。現在は'+releases.length+'作品・'+tracks.length+'曲の基本メタデータと客演クレジットを収録し、背景情報を段階的に整備しています。</p></div></div><div class="feature-row"><div><div class="kicker">ARTIST</div><div class="feature-title">WATSON</div><a class="chip" href="#/artist/watson">EXPLORE ARCHIVE →</a></div><div class="stat-stack"><div class="stat"><b>'+releases.length+'</b><span>RELEASES</span></div><div class="stat"><b>'+tracks.length+'</b><span>TRACKS</span></div><div class="stat"><b>'+new Set(tracks.flatMap(x=>x.features)).size+'</b><span>CONNECTED ARTISTS</span></div></div></div></section><section class="section shell reveal"><div class="section-head"><div class="section-index">DISCOVER</div><div><h2>Latest digs.</h2><p>いまあるデータから、まず掘れる入口。意味を知り、次の言葉やアーティストへ進む。</p></div></div><div class="dig-list">'+di('01','VVS','ダイヤモンドの等級。一般的な意味を出典から確かめる。','#/term/vvs','WORD')+di('02','ICE','ダイヤやジュエリーを指すことがあるHIPHOPスラング。','#/term/ice','WORD')+di('03','WATSON',''+releases.length+'作品・'+tracks.length+'曲から年代順に辿るFIRST ARCHIVE。','#/artist/watson','ARTIST')+'</div></section>')}

  function discover() {
    const a = first(), releases = C.artistReleases(a.slug), newest = releases.at(-1);
    const featured = D.artists.filter(x => C.credits(x.slug).some(t => t.release === newest.slug)).slice(0, 6);
    return F('<section class="page-hero shell"><div class="crumbs"><a href="#/">HOME</a> / DISCOVER</div><h1 class="page-title">DISCOVER</h1>' +
      '<p class="page-sub">検索語がなくても大丈夫。言葉、年代、客演。気になる入口から掘ってみる。</p></section>' +
      '<section class="section shell">' + head('01 / WORDS', '一語から、<br>深く。', 'まず一般的な意味を知る。曲ごとの読み解きは、根拠と分けて扱います。') +
      '<div class="dig-list">' + D.terms.map((t, i) => di(String(i + 1).padStart(2, '0'), t.term, t.short_definition, hw(t),
        C.verified(t, 'short_definition') ? 'SOURCED WORD' : 'WORD')).join('') + '</div></section>' +
      '<section class="section shell">' + head('02 / FIRST ARCHIVE', '年代で、<br>辿る。', a.name + 'の公開アーカイブ。ここからHIPHOPの人物とシーンへ広げます。') +
      '<div class="archive">' + archiveRows(releases) + '</div></section>' +
      '<section class="section shell">' + head('03 / CONNECTIONS', '客演から、<br>次の一人へ。', newest.title + 'のクレジットを入口に、参加曲と収録作品を辿る。') +
      '<div class="artist-grid">' + featured.map(x => '<a class="artist-card" href="' + ha(x) + '"><span class="badge">CONNECTED INDEX</span><br><strong>' +
        e(x.name) + '</strong><p>' + C.credits(x.slug).filter(t => t.release === newest.slug).map(t => e(t.title)).join(' / ') + '</p></a>').join('') + '</div></section>');
  }
  function artists() {
    return F('<section class="page-hero shell"><div class="crumbs"><a href="#/">HOME</a> / ARTISTS</div><h1 class="page-title">ARTISTS</h1>' +
      '<p class="page-sub">FIRST ARCHIVEと、客演データを入口にしたCONNECTED INDEX。名前から参加曲へ。</p></section><section class="section shell"><div class="artist-grid">' +
      D.artists.map(a => {
        const releases = C.artistReleases(a.slug), credits = C.credits(a.slug);
        const meta = releases.length ? releases.length + '作品 / ' + releases.flatMap(r => C.orderedTracks(r.slug)).length + '曲' :
          credits.length + '参加曲 · ' + creditState(credits);
        return '<a class="artist-card" href="' + ha(a) + '"><span class="badge">' +
          (a.archive_status === 'first' ? 'FIRST ARCHIVE' : 'CONNECTED INDEX') + '</span><br><strong>' + e(a.name) + '</strong><p>' + e(meta) + '</p></a>';
      }).join('') + '</div></section>');
  }
  function artist(slug) {
    const a = C.artists.get(slug);
    if (!a) return nf();
    const releases = C.artistReleases(slug), credits = C.credits(slug), tracks = releases.flatMap(r => C.orderedTracks(r.slug));
    let content = '<section class="page-hero shell"><div class="crumbs"><a href="#/artists">ARTISTS</a> / ' +
      (a.archive_status === 'first' ? 'FIRST ARCHIVE' : 'CONNECTED INDEX') + '</div><div class="kicker">' +
      (a.archive_status === 'first' ? 'FIRST ARCHIVE — 001' : 'CONNECTED INDEX') + '</div><h1 class="page-title">' + e(a.name) + '</h1><p class="page-sub">' +
      (releases.length ? '公開アーカイブは' + releases.length + '作品・' + tracks.length + '曲。歌詞本文は保存せず、メタデータと編集解説を分けて管理します。' :
        '収録済みの客演データから、参加曲へ辿れます。独立した作品アーカイブは整備中です。') + '</p></section>';
    if (releases.length) {
      const starts = [...new Set([releases[0], releases.find(r => r.slug === 'soul-quake'), releases.at(-1)].filter(Boolean))];
      content += '<section class="section shell">' + head('START HERE', '年代順に、<br>変化を辿る。', '公開中のアーカイブを時系列で見る入口です。') +
        '<div class="dig-list">' + starts.map((r, i) => di(String(i + 1).padStart(2, '0'), r.title, r.date, hr(r), 'RELEASE')).join('') + '</div></section>' +
        '<section class="section shell">' + head('DISCOGRAPHY', releases.length + ' releases.<br>' + tracks.length + ' tracks.') +
        '<div class="archive">' + archiveRows(releases) + '</div></section>';
      const connected = [...new Set(tracks.flatMap(t => t.features))].map(name => C.names.get(name)).filter(Boolean);
      content += '<section class="section shell">' + head('CONNECTIONS', 'Connected artists.', '客演データから辿る接続。各ページで参加曲と確認状態を見られます。') +
        '<div class="thread">' + connected.map(x => L(ha(x), x.name, creditState(tracks.filter(t => t.features.includes(x.name))))).join('') + '</div></section>';
    }
    if (credits.length) content += '<section class="section shell">' + head('CREDITED TRACKS', '参加曲から、<br>掘り直す。', creditState(credits) + '。人物像や曲の意味は、クレジットだけから推測しません。') +
      '<div class="dig-list">' + trackRows(credits) + '</div></section>';
    return F(content);
  }
  function release(slug) {
    const r = C.releases.get(slug);
    if (!r) return nf();
    const a = C.artists.get(r.artist), tracks = C.orderedTracks(slug);
    return F('<section class="page-hero shell"><div class="crumbs"><a href="' + ha(a) + '">' + e(a.name) +
      '</a> / RELEASE</div><h1 class="page-title">' + e(r.title) + '</h1><p class="page-sub">' + e(a.name) + ' · ' + tracks.length +
      ' tracks. 作品から曲へ、曲から客演へ。</p><div class="facts">' + fact(r, 'date', r.date) + fact(r, 'track_count', tracks.length + '曲') +
      '</div>' + sources(r) + '</section><section class="section shell"><div class="archive">' +
      tracks.map(t => '<a class="archive-row" href="' + ht(t) + '"><span class="year">' + String(t.n).padStart(2, '0') +
        '</span><strong>' + e(t.title) + '</strong><span>' + tm(t.dur) + ' →</span></a>').join('') + '</div></section>');
  }
  function track(id) {
    const t = C.tracks.get(id);
    if (!t) return nf();
    const r = C.releases.get(t.release), a = C.artists.get(r.artist), list = C.orderedTracks(r.slug), index = list.findIndex(x => x.id === id);
    const verifiedCount = ['title', 'release', 'date', 'n', 'dur', 'features'].filter(field => C.verified(t, field)).length;
    return F('<section class="page-hero shell"><div class="crumbs"><a href="' + ha(a) + '">' + e(a.name) +
      '</a> / <a href="' + hr(r) + '">' + e(r.title) + '</a> / TRACK ' + t.n + '</div><h1 class="page-title">' + e(t.title) +
      '</h1><p class="page-sub">事実を確かめてから、背景を読み解く。</p><div class="facts">' +
      fact(t, 'title', t.title) + fact(t, 'release', r.title) + fact(t, 'date', t.date) + fact(t, 'n', t.n) +
      fact(t, 'dur', tm(t.dur)) + fact(t, 'features', t.features.join(' / ') || '客演表記なし') + '</div>' + sources(t) +
      '</section><section class="section shell"><div class="split"><div class="panel"><div class="label">FACT</div><h3>' +
      (verifiedCount === 6 ? '事実を、<br>確かめる。' : '確認中の、<br>メタデータ。') + '</h3><p>' + verifiedCount +
      ' / 6 項目の出典を確認済み。確認中の項目は検証済みの事実として扱いません。</p></div><div class="panel"><div class="label">INTERPRETATION</div>' +
      '<h3>背景を、<br>読み解く。</h3><p>曲の意味、背景、過去曲との関係は根拠確認後に追加します。未確認の内容を推測で埋めません。</p></div></div></section>' +
      '<section class="section shell">' + head('FOLLOW THE THREAD', '次に掘る。', '同じ作品、客演、アーティスト。関係の種類と確認状態を添えて辿れます。') +
      '<div class="thread">' + L(hr(r), r.title, '同じ収録作品 · ' + (C.verified(t, 'release') ? '出典確認済み' : '確認中')) +
      t.features.map(name => C.names.has(name) ? L(ha(C.names.get(name)), name, creditState([t])) : '').join('') + L(ha(a), a.name, 'ARTIST ARCHIVE') +
      '</div><nav class="track-pagination" aria-label="作品内の曲を移動">' +
      (list[index - 1] ? L(ht(list[index - 1]), list[index - 1].title, '前の曲') : '<span></span>') +
      (list[index + 1] ? L(ht(list[index + 1]), list[index + 1].title, '次の曲') : '<span></span>') + '</nav></section>');
  }
  function term(slug) {
    const t = C.terms.get('term:' + slug);
    if (!t) return nf();
    return F('<section class="page-hero shell"><div class="crumbs"><a href="#/discover">DISCOVER</a> / WORD</div><div class="kicker">' +
      e(t.category) + '</div><h1 class="page-title">' + e(t.term) + '</h1><p class="page-sub">' + e(t.reading) +
      '</p></section><section class="section shell"><div class="split"><div class="panel"><div class="label">FACT · 一般的な意味</div>' +
      badge(t, 'short_definition') + '<h3 class="definition-title">' + e(t.short_definition) + '</h3>' + (t.fact_detail ? '<p>' + e(t.fact_detail) + '</p>' : '') + sources(t) +
      '</div><div class="panel"><div class="label">INTERPRETATION · 編集メモ</div><h3>曲の意味は、<br>文脈から。</h3><p>' + e(t.long_definition) +
      '</p><p class="editorial-note">この編集メモは、特定の曲やアーティストの意図を断定するものではありません。</p></div></div></section>' +
      '<section class="section shell">' + head('FOLLOW THE THREAD', '次の言葉へ。', '語句と曲の対応付けは確認中。ここでは別の言葉を掘る入口を紹介します。') +
      '<div class="thread">' + D.terms.filter(x => x.id !== t.id).map(x => L(hw(x), x.term, '別の言葉を掘る')).join('') + L('#/discover', 'DISCOVER', '入口を探す') + '</div></section>');
  }
  function nf() {
    return F('<section class="page-hero shell"><div class="kicker">404</div><h1 class="page-title">NOT FOUND</h1><p class="page-sub">この項目は見つかりませんでした。</p>' +
      '<div class="try-row"><a class="chip" href="#/discover">DISCOVER →</a><button class="chip" data-search>検索から探す</button></div></section>');
  }
  let observer;
  function reveal() {
    observer?.disconnect();
    if (!('IntersectionObserver' in window)) { A.querySelectorAll('.reveal').forEach(x => x.classList.add('visible')); return; }
    observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    }), { threshold: .08 });
    A.querySelectorAll('.reveal').forEach(x => observer.observe(x));
  }
  function route() {
    if (O.classList.contains('open')) close(false);
    const raw = location.hash.replace(/^#\/?/, ''), p = raw.split('/');
    const decoded = window.DIGCIPHER_CORE.decode(p.slice(1).join('/'));
    A.innerHTML = !raw ? home() : p[0] === 'discover' ? discover() : p[0] === 'artists' ? artists() :
      decoded === null ? nf() : p[0] === 'artist' ? artist(decoded) : p[0] === 'release' ? release(decoded) :
      p[0] === 'track' ? track(decoded) : p[0] === 'term' ? term(decoded) : nf();
    document.title = (A.querySelector('h1')?.textContent || 'DIGCIPHER') + ' — DIGCIPHER by WAXETCH';
    bind(); requestAnimationFrame(reveal); scrollTo(0, 0);
    document.getElementById('progress').style.width = '0%';
    const title = A.querySelector('h1');
    title?.setAttribute('tabindex', '-1');
    if (route.started) title?.focus({ preventScroll: true });
    route.started = true;
  }
  let returnFocus, activeType = 'all', shown = 12, results = [];
  const background = [document.querySelector('.site-header'), A, document.querySelector('.bottom-nav')];
  function open(query = '', trigger = document.activeElement) {
    if (!O.classList.contains('open')) returnFocus = trigger;
    activeType = 'all'; shown = 12;
    O.classList.add('open'); O.setAttribute('aria-hidden', 'false');
    background.forEach(element => { element.inert = true; });
    document.body.classList.add('search-open');
    I.value = query; search(); I.focus({ preventScroll: true });
  }
  function close(restore = true) {
    if (!O.classList.contains('open')) return;
    O.classList.remove('open'); O.setAttribute('aria-hidden', 'true');
    background.forEach(element => { element.inert = false; });
    document.body.classList.remove('search-open');
    if (restore && returnFocus?.isConnected) returnFocus.focus({ preventScroll: true });
  }
  function search() {
    const all = C.search(I.value), query = I.value.trim();
    results = activeType === 'all' ? all : all.filter(x => x.type === activeType);
    filters.hidden = !query;
    filters.innerHTML = Object.entries({ all: 'ALL', ...types }).map(([type, label]) => '<button class="search-filter" data-type="' + type +
      '" aria-pressed="' + (type === activeType) + '">' + label + ' <span>' + (type === 'all' ? all.length : all.filter(x => x.type === type).length) + '</span></button>').join('');
    counts.textContent = query ? results.length + '件' + (results.length > shown ? ' · ' + shown + '件表示' : '') : '気になる言葉から探す';
    if (!query) RS.innerHTML = '<div class="result-group"><h4>TRY</h4><div class="try-row">' +
      ['VVS', 'ICE', 'ワトソン', 'SOUL QUAKE'].map(q => '<button class="chip q" data-q="' + e(q) + '">' + e(q) + '</button>').join('') +
      '</div><p class="search-hint">曲名だけでなく、アーティスト・客演・作品名・言葉の読みでも検索できます。</p><a class="search-discover" href="#/discover">DISCOVERから入口を選ぶ →</a></div>';
    else if (!results.length) RS.innerHTML = '<div class="result-group"><h4>NO RESULTS</h4><p>現在の公開アーカイブには一致する項目がありません。</p>' +
      '<p class="search-hint">別の表記や短い言葉で探すか、カテゴリをALLに戻してみてください。</p><a class="search-discover" href="#/discover">DISCOVERへ →</a></div>';
    else RS.innerHTML = '<div class="result-group">' + results.slice(0, shown).map(x => '<a class="result" href="' + e(x.href) +
      '"><div><strong>' + e(x.title) + '</strong><p>' + e(x.meta) + '</p></div><small>' + types[x.type] + ' →</small></a>').join('') +
      (results.length > shown ? '<button class="show-more" id="showMore">さらに表示（残り' + (results.length - shown) + '件）</button>' : '') + '</div>';
  }
  function bind() {
    document.getElementById('homeSearchForm')?.addEventListener('submit', event => {
      event.preventDefault(); open(document.getElementById('homeSearch').value, document.getElementById('homeSearch'));
    });
  }
  document.addEventListener('click', event => {
    const target = event.target, trigger = target.closest('[data-search]'), quick = target.closest('.q');
    if (trigger) open('', trigger);
    else if (quick) {
      if (O.classList.contains('open')) { I.value = quick.dataset.q; activeType = 'all'; shown = 12; search(); I.focus(); }
      else open(quick.dataset.q, quick);
    } else if (target.closest('#searchClose')) close();
    else if (target.closest('[data-type]')) {
      activeType = target.closest('[data-type]').dataset.type; shown = 12; search();
      filters.querySelector('[data-type="' + activeType + '"]')?.focus();
    } else if (target.closest('#showMore')) {
      const previous = shown; shown += 12; search(); RS.querySelectorAll('.result')[previous]?.focus();
    } else if (O.contains(target) && target.closest('a')) {
      const same = target.closest('a').hash === location.hash;
      close(same);
      if (same) A.querySelector('h1')?.focus({ preventScroll: true });
    }
  });
  I.addEventListener('input', () => { shown = 12; search(); });
  I.addEventListener('keydown', event => {
    if (event.key === 'Enter' && !event.isComposing) RS.querySelector('.result')?.click();
    if (event.key === 'ArrowDown' && !event.isComposing) {
      const result = RS.querySelector('.result');
      if (result) { event.preventDefault(); result.focus(); }
    }
  });
  document.addEventListener('keydown', event => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); open(); }
    if (!O.classList.contains('open')) return;
    if (event.key === 'Escape') { event.preventDefault(); close(); }
    if (event.key === 'Tab') {
      const focusable = [...O.querySelectorAll('input, button, a[href]')].filter(x => !x.disabled && x.getClientRects().length);
      const first = focusable[0], last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });
  window.addEventListener('hashchange', route);
  window.addEventListener('scroll', () => {
    document.getElementById('progress').style.width = (scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight) * 100) + '%';
  });
  route();
})();
