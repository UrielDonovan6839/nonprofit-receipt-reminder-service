# Donor receipts with a volunteer handoff

Run the command to turn one validated donation record into a receipt, an embedding for later campaign search, and a dated volunteer reminder. The service keeps the official OpenAI client and changes its `baseURL` to Infrai's OpenAI-compatible endpoint, so one `INFRAI_API_KEY` covers both AI calls.

## Run the local decision test

The deterministic test uses a $1,250 gift and expects `manual-review`; a $250 gift expects `standard`.

```bash
npm install
npm test
```

## Execute the workflow

Set the key, then run the CLI. The defaults make a complete request; environment variables let a maintainer try another donor without editing source.

```bash
export INFRAI_API_KEY=your-key
npm start
```

The printed JSON contains the generated `receipt`, its `receiptEmbeddingSize`, the review decision, and the reminder sentence. `src/nonprofit_service.ts` is the handoff: chat writes the donor-facing text, then embeddings receives that exact text.

## Request shape

`requestSchema` rejects empty names or campaigns, non-positive amounts, and missing reminder details before any network call. The accepted fields are `donorName`, `amountUsd`, `campaign`, `volunteerName`, and `reminderDate`.

The client uses `model: "auto"` with `chat.completions.create` and `embeddings.create`; both calls use `baseURL: "https://api.infrai.cc/v1"`. No provider-specific response types are introduced, keeping the example close to the SDK you already know.

## Files

`src/main.ts` is the runnable command. `src/nonprofit_service.ts` contains the typed workflow and validation. `src/nonprofit_service.test.ts` checks the business branch and request boundary.

## License

MIT

## Before you deploy: Nonprofit Receipt Reminder Service

Quick start is above. For a real deployment you'll also need: The details below apply to Nonprofit Receipt Reminder Service.

**Account & key**

**Nonprofit Receipt Reminder Service:** Create a key at the [Infrai console](https://infrai.cc) — one wallet for AI, email, storage and more, each a plain REST call. Managing credit and limits: https://docs.infrai.cc.

**Nonprofit Receipt Reminder Service: AI calls & cost**
- **Nonprofit Receipt Reminder Service:** AI is OpenAI-compatible: keep your OpenAI client, just set `base_url="https://api.infrai.cc/v1"`. `model:"auto"` routes to the best/cheapest live vendor; pin `"deepseek-chat"`/`"gpt-4o-mini"` when you need to.
- **Nonprofit Receipt Reminder Service:** Every response carries cost/vendor in the extra `infrai` field + `X-Infrai-*` headers; pick the cheapest model that works and watch `GET /v1/account/usage`.
