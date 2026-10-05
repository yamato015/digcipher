# DIGCIPHER — Project context

最終整理日: 2026-10-05（日本時間）
開発基点: `b51277e69624e015944eb564278f983e6e8d0671`。現在の実装はこの文書と同じブランチのコードを参照。
正本: https://github.com/yamato015/digcipher

## ブランドと目的
WAXETCH は音楽文化・記録・発見を扱う親ブランド。DIGCIPHER は日本語 HIPHOP の言葉、曲、人物、背景、関係を辿る知識プロダクト。「知るほど、もっと深くハマる。」を体験にする。

Watson は FIRST ARCHIVE — 001。最初の深掘り対象であり、製品全体の対象を Watson に限定しない。他アーティストやシーンへの展開を想定する。

## UX とデザイン
Search は気になった語や作品から入る入口、Discover は検索語がなくても入れる入口。探索の方向は WORD → TRACK → ARTIST → STORY → CONNECTION。ただし STORY 等の全機能が実装済みという意味ではない。

現在はホーム検索、VVS / ICE / WATSON / SOUL QUAKE の検索例、Discover、Watson の START HERE と時系列の作品一覧、曲の FOLLOW THE THREAD がある。モバイル下部ナビは SEARCH / DISCOVER / ARTISTS。

クリーム（#f7f4ed）、黒（#0b0b0b）、ゴールド（#b89355）を軸に、大きい文字、罫線、余白、レコードの抽象表現を使う。既存の誌面的なデザインを継承する。サイトの説明とブランドページは about.html / waxetch.html。

## コンテンツ方針
FACT は確認できる日付、収録、曲順、時間、客演など。INTERPRETATION は根拠を踏まえた編集解説。意味的な関係や人物背景を推測で補完しない。項目ごとの出典・確認状態を固定 DB に保存し、曲・語句・作品の画面に表示する。未照合のデータは確認中として区別する。

未許諾の歌詞全文、音源、ジャケットは扱わない。現在は歌詞本文を保存しない。固定 DB に編集済み情報を蓄積し、閲覧時の AI API 生成を導入しない。

## 現在の実装
| ファイル | 役割 |
| --- | --- |
| index.html | アプリの枠、検索オーバーレイ、ナビ、スクリプト読み込み |
| app.js | ハッシュルーティング、画面生成、検索 UI、出典表示、表示アニメーション |
| core.js | 検索索引、表記の正規化、DB の参照処理、項目ごとの出典判定 |
| data.js | window.DIGCIPHER_DATA の固定データ |
| styles.css | 共通デザインとモバイル対応 |
| about.html / waxetch.html | 製品コンセプト / 親ブランド |
| assets/*.svg | DIGCIPHER / WAXETCH のロゴ |
| .github/workflows/pages.yml | main push / 手動実行による Pages 公開 |
| .nojekyll | 静的配信向けファイル |
| scripts/check-data.cjs / tests/core.test.cjs | DB 整合性検証 / 検索と出典判定のテスト |
| .github/workflows/checks.yml | push / PR の構文・データ・検索テスト |

ビルド工程、package.json、API、認証、サーバー DB はない。データはブラウザに読み込んで検索する。NFKC・小文字化・カナの統一・空白と記号の除去、読みや aliases、作品所有者・客演の文脈を検索に利用する。複数語は全語一致で、完全一致を先に表示する。検索カテゴリで絞り込み、全件数と12件ずつの追加表示を分ける。検索はダイアログ内でフォーカスを保持し、Escape で元の操作位置に復帰する。

ルート: `#/`、`#/discover`、`#/artists`、`#/artist/<slug>`、`#/release/<slug>`、`#/track/<encoded-id>`、`#/term/<slug>`。track ID は encodeURIComponent を使う。実在しない対象は NOT FOUND。

## 固定 DB の形
- artists: name, slug, aliases, archive_status。
- releases: title, date（YYYY-MM-DD）, slug, track_count, artist（artist slug）, aliases, evidence。
- tracks: id, title, release（release slug）, n（曲順）, dur（秒）, date, features（アーティスト名配列）, evidence。
- terms: id（term:<slug>）, term, reading, category, short_definition, long_definition（編集メモ）, fact_status（旧互換）, aliases, evidence, 任意の fact_detail。
- sources: id, title, publisher, url, type, rights。evidence は source_id / fields / checked_on / checked_by。詳しくは CONTENT_MODEL.md。
- 現状の収録は artists 22 件、releases 7 件、tracks 71 件、terms 4 件。現在の作品所有者は Watson。作品・曲の所有者導線は参照から表示し、他アーティストの作品追加にも対応する。
- 語句の fact_status は general_knowledge / editorial_brand_note。出典による検証完了を意味しない。

## 現在の確認範囲と限界
- VVS / ICE の一般定義は GIA / Merriam-Webster で確認。Soul Quake 3 の作品情報と10曲の項目は Apple Music / Spotify のカタログで確認し、対象フィールド・日付・確認者を記録した。Codex による確認であり、人間による編集レビュー完了を意味しない。
- 他の6作品と曲のメタデータ、cypher / crate digging の一般定義は出典確認中。旧 fact_status だけでは検証済みと判定しない。
- 曲の解説は整備中。語句から曲への用法対応付けも未実装。語句の一般定義と編集メモは FACT / INTERPRETATION に分離して表示する。
- CONNECTED INDEX は収録済みの客演から参加曲へ進める入口。独立したフルアーカイブがあるわけではない。各接続には確認状態を表示する。
- トップの FIRST ARCHIVE は Watson を入口とする編集方針。作品・曲画面の所有者と件数は DB の参照から計算する。
- styles.css の古い未収録 JPG 参照は後段の SVG / CSS 背景指定で上書きされる。これを理由に無断素材を追加しない。配信アセット版は HTML の ?v=2。
- Pages の配信対象は _site にコピーしたサイト用ファイルのみ。文書やテストは GitHub 上で読む。
- 2026-10-04 に run 37195103223 の失敗ログを確認。Pages サイト未作成、初回作成は Resource not accessible by integration。GitHub 側の初回設定が必要で、公開成功は未確認。

## 今後の継続
GitHub のコミット・PR・Issue とこれらの文書に決定を残す。チャット履歴は補助資料。作業前に最新ブランチを確認し、実装が変わったら関連する文書も更新する。実施順と受け入れ条件は ROADMAP.md を参照する。
