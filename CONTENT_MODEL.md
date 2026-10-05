# Fixed database and source review

schema_version: 2。正本は data.js。AI API による閲覧時生成、歌詞取得、音源・ジャケットの保存は導入しない。

## レコード
- artists: name, slug, aliases（検索用表記）, archive_status（first / connected / archive）。
- releases: title, slug, artist（artist slug）, date, track_count, aliases, evidence。
- tracks: id, title, release（release slug）, n, dur（秒）, date, features（artist name 配列）, evidence。
- terms: id, term, reading, category, short_definition（一般定義）, fact_detail（任意の補足）, long_definition（編集メモ）, fact_status（既存互換）, aliases, evidence。
- sources: id, title, publisher, HTTPS の url, type, rights（現在は external_link_only）。

作品の所有者と客演は別の参照。ID / slug は既存 URL に使うので変更しない。件数は DB から計算する。

## 出典は項目ごとに記録する
evidence は次の形の配列。レコード全体を一括で検証済みにしない。

```json
{
  "source_id": "gia-clarity",
  "fields": ["short_definition", "fact_detail"],
  "checked_on": "2026-10-04",
  "checked_by": "Codex source review"
}
```

sources に実在する出典、対象フィールド、確認日、確認者がある項目だけを「出典確認済み」と表示する。evidence が空なら「確認中」。旧 fact_status は検証完了を意味しない。編集メモに一般定義の確認状態を流用しない。

新しい出典では実際のページ内容を読み、どの記述がどのフィールドを裏付けるか確認してから記録する。確認日は実際の確認日を入れる。primary は定義発行主体、catalog は配信カタログ。今回の checked_by は Codex による確認であり、人間の編集レビュー完了を意味しない。二次資料を追加する場合は type と編集上の位置付けを明示する。

2026-10-04 に確認した範囲:
- GIA: VVS の一般定義と VVS1 / VVS2 の補足。
- Merriam-Webster: ice のダイヤモンド / ジュエリーという一般的なスラング用法。
- Apple Music: Soul Quake 3 のタイトル、アーティスト、日付、曲数。収録曲の日付はこのアルバム版の日付。
- Spotify の配信カタログ: Soul Quake 3 の10曲のタイトル、曲順、時間、収録先、客演表記。仙人掌はタイトルと Senninsho 表記を照合した。

配信カタログは情報源へのリンクとして扱う。ジャケット・音源はコピー、埋め込み、ダウンロードしない。曲の意味や人物の意図はカタログ情報から断定しない。

## 追加・修正時の確認
1. 根拠と権利を確認する。根拠のない解説や接続を補完しない。
2. data.js の該当項目と evidence を同時に更新する。値を変えたら古い evidence がなお成立するか再確認する。
3. `node scripts/check-data.cjs` と `node --test tests/*.test.cjs` を実行する。
4. 検索、出典詳細、FACT / INTERPRETATION、関連先をブラウザで確認する。

語句から曲への対応付けは未実装。歌詞を無断取得して自動対応付けしない。将来導入する際は一般的な語義と曲ごとの用法を区別し、根拠のある接続だけを扱う。
