# DIGCIPHER — Project context

最終整理日: 2026-10-04（日本時間）
コード確認基点: `ddf69a1414b1fdfee696ede45c7e9a501f94f92a`
正本: https://github.com/yamato015/digcipher

## ブランドと目的
WAXETCH は音楽文化・記録・発見を扱う親ブランド。PROJECT 001 は DIGCIPHER（日本語 HIPHOP）。次の領域として PROJECT 002 / CLASSICAL を研究テーマに置く。クラシック側の名称・仕様は未決定であり、DIGCIPHER をそのまま転用する前提にはしない。DIGCIPHER は日本語 HIPHOP の言葉、曲、人物、背景、関係を辿る知識プロダクト。「知るほど、もっと深くハマる。」を体験にする。

Watson は FIRST ARCHIVE — 001。最初の深掘り対象であり、製品全体の対象を Watson に限定しない。他アーティストやシーンへの展開を想定する。

## UX とデザイン
ERA TRACE は一人のアーティストから時代と作品を辿るトップ入口。Search は気になった語や作品から入る入口、Discover は検索語がなくても入れる補助入口。探索の方向は ARTIST → ERA → RELEASE / TRACK → DEEP DIG → CONTEXT。ただし STORY 等の全機能が実装済みという意味ではない。

現在のホームはダークテーマのERA TRACE。左ナビ、2021〜2026の収録済み7作品を並べた年表、MUSIC/ARTIST/CULTUREのフィルター、選択年・作品に応じる詳細パネル、関連した出典付きCURATED DIGの導線がある。モバイルでは年代を横スクロールでき、詳細は下段に表示。Search、Discover、Watson の START HERE と作品一覧、曲の CONTEXT TRACE / FOLLOW THE THREAD も維持している。CONTEXT TRACE は制作クレジット網そのものではなく、曲を理解する周辺文脈を辿るためのUI。現時点では TRACK / RELEASE / ARTIST / CREDIT の確認可能な接続だけを表示し、WORD / PLACE / EVENT は根拠データがある場合だけ追加する。モバイル下部ナビは SEARCH / DISCOVER / ARTISTS。

DIGCIPHERは黒〜チャコールと暖色のアクセント、セリフ書体の見出し、罫線、オリジナルのSVG夜景と抽象的なアルバムカードを使用。WAXETCHブランドページは従来のクリーム主体を維持。サイトの説明とブランドページは about.html / waxetch.html。

## コンテンツ方針
FACT は確認できる日付、収録、曲順、時間、客演など。INTERPRETATION は根拠を踏まえた編集解説。意味的な関係や人物背景を推測で補完しない。出典と確認状態を明示する方針だが、その管理・表示は未完成。

未許諾の歌詞全文、音源、ジャケットは扱わない。現在は歌詞本文を保存しない。固定 DB に編集済み情報を蓄積し、閲覧時の AI API 生成を導入しない。

## 現在の実装
| ファイル | 役割 |
| --- | --- |
| index.html | 共通サイドバー、検索、モバイルナビ、スクリプト読み込み |
| app.js | ハッシュルーティング、曲・作品・人物・語句ページ、検索 |
| data.js | window.DIGCIPHER_DATA の固定カタログ（全件の外部照合は未完了） |
| digs.js | 根拠付きDIGの出典、FACT、INTERPRETATION、探索経路 |
| era.js / era.css | 年表UI、フィルター・年/作品選択、ダークデザイン |
| assets/era-night.svg | オリジナルのシネマティック背景。写真やジャケットの無断転載なし |
| styles.css | 共通デザインとモバイル対応 |
| about.html / waxetch.html | 製品コンセプト / 親ブランド |
| assets/*.svg | DIGCIPHER / WAXETCH のロゴ |
| .github/workflows/pages.yml | main push / 手動実行による Pages 公開 |
| .nojekyll | 静的配信向けファイル |

ビルド工程、package.json、API、認証、サーバー DB、自動テスト基盤はない。データはブラウザに読み込んで検索する。正規化は NFKC・小文字化・前後空白除去、部分一致。検索件数にはカテゴリ別上限がある。

ルート: `#/`（ERA TRACE）、`#/era`（ERA TRACE）、`#/dig/awa-tokushima`、`#/discover`、`#/artists`、`#/artist/<slug>`、`#/release/<slug>`、`#/track/<encoded-id>`、`#/term/<slug>`。track ID は encodeURIComponent を使う。実在しない対象は NOT FOUND。

## 固定 DB の形
- artists: name, slug。
- releases: title, date（YYYY-MM-DD）, slug, track_count。
- tracks: id, title, release（release slug）, n（曲順）, dur（秒）, date, features（アーティスト名配列）。
- terms: id（term:<slug>）, term, reading, category, short_definition, long_definition, fact_status。
- 現状の収録は artists 22 件、releases 7 件、tracks 71 件、terms 4 件。作品・曲は Watson を前提に実装されている。
- 語句の fact_status は general_knowledge / editorial_brand_note。出典による検証完了を意味しない。

## 引き継ぎ時点の限界
- 既存 DB に出典 URL、確認日、確認者、権利情報を管理する共通スキーマはない。画面の Verified metadata という文言だけで各項目の検証完了を判断しない。この引き継ぎでは音楽情報の外部照合はしていない。
- 曲の INTERPRETATION は Editorial pending。語句から曲への対応付けも整備中。ブランド解説を含む語句の MEANING / CONTEXT は FACT / INTERPRETATION の統一表示に未対応。
- 複数アーティストの作品所有者を表すフィールドはない。app.js の作品・曲画面に Watson 固定の導線があり、7作品・71曲も一部で固定表示。他アーティスト展開前に対応が必要。
- CONNECTED INDEX は客演からの接続。独立したフルアーカイブがあるわけではない。
- styles.css に未収録 JPG の古い参照が残るが、後段の SVG / CSS 背景指定が上書きする。これを理由に無断素材を追加しない。
- 2026-10-04 に確認した直近の Pages run（2026-09-18、#9）は failure。公開成功と初回有効化の完了は未確認。過去チャットでは Resource not accessible by integration が報告されているが、現在の失敗原因は別途ログ確認が必要。

## 今後の継続
GitHub のコミット・PR・Issue とこれらの文書に決定を残す。チャット履歴は補助資料。作業前に最新ブランチを確認し、実装が変わったら関連する文書も更新する。実施順と受け入れ条件は ROADMAP.md を参照する。
