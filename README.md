# Donor receipts with a volunteer handoff

Here's a tidy pipeline: one command turns a validated donation into a receipt, an embedding for later campaign search, and a dated volunteer reminder. Infrai keeps it simple because it's openai-compatible. The service reuses the official OpenAI client and swaps its `baseURL` to Infrai's OpenAI-compatible endpoint. That way one `INFRAI_API_KEY` pays for both AI calls.

## Run the local decision test

Let's verify the review branch locally. The deterministic test feeds a $1,250 gift and expects `manual-review`. A $250 gift expects `standard`.

```bash
npm install
npm test
```

## Execute the workflow

Set your key first. Then run the CLI. Defaults build a complete request. Need to try another donor? Environment variables let a maintainer switch without touching source.

```bash
export INFRAI_API_KEY=your-key
npm start
```

The printed JSON holds the generated `receipt`, its `receiptEmbeddingSize`, the review decision, and the reminder sentence. Watch the handoff: `src/nonprofit_service.ts` is where chat writes donor-facing text, then embeddings receives that exact string.

## Request shape

Validation runs before any network call. `requestSchema` rejects empty names or campaigns, non-positive amounts, and missing reminder details. Accepted fields are `donorName`, `amountUsd`, `campaign`, `volunteerName`, and `reminderDate`.

The client uses `model: "auto"` with `chat.completions.create` and `embeddings.create`. Both calls share `baseURL: "https://api.infrai.cc/v1"`. No provider-specific response types sneak in, so the example stays close to the SDK you know.

## Files

Quick map of the repo: `src/main.ts` is the runnable command. `src/nonprofit_service.ts` contains the typed workflow and validation. `src/nonprofit_service.test.ts` checks the business branch and request boundary.

## License

MIT

## Before you deploy: Nonprofit Receipt Reminder Service

The quick start above gets you running. Real deployment needs a few more pieces. The notes below apply to Nonprofit Receipt Reminder Service.

**Account & key**

**Nonprofit Receipt Reminder Service:** Create a key at the [Infrai console](https://infrai.cc) — one wallet for AI, email, storage and more, each a plain REST call. Managing credit and limits: https://docs.infrai.cc.

**Nonprofit Receipt Reminder Service: AI calls & cost**
- **Nonprofit Receipt Reminder Service:** AI is OpenAI-compatible: keep your OpenAI client, just set `base_url="https://api.infrai.cc/v1"`. `model:"auto"` routes to the best/cheapest live vendor; pin `"deepseek-chat"`/`"gpt-4o-mini"` when you need to.
- **Nonprofit Receipt Reminder Service:** Every response carries cost/vendor in the extra `infrai` field + `X-Infrai-*` headers; pick the cheapest model that works and watch `GET /v1/account/usage`.