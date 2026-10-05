# Codex development instructions

この文書はリポジトリ全体に適用する。作業前に [PROJECT_CONTEXT.md](PROJECT_CONTEXT.md)、[ROADMAP.md](ROADMAP.md)、[README.md](README.md)、データ変更時は [CONTENT_MODEL.md](CONTENT_MODEL.md) と変更対象の実装を読む。ユーザーの最新の明示指示を優先する。

## 維持するプロダクト方針
- WAXETCH は親ブランド。DIGCIPHER はその HIPHOP 知識プロダクト。
- Watson は FIRST ARCHIVE。Watson 専用サイトへ変更しない。
- UX の主入口は Search / Discover。機能一覧やアーティスト一覧をトップの主役にしない。検索後の次の発見と FOLLOW THE THREAD を維持する。
- FACT（裏付けのある事実）と INTERPRETATION（編集上の読み解き）を分離する。未確認の内容を断定せず、空欄・整備中を許容する。
- 未許諾の歌詞全文・音源・ジャケットを取得、保存、掲載しない。歌詞スクレイピングを追加しない。
- 固定 DB を中心にする。現在の DB は data.js。閲覧のたびに AI API で解説を生成する設計を導入しない。
- GitHub の yamato015/digcipher を正本とする。チャット添付ファイルを更新の正本にしない。

## 実装と変更の進め方
- 現状は HTML / CSS / vanilla JavaScript の静的サイト。依頼に必要でないフレームワーク移行、依存追加、大規模整形、デザイン刷新をしない。
- styles.css のクリーム・黒・ゴールド、文字中心の誌面的構成、余白、罫線、レコードの抽象表現、モバイル下部ナビを尊重する。
- 読み込み順は data.js → core.js → app.js。既存の ID / slug / ハッシュ URL を維持する。HTML の配信アセット版（現在 ?v=2）は JS / CSS 変更時に各ページで揃えて更新する。
- 追加データは参照整合性を確認する。表示件数や Watson 前提のコードも調べる。出典・確認状態の導入は表示側と合わせて設計し、既存の情報が検証済みだと推定しない。
- 未確認の意味的な関係を FACT の接続にしない。客演クレジットと編集上の関連付けを区別する。
- 秘密情報を置かない。このリポジトリは Public。Pages workflow はサイト用ファイルだけを _site に集めて配信し、文書・テスト・開発用スクリプトを配信対象にしない。

## 確認と報告
- ドキュメントのみの変更では内容・相互リンク・差分を確認し、実行コードが不変であることを確認する。
- JS の変更では `node --check app.js` / `node --check core.js` / `node --check data.js` を実行する。検索・データの変更では `node scripts/check-data.cjs` と `node --test tests/*.test.cjs` を実行する。Node.js 22 以上を使用する。package.json や依存インストールは不要。GitHub Actions でも同じ確認を実行する。
- UI 変更では README のローカル起動方法で検索（VVS / ICE / WATSON / SOUL QUAKE）、Discover、アーティスト、リリース、曲、語句、404、戻る操作を確認する。
- 検索の Enter / Escape / Cmd または Ctrl+K、スマホ幅の下部ナビ、横はみ出し、FACT / INTERPRETATION 表示を確認する。
- Pages の /digcipher/ 配下で動く相対パスとハッシュルーティングを維持する。
- 変更内容、実施した確認、未確認事項を報告する。公開成功は workflow と実 URL を確認した場合だけ述べる。
- 通常は作業ブランチと PR で差分を残す。ユーザーが直接反映を指示した場合はその範囲で行う。main 更新は公開 workflow を起動する。
