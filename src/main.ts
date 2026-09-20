import { runWorkflow } from "./nonprofit_service.js";

const input = {
  donorName: process.env.DONOR_NAME ?? "Avery Chen",
  amountUsd: Number(process.env.DONATION_USD ?? "1250"),
  campaign: process.env.CAMPAIGN ?? "Community Meals",
  volunteerName: process.env.VOLUNTEER_NAME ?? "Mina Patel",
  reminderDate: process.env.REMINDER_DATE ?? "2026-09-10"
};

if (!process.env.INFRAI_API_KEY) {
  console.error("Set INFRAI_API_KEY before running the service.");
  process.exit(1);
}

const result = await runWorkflow(input);
console.log(JSON.stringify(result, null, 2));
