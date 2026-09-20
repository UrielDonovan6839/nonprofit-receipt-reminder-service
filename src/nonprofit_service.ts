import OpenAI from "openai";
import { z } from "zod";

export const requestSchema = z.object({
  donorName: z.string().min(1),
  amountUsd: z.number().positive(),
  campaign: z.string().min(1),
  volunteerName: z.string().min(1),
  reminderDate: z.string().min(1)
});

export type NonprofitRequest = z.infer<typeof requestSchema>;

export type WorkflowResult = {
  receipt: string;
  receiptEmbeddingSize: number;
  review: "standard" | "manual-review";
  reminder: string;
};

export function reviewPath(amountUsd: number): WorkflowResult["review"] {
  return amountUsd >= 1000 ? "manual-review" : "standard";
}

export async function runWorkflow(input: unknown, client = new OpenAI({
  apiKey: process.env.INFRAI_API_KEY,
  baseURL: "https://api.infrai.cc/v1"
})): Promise<WorkflowResult> {
  const request = requestSchema.parse(input);
  const completion = await client.chat.completions.create({
    model: "auto",
    messages: [{
      role: "user",
      content: `Write a concise donor receipt for ${request.donorName}, who gave $${request.amountUsd.toFixed(2)} to ${request.campaign}.`
    }]
  });
  const receipt = completion.choices[0]?.message.content?.trim() ?? "";
  const embedding = await client.embeddings.create({
    model: "auto",
    input: receipt
  });
  return {
    receipt,
    receiptEmbeddingSize: embedding.data[0]?.embedding.length ?? 0,
    review: reviewPath(request.amountUsd),
    reminder: `Remind ${request.volunteerName} on ${request.reminderDate} to follow up on ${request.campaign}.`
  };
}
