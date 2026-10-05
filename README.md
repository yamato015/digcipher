# DIGCIPHER

WAXETCH が展開する、日本語 HIPHOP の言葉・曲・人物・背景を掘る知識プロダクト。Watson は **FIRST ARCHIVE** であり、今後は他アーティストやシーンにも広げていきます。

## 開発の入口
- [AGENTS.md](AGENTS.md): Codex の作業指針と維持する要件
- [PROJECT_CONTEXT.md](PROJECT_CONTEXT.md): ブランド、UX、実装、データ、既知の限界
- [ROADMAP.md](ROADMAP.md): 継続開発の優先候補と受け入れ条件
- [CONTENT_MODEL.md](CONTENT_MODEL.md): 固定 DB と項目ごとの出典確認

GitHub の [yamato015/digcipher](https://github.com/yamato015/digcipher) が正本です。Codex で継続する場合はこのリポジトリをローカルに取得してプロジェクトとして開き、上記文書と対象コードを読んでから変更してください。毎回 HTML をチャットへ添付する必要はありません。

## 方針
- Search / Discover を中心に、検索から次の発見へつなぐ。
- FACT と INTERPRETATION を分離し、未確認情報を推測で埋めない。
- 未許諾の歌詞全文・音源・ジャケットは取得・保存・掲載しない。
- 固定 DB 中心。閲覧ごとの AI API 生成は導入しない。
- 既存のデザインと URL を維持し、必要な範囲から改善する。

## ローカルで開く
HTML / CSS / vanilla JavaScript の静的サイトです。依存のインストールとビルドは不要です。

```sh
git clone https://github.com/yamato015/digcipher.git
cd digcipher
python3 -m http.server 8000
```

Python 3 が使える環境で実行し、http://localhost:8000/ を開きます。別の静的サーバーでも構いません。データは data.js、検索と参照処理は core.js、画面は app.js、デザインは styles.css です。package.json と依存インストールは不要です。

## 確認
UI / データの変更時は検索例 VVS / ICE / WATSON / SOUL QUAKE、Discover、Watson、作品、曲、語句への移動、モバイル下部ナビを確認します。詳しい確認項目は AGENTS.md にあります。

Node.js 22 以上で、次の確認を実行できます。GitHub Actions の Validate static app でも自動実行します。

```sh
node --check app.js
node --check core.js
node --check data.js
node scripts/check-data.cjs
node --test tests/*.test.cjs
```

## 探索機能
日本語の読み・全角英字・表記揺れに対応した検索、カテゴリの絞り込み、全件数と追加表示を備えます。Discover は言葉・年代・客演の3つの入口。CONNECTED INDEX から参加曲、曲から客演アーティストへ辿れます。

語句と曲の画面では FACT と INTERPRETATION を分け、項目ごとの確認状態と出典を表示します。現時点の確認範囲は VVS / ICE の一般定義と Soul Quake 3 のメタデータ。その他の出典確認と曲の解説は整備中です。

## GitHub Pages
[公開予定 URL](https://yamato015.github.io/digcipher/) は `https://yamato015.github.io/digcipher/` です。公開完了を保証するリンクではありません。

.github/workflows/pages.yml は main への push または手動実行でサイト用ファイルを _site に集め、Pages に配信します。文書・テスト・開発用スクリプトは配信対象に含めません。GitHub の [Pages 設定](https://github.com/yamato015/digcipher/settings/pages) で Source が GitHub Actions になっているか確認してください。

2026-10-04 に [run 37195103223](https://github.com/yamato015/digcipher/actions/runs/37195103223) のログを確認しました。Pages サイトが見つからず、初回作成も Resource not accessible by integration で拒否されています。初回設定が必要です。公開を確認する際は最新の [Actions](https://github.com/yamato015/digcipher/actions) と実 URL の両方を確認してください。Public リポジトリなので秘密情報や非公開資料は置かないでください。
