import app from "./app";
import { logger } from "./lib/logger";
import { runMigrations } from "@workspace/db/migrate";
import { getStripeSync } from "./stripeClient";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

async function start() {
  // Run DB migrations first
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL environment variable is required");
  }

  logger.info("Running database migrations...");
  await runMigrations({ databaseUrl });
  logger.info("Database migrations complete");

  // Initialize Stripe sync (non-fatal if Stripe not yet connected)
  try {
    const stripeSync = await getStripeSync();
    const domains = process.env.REPLIT_DOMAINS?.split(",") ?? [];
    const webhookUrl = domains[0]
      ? `https://${domains[0]}/api/stripe/webhook`
      : null;
    if (webhookUrl) {
      await stripeSync.findOrCreateManagedWebhook(webhookUrl, {
        enabled_events: [
          "checkout.session.completed",
          "customer.subscription.created",
          "customer.subscription.updated",
          "customer.subscription.deleted",
          "invoice.payment_succeeded",
          "invoice.payment_failed",
        ],
      });
    }
    await stripeSync.syncBackfill();
    logger.info("Stripe sync initialized");
  } catch (err: any) {
    logger.warn({ err: err.message }, "Stripe not configured — skipping Stripe sync");
  }

  app.listen(port, (err) => {
    if (err) {
      logger.error({ err }, "Error listening on port");
      process.exit(1);
    }
    logger.info({ port }, "Server listening");
  });
}

start().catch((err) => {
  logger.error({ err }, "Fatal startup error");
  process.exit(1);
});
