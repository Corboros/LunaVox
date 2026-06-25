import { Router } from "express";
import { getAuth } from "@clerk/express";
import { db, usersTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";
import { getUncachableStripeClient, getStripeSync } from "../stripeClient";

const router = Router();

const requireAuth = (req: any, res: any, next: any) => {
  const auth = getAuth(req);
  if (!auth?.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  req.userId = auth.userId;
  next();
};

// POST /api/payments/create-checkout
router.post("/create-checkout", requireAuth, async (req: any, res): Promise<void> => {
  const { plan } = req.body;

  if (!plan || !["monthly", "annual"].includes(plan)) {
    res.status(400).json({ error: "Plan invalide. Choisissez 'monthly' ou 'annual'" });
    return;
  }

  try {
    const stripe = await getUncachableStripeClient();

    // Get or create user
    let user = await db.query.usersTable.findFirst({
      where: eq(usersTable.id, req.userId),
    });

    if (!user) {
      const [newUser] = await db.insert(usersTable).values({ id: req.userId }).returning();
      user = newUser;
    }

    // Get or create Stripe customer
    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        metadata: { userId: req.userId },
      });
      customerId = customer.id;
      await db.update(usersTable).set({ stripeCustomerId: customerId }).where(eq(usersTable.id, req.userId));
    }

    // Find the right price from Stripe
    const domain = process.env.REPLIT_DOMAINS?.split(",")[0];
    const baseUrl = domain ? `https://${domain}` : "http://localhost:5000";

    // Look up prices in stripe schema
    let priceId: string | null = null;
    try {
      const result = await db.execute(sql`
        SELECT pr.id as price_id
        FROM stripe.products p
        JOIN stripe.prices pr ON pr.product = p.id AND pr.active = true
        WHERE p.name = 'AstroMystic Premium'
          AND p.active = true
          AND pr.recurring->>'interval' = ${plan === "monthly" ? "month" : "year"}
        LIMIT 1
      `);
      priceId = (result.rows[0] as any)?.price_id || null;
    } catch {
      // stripe schema may not exist yet if Stripe not integrated
    }

    if (!priceId) {
      // Fallback: create a price on the fly for demo
      const product = await stripe.products.create({ name: "AstroMystic Premium" });
      const price = await stripe.prices.create({
        product: product.id,
        unit_amount: plan === "monthly" ? 999 : 7999,
        currency: "eur",
        recurring: { interval: plan === "monthly" ? "month" : "year" },
      });
      priceId = price.id;
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "subscription",
      success_url: `${baseUrl}/?payment=success`,
      cancel_url: `${baseUrl}/?payment=cancelled`,
      metadata: { userId: req.userId },
    });

    res.json({ url: session.url });
  } catch (err: any) {
    req.log.error({ err }, "Error creating checkout session");
    // If Stripe not integrated, return a helpful message
    if (err.message?.includes("Missing Replit environment variables") || err.message?.includes("not connected")) {
      res.status(503).json({ error: "Stripe n'est pas encore configuré. Connectez l'intégration Stripe dans le panneau des intégrations." });
      return;
    }
    res.status(500).json({ error: "Erreur lors de la création de la session de paiement" });
  }
});

// GET /api/payments/subscription-status
router.get("/subscription-status", requireAuth, async (req: any, res): Promise<void> => {
  try {
    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.id, req.userId),
    });

    if (!user) {
      res.json({ isPremium: false, freeTestUsed: false, subscriptionId: null, currentPeriodEnd: null });
      return;
    }

    let currentPeriodEnd: string | null = null;
    if (user.stripeSubscriptionId) {
      try {
        const result = await db.execute(sql`
          SELECT current_period_end FROM stripe.subscriptions WHERE id = ${user.stripeSubscriptionId} LIMIT 1
        `);
        const sub = result.rows[0] as any;
        if (sub?.current_period_end) {
          currentPeriodEnd = new Date(sub.current_period_end * 1000).toISOString();
        }
      } catch {
        // stripe schema not available
      }
    }

    res.json({
      isPremium: user.isPremium,
      freeTestUsed: user.freeTestUsed,
      subscriptionId: user.stripeSubscriptionId,
      currentPeriodEnd,
    });
  } catch (err) {
    req.log.error({ err }, "Error fetching subscription status");
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
