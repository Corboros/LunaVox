import { Router } from "express";
import { getAuth } from "@clerk/express";
import { db, consultantsTable, usersTable } from "@workspace/db";
import { eq, desc, gte } from "drizzle-orm";

const router = Router();

const requireAuth = (req: any, res: any, next: any) => {
  const auth = getAuth(req);
  if (!auth?.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  req.userId = auth.userId;
  next();
};

// GET /api/consultants/featured
router.get("/featured", async (req, res): Promise<void> => {
  try {
    const featured = await db
      .select()
      .from(consultantsTable)
      .where(eq(consultantsTable.status, "approved"))
      .orderBy(desc(consultantsTable.rating))
      .limit(6);
    res.json(featured);
  } catch (err) {
    req.log.error({ err }, "Error fetching featured consultants");
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// GET /api/consultants/my-profile
router.get("/my-profile", requireAuth, async (req: any, res): Promise<void> => {
  try {
    const consultant = await db.query.consultantsTable.findFirst({
      where: eq(consultantsTable.userId, req.userId),
    });
    if (!consultant) {
      res.status(404).json({ error: "Profil consultant non trouvé" });
      return;
    }
    res.json(consultant);
  } catch (err) {
    req.log.error({ err }, "Error fetching consultant profile");
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// GET /api/consultants
router.get("/", async (req, res): Promise<void> => {
  try {
    const consultants = await db
      .select()
      .from(consultantsTable)
      .where(eq(consultantsTable.status, "approved"))
      .orderBy(desc(consultantsTable.rating));
    res.json(consultants);
  } catch (err) {
    req.log.error({ err }, "Error fetching consultants");
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// POST /api/consultants
router.post("/", requireAuth, async (req: any, res): Promise<void> => {
  try {
    const existing = await db.query.consultantsTable.findFirst({
      where: eq(consultantsTable.userId, req.userId),
    });
    if (existing) {
      res.status(409).json({ error: "Vous avez déjà soumis une candidature" });
      return;
    }

    const { name, speciality, bio, zodiacSign, experience, pricePerSession, tags } = req.body;
    if (!name || !speciality || !bio) {
      res.status(400).json({ error: "Nom, spécialité et bio sont requis" });
      return;
    }

    const [consultant] = await db
      .insert(consultantsTable)
      .values({
        userId: req.userId,
        name,
        speciality,
        bio,
        zodiacSign: zodiacSign || null,
        experience: experience || null,
        pricePerSession: pricePerSession || null,
        tags: tags || [],
        status: "pending",
      })
      .returning();

    res.status(201).json(consultant);
  } catch (err) {
    req.log.error({ err }, "Error creating consultant application");
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
