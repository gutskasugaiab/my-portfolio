# Reference and SEO Research

## 2026-07-29 factual-scope correction: coding agents

- The book's intended “AI agents” are Claude Code and Codex: tools used to understand codebases, make code changes, run or assist with tests, and review development work. They are not presented here as generic, fully autonomous business-automation tools.
- OpenAI's developer site describes Codex as a coding agent for understanding codebases, building and testing features, fixing bugs, and reviewing changes. Source: https://developers.openai.com/
- Anthropic describes Claude Code as an agentic coding tool that works in the terminal and supports codebase-wide file edits and bug fixes, codebase questions, test/lint command execution, and Git workflows. Source: https://docs.anthropic.com/ja/docs/claude-code
- Claude Code's CLI reference documents scoped tool permissions and an explicit permission-bypass flag; the LP therefore avoids any claim that coding agents act safely or autonomously without a user-controlled permission and review process. Source: https://code.claude.com/docs/en/cli-usage
- On-page rule: never claim that Claude Code or Codex can safely make unreviewed changes, merge code, deploy, or access files/commands by default. State that available actions vary by environment, settings, and permissions, and keep human review of diffs and tests in the copy.

## Search-intent update (no volume claim)

- Primary terms: Claude Code, Codex, AIコーディングエージェント, コード生成, AI開発支援.
- Supporting terms: Claude Code 使い方, Codex 使い方, コードレビュー, テスト, Git, 権限.
- Avoid unsupported SEO language such as “完全自動”, “放置で開発”, “レビュー不要”, or any performance/time-saving guarantee.

## 2026-07-29 visual-reference note

- Additional visual-direction reference: https://school.addness.co.jp/p/8hnd6J7eCf3Y
- Observed at a high level: a full-screen opening rhythm, large editorial typography, a prominent photographic block, and layered atmospheric decoration.
- Original adaptation for this LP: an independent `CHAT → AGENT` opening, bright campaign colors, animated decorative elements, and scroll reveals.
- Excluded from adaptation: source code, motion code, images, wording, logos, and other identifiable brand assets from the reference.
- Endorsement safety: this fictional sample may show clearly labelled placeholder recommender cards, but does not state or imply a real or celebrity endorsement.

## Supplied LP references

### Structural observations

- https://aluciano.jp/ams/
- https://aluciano.jp/caldo/
- https://aluciano.jp/akahoshi/

共通して、書籍のファーストビュー、書籍への想い、Amazon購入のCTA、購入後の特典受取ステップ、目次、著者、最終CTAという順番を採用している。

本LPでは、文章・写真・著者・実績を流用しない。転用するのは書籍LPとしての情報設計のみ。

## Search-intent hypothesis (no volume claim)

想定する読者は、AIエージェントの意味、ChatGPTとの違い、仕事への取り入れ方、リスクの見極め方を知りたい人である。

ページの主題を以下の読者質問に自然に答える形で置く。

1. AIエージェントとは何か。
2. ChatGPTだけを使う場合と何が違うのか。
3. どんな業務から始めればよいのか。
4. 何を人が確認すべきか。
5. 初心者でも読める書籍か。

検索結果で見られる用語の傾向として、`AIエージェントとは`、`ChatGPTとの違い`、`仕組み`、`できること`、`使い方`、`活用事例`、`業務効率化`、`導入`、`初心者`、`注意点`、`自動化`を確認した。これは検索ボリュームや順位ではなく、複数の日本語検索結果で使われている言い回しの観察である。

検索ボリューム、検索順位、実際の効果は未調査・未保証として扱う。

## On-page implementation

- 固有の`title`と自然な`meta description`を設定する。
- 1ページに1つの`h1`を置き、`h2`以下で「AIエージェントとは」「ChatGPTとの違い」「AIエージェントの使い方」に答える。
- 本文は画像化せずHTMLテキストとして実装する。
- FAQを可読な`details`要素で表示し、構造化データは架空案件を検索表示に使わないため本サンプルでは付けない。FAQPageの構造化データでリッチリザルトを狙わない（GoogleはFAQリッチリザルトを終了している）。
- 架空書籍・未確定Amazon URLを含むため`noindex, nofollow`を設定する。実運用では事実確認、実URL、プライバシー情報を反映してから解除を検討する。

## Factual-safety rules

- 実在の販売数、ランキング、受賞歴、推薦、読者レビューを捏造しない。
- サンプル用の推薦・実績枠には`掲載イメージ（架空）`を近接表示する。
- Amazon・OpenAIの名称を使う際、提携、後援、推奨を示唆しない。
- 「全て丸投げ」は人の最終判断をなくす意味ではないと明示する。

## Source notes

- [Google Search Central: 有用で信頼性の高い、ユーザー第一のコンテンツ](https://developers.google.com/search/docs/fundamentals/creating-helpful-content?hl=ja): 誇張ではなく、読者の疑問に直接答える独自の内容を優先する。
- [Google Search Central: タイトルリンクのガイド](https://developers.google.com/search/docs/appearance/title-link?hl=ja) / [メタディスクリプションのガイド](https://developers.google.com/search/docs/appearance/snippet?hl=ja): 固有で明確なタイトル・ページ要約を設定する。
- [Google Search Central: 更新履歴（FAQリッチリザルトの終了）](https://developers.google.com/search/updates?hl=ja#removing-faq-rich-result): FAQPage schemaは採用しない。
- [Google Search Central: 商品構造化データ](https://developers.google.com/search/docs/appearance/structured-data/product-snippet?hl=ja) / [レビュー構造化データ](https://developers.google.com/search/docs/appearance/structured-data/review-snippet?hl=ja): 架空の価格・星評価・レビューを構造化データに入れない。
- 用語の表現傾向の参照（権威ソースではない）: [AIエージェントとは何か・ChatGPTとの違い](https://www.leadplus.co.jp/blog/what-is-ai-agent)、[AIエージェント実践入門](https://www.kspub.co.jp/book/detail/5401408.html)。
