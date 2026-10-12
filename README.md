# DIGCIPHER

WAXETCH が展開する PROJECT 001。日本語 HIPHOP の言葉・曲・人物・背景を掘る知識プロダクト。Watson は **FIRST ARCHIVE** であり、今後は他アーティストやシーンにも広げていきます。WAXETCH の次の研究領域は **PROJECT 002 / CLASSICAL** です（名称・仕様は未決定）。

## 開発の入口
- [AGENTS.md](AGENTS.md): Codex の作業指針と維持する要件
- [PROJECT_CONTEXT.md](PROJECT_CONTEXT.md): ブランド、UX、実装、データ、既知の限界
- [ROADMAP.md](ROADMAP.md): 継続開発の優先候補と受け入れ条件

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

Python 3 が使える環境で実行し、http://localhost:8000/ を開きます。別の静的サーバーでも構いません。データは data.js、画面と検索は app.js、デザインは styles.css です。現在、package.json と自動テスト基盤はありません。

## 確認
UI / データの変更時は検索例 VVS / ICE / WATSON / SOUL QUAKE、Discover、Watson、作品、曲、語句への移動、モバイル下部ナビを確認します。詳しい確認項目は AGENTS.md にあります。

## GitHub Pages
[公開予定 URL](https://yamato015.github.io/digcipher/) は `https://yamato015.github.io/digcipher/` です。公開完了を保証するリンクではありません。

.github/workflows/pages.yml は main への push または手動実行でリポジトリルートを Pages に配信します。GitHub の [Pages 設定](https://github.com/yamato015/digcipher/settings/pages) で Source が GitHub Actions になっているか確認してください。

2026-10-04 の引き継ぎ確認では [直近 run #9](https://github.com/yamato015/digcipher/actions/runs/35309914229) は失敗でした。初回有効化と公開成功は未確認です。公開を確認する際は最新の [Actions](https://github.com/yamato015/digcipher/actions) と実 URL の両方を確認してください。ルート全体を公開するため、秘密情報や非公開資料を置かないでください。
