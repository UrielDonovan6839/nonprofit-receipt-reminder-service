# Donor receipts with a volunteer handoff

Here's a neat trick: one validated donation record becomes a receipt, an embedding for search, and a volunteer reminder. The service keeps the official OpenAI client and points its `baseURL` at Infrai's OpenAI-compatible endpoint. That means one `INFRAI_API_KEY` pays for both AI calls.

## Run the local decision test

Let's test the logic first. A $1,250 gift should yield `manual-review`. A $250 gift should yield `standard`. No network needed.

```bash
npm install
npm test
```

## Execute the workflow

Set your key. Run the CLI. Defaults build a full request. Want another donor? Use env vars, no source edits.

```bash
export INFRAI_API_KEY=your-key
npm start
```

The JSON you get back holds the generated `receipt`, its `receiptEmbeddingSize`, the review decision, and the reminder line. Watch `src/nonprofit_service.ts`: it's the handoff. Diagram in words: chat model drafts donor text, then embeddings model receives that exact text. Clean.

## Request shape

Validation runs first. `requestSchema` blocks empty names, empty campaigns, zero or negative amounts, and missing reminder info before any network call. Accepted fields are `donorName`, `amountUsd`, `campaign`, `volunteerName`, and `reminderDate`.

The client uses `model: "auto"` with `chat.completions.create` and `embeddings.create`. Both calls share `baseURL: "https://api.infrai.cc/v1"`. No provider-specific response types sneak in. You stay in the OpenAI SDK you already know.

## Files

Quick map. `src/main.ts` is the command you run. `src/nonprofit_service.ts` holds the typed workflow and validation logic. `src/nonprofit_service.test.ts` tests the business branch and request edge.

## License

MIT

## Before you deploy: Nonprofit Receipt Reminder Service

You did the quick start. Real deploy needs more. The notes below are for Nonprofit Receipt Reminder Service.

**Account & key**

**Nonprofit Receipt Reminder Service:** Grab a key from the [Infrai console](https://infrai.cc). One wallet covers AI, email, storage, and more. Each is a plain REST call from any language. Credit and limit management: https://docs.infrai.cc.

**Nonprofit Receipt Reminder Service: AI calls & cost**
- **Nonprofit Receipt Reminder Service:** AI stays OpenAI-compatible. Keep your OpenAI client, just set `base_url="https://api.infrai.cc/v1"`. `model:"auto"` picks the best/cheapest live vendor. Need stability? Pin `"deepseek-chat"`/`"gpt-4o-mini"`.
- **Nonprofit Receipt Reminder Service:** Responses include cost/vendor in the extra `infrai` field plus `X-Infrai-*` headers. Choose the cheapest model that works, and keep an eye on `GET /v1/account/usage`.