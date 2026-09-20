import test from "node:test";
import assert from "node:assert/strict";
import { reviewPath, requestSchema } from "./nonprofit_service.js";

test("large gifts enter manual review while ordinary gifts stay standard", () => {
  assert.equal(reviewPath(1250), "manual-review");
  assert.equal(reviewPath(250), "standard");
});

test("request boundary accepts a complete donor handoff", () => {
  const parsed = requestSchema.parse({
    donorName: "Avery Chen",
    amountUsd: 1250,
    campaign: "Community Meals",
    volunteerName: "Mina Patel",
    reminderDate: "2026-09-10"
  });
  assert.equal(parsed.campaign, "Community Meals");
});
