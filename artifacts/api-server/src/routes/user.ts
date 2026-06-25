import { Router } from "express";
import { getAuth } from "@clerk/express";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

const requireAuth = (req: any, res: any, next: any) => {
  const auth = getAuth(req);
  if (!auth?.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  req.userId = auth.userId;
  next();
};

// GET /api/user/profile
router.get("/profile", requireAuth, async (req: any, res): Promise<void> => {
  try {
    let user = await db.query.usersTable.findFirst({
      where: eq(usersTable.id, req.userId),
    });

    if (!user) {
      const [newUser] = await db
        .insert(usersTable)
        .values({ id: req.userId })
        .onConflictDoNothing()
        .returning();
      user = newUser;
    }

    if (!user) {
      res.status(500).json({ error: "Erreur lors de la création du profil" });
      return;
    }

    res.json({
      userId: user.id,
      name: user.name,
      email: user.email,
      zodiacSign: user.zodiacSign,
      birthDate: user.birthDate,
      isPremium: user.isPremium,
      freeTestUsed: user.freeTestUsed,
      createdAt: user.createdAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Error fetching user profile");
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// PUT /api/user/profile
router.put("/profile", requireAuth, async (req: any, res): Promise<void> => {
  try {
    const { zodiacSign, birthDate, name } = req.body;

    // Upsert user
    await db
      .insert(usersTable)
      .values({ id: req.userId, zodiacSign, birthDate, name })
      .onConflictDoUpdate({
        target: usersTable.id,
        set: {
          zodiacSign: zodiacSign ?? undefined,
          birthDate: birthDate ?? undefined,
          name: name ?? undefined,
        },
      });

    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.id, req.userId),
    });

    res.json({
      userId: user!.id,
      name: user!.name,
      email: user!.email,
      zodiacSign: user!.zodiacSign,
      birthDate: user!.birthDate,
      isPremium: user!.isPremium,
      freeTestUsed: user!.freeTestUsed,
      createdAt: user!.createdAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Error updating user profile");
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
