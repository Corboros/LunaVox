import { Router } from "express";
import { getAuth } from "@clerk/express";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

const COMPATIBILITY_MATRIX: Record<string, Record<string, number>> = {
  belier: { belier: 65, taureau: 55, gemeaux: 80, cancer: 50, lion: 95, vierge: 60, balance: 70, scorpion: 75, sagittaire: 90, capricorne: 55, verseau: 75, poissons: 65 },
  taureau: { belier: 55, taureau: 80, gemeaux: 60, cancer: 90, lion: 65, vierge: 95, balance: 75, scorpion: 70, sagittaire: 55, capricorne: 92, verseau: 60, poissons: 85 },
  gemeaux: { belier: 80, taureau: 60, gemeaux: 70, cancer: 60, lion: 80, vierge: 65, balance: 95, scorpion: 55, sagittaire: 85, capricorne: 60, verseau: 90, poissons: 65 },
  cancer: { belier: 50, taureau: 90, gemeaux: 60, cancer: 75, lion: 55, vierge: 80, balance: 60, scorpion: 95, sagittaire: 55, capricorne: 75, verseau: 60, poissons: 92 },
  lion: { belier: 95, taureau: 65, gemeaux: 80, cancer: 55, lion: 70, vierge: 60, balance: 85, scorpion: 65, sagittaire: 90, capricorne: 60, verseau: 75, poissons: 65 },
  vierge: { belier: 60, taureau: 95, gemeaux: 65, cancer: 80, lion: 60, vierge: 72, balance: 65, scorpion: 80, sagittaire: 55, capricorne: 90, verseau: 65, poissons: 75 },
  balance: { belier: 70, taureau: 75, gemeaux: 95, cancer: 60, lion: 85, vierge: 65, balance: 72, scorpion: 60, sagittaire: 80, capricorne: 65, verseau: 90, poissons: 70 },
  scorpion: { belier: 75, taureau: 70, gemeaux: 55, cancer: 95, lion: 65, vierge: 80, balance: 60, scorpion: 78, sagittaire: 65, capricorne: 85, verseau: 60, poissons: 90 },
  sagittaire: { belier: 90, taureau: 55, gemeaux: 85, cancer: 55, lion: 90, vierge: 55, balance: 80, scorpion: 65, sagittaire: 75, capricorne: 60, verseau: 85, poissons: 70 },
  capricorne: { belier: 55, taureau: 92, gemeaux: 60, cancer: 75, lion: 60, vierge: 90, balance: 65, scorpion: 85, sagittaire: 60, capricorne: 80, verseau: 65, poissons: 80 },
  verseau: { belier: 75, taureau: 60, gemeaux: 90, cancer: 60, lion: 75, vierge: 65, balance: 90, scorpion: 60, sagittaire: 85, capricorne: 65, verseau: 78, poissons: 68 },
  poissons: { belier: 65, taureau: 85, gemeaux: 65, cancer: 92, lion: 65, vierge: 75, balance: 70, scorpion: 90, sagittaire: 70, capricorne: 80, verseau: 68, poissons: 80 },
};

const COMPAT_DOMAINS = ["Amour", "Communication", "Complicité", "Valeurs", "Attirance"];

const MESSAGES_BY_SCORE = [
  { min: 85, msg: "Une connexion cosmique rare et profonde. Les astres célèbrent votre union et vous promettent une alchimie exceptionnelle. Votre complémentarité est écrite dans les étoiles." },
  { min: 70, msg: "Une belle harmonie règne entre vous deux. Vos énergies se complètent avec grâce. Quelques ajustements suffiront à faire de cette relation quelque chose de magnifique." },
  { min: 55, msg: "Votre compatibilité est prometteuse, mais demande un travail conscient. Vos différences peuvent devenir votre force si vous choisissez de les embrasser plutôt que de les fuir." },
  { min: 0, msg: "Le chemin ensemble sera semé d'embûches, mais les défis forgent les âmes. Si la connexion est réelle, elle peut transcender les obstacles astrologiques." },
];

router.get("/usage", async (req, res): Promise<void> => {
  const auth = getAuth(req);
  if (!auth?.userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, auth.userId));
    res.json({
      freeTestUsed: user?.freeTestUsed ?? false,
      isPremium: user?.isPremium ?? false,
      testsRemaining: user?.isPremium ? null : user?.freeTestUsed ? 0 : 1,
    });
  } catch (err) {
    req.log.error({ err }, "Error getting compatibility usage");
    res.status(500).json({ error: "Erreur serveur" });
  }
});

router.get("/", async (req, res): Promise<void> => {
  const auth = getAuth(req);
  if (!auth?.userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const { sign1, sign2 } = req.query as { sign1: string; sign2: string };
  if (!sign1 || !sign2) {
    res.status(400).json({ error: "sign1 et sign2 sont requis" });
    return;
  }

  const s1 = sign1.toLowerCase();
  const s2 = sign2.toLowerCase();

  if (!COMPATIBILITY_MATRIX[s1] || !COMPATIBILITY_MATRIX[s2]) {
    res.status(400).json({ error: "Signe zodiacal invalide" });
    return;
  }

  // Check user's usage
  try {
    let user = await db.query.usersTable.findFirst({ where: eq(usersTable.id, auth.userId) });

    if (!user) {
      // Create user on first access
      const [newUser] = await db.insert(usersTable).values({ id: auth.userId }).returning();
      user = newUser;
    }

    if (!user.isPremium && user.freeTestUsed) {
      res.status(402).json({
        error: "Test gratuit déjà utilisé. Passez à Premium pour des compatibilités illimitées.",
        requiresPremium: true,
      });
      return;
    }

    // Calculate compatibility
    const overallScore = COMPATIBILITY_MATRIX[s1][s2];
    const seed = s1.length + s2.length;
    const domains = COMPAT_DOMAINS.map((label, i) => ({
      label,
      score: Math.min(100, Math.max(40, overallScore + ((seed * (i + 3) * 17) % 20) - 10)),
    }));

    const messageEntry = MESSAGES_BY_SCORE.find((m) => overallScore >= m.min)!;

    // Mark free test as used if not premium
    if (!user.isPremium) {
      await db.update(usersTable).set({ freeTestUsed: true }).where(eq(usersTable.id, auth.userId));
    }

    res.json({
      sign1: s1,
      sign2: s2,
      overallScore,
      message: messageEntry.msg,
      domains,
    });
  } catch (err) {
    req.log.error({ err }, "Error calculating compatibility");
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
