import { Router } from "express";
import { getAuth } from "@clerk/express";

const router = Router();

const ZODIAC_SIGNS: Record<string, { emoji: string; element: string }> = {
  belier: { emoji: "♈", element: "Feu" },
  taureau: { emoji: "♉", element: "Terre" },
  gemeaux: { emoji: "♊", element: "Air" },
  cancer: { emoji: "♋", element: "Eau" },
  lion: { emoji: "♌", element: "Feu" },
  vierge: { emoji: "♍", element: "Terre" },
  balance: { emoji: "♎", element: "Air" },
  scorpion: { emoji: "♏", element: "Eau" },
  sagittaire: { emoji: "♐", element: "Feu" },
  capricorne: { emoji: "♑", element: "Terre" },
  verseau: { emoji: "♒", element: "Air" },
  poissons: { emoji: "♓", element: "Eau" },
};

const HOROSCOPE_MESSAGES: Record<string, string[]> = {
  belier: [
    "Les étoiles vous invitent à prendre les devants aujourd'hui. Votre énergie débordante attire des opportunités inattendues. Faites confiance à votre instinct dans vos décisions.",
    "Mars, votre planète maîtresse, vous insuffle une détermination sans faille. C'est le moment idéal pour lancer ce projet que vous remettez à plus tard.",
    "Une rencontre fortuite pourrait changer la donne dans votre vie amoureuse. Restez ouvert aux signes de l'univers ce soir.",
  ],
  taureau: [
    "Vénus illumine votre chemin aujourd'hui. La stabilité que vous recherchez est à portée de main si vous faites preuve de patience et de persévérance.",
    "Vos sens sont exacerbés — profitez-en pour vous entourer de beauté et de douceur. Une belle journée pour les plaisirs simples et authentiques.",
    "Votre sens pratique est votre plus grand atout en ce moment. Les décisions financières prises aujourd'hui porteront leurs fruits.",
  ],
  gemeaux: [
    "Mercure danse en votre faveur, aiguisant votre esprit et votre éloquence. Vos mots auront un pouvoir particulier sur ceux qui vous entourent.",
    "La curiosité est votre boussole ce jour. Explorez de nouvelles idées, de nouveaux horizons. Une conversation inattendue pourrait ouvrir des portes insoupçonnées.",
    "Votre nature duale vous permet de voir les choses sous plusieurs angles. Utilisez cette capacité pour résoudre un conflit qui traîne.",
  ],
  cancer: [
    "La Lune, votre gardienne, vous enveloppe de sa lumière protectrice. Votre intuition est particulièrement fine aujourd'hui — écoutez-la.",
    "Vos proches ont besoin de votre tendresse caractéristique. Un geste simple mais sincère renforcera des liens déjà forts.",
    "Votre créativité est en plein essor. Exprimez vos émotions à travers un art, une lettre, ou une conversation du cœur.",
  ],
  lion: [
    "Le Soleil, votre astre souverain, brille de mille feux en votre honneur. Votre charisme naturel attire les regards et ouvre des opportunités royales.",
    "C'est votre moment de briller. N'hésitez pas à prendre la parole, à vous affirmer. Votre générosité sera récompensée.",
    "Une reconnaissance méritée s'annonce. Votre leadership inspire ceux qui vous entourent. Continuez sur cette lancée.",
  ],
  vierge: [
    "Mercure affine votre discernement légendaire aujourd'hui. Votre attention aux détails vous permettra de détecter ce que les autres manquent.",
    "Votre dévouement porte ses fruits. Un service rendu en toute discrétion vous reviendra multiplié. La précision est votre force.",
    "Prenez soin de vous autant que vous prenez soin des autres. Votre santé mérite la même rigueur que vous accordez à vos projets.",
  ],
  balance: [
    "Vénus, votre muse, orchestre une belle harmonie dans vos relations. L'équilibre que vous recherchez est enfin à portée de main.",
    "Votre sens de la justice guide vos pas vers une décision importante. Pesez bien les pour et les contre — vous avez la sagesse nécessaire.",
    "Une rencontre esthétique — art, musique ou beauté naturelle — alimentera votre âme et inspirera vos choix à venir.",
  ],
  scorpion: [
    "Pluton dévoile des vérités cachées que vous seul pouvez percevoir. Votre perspicacité vous donne un avantage précieux dans une situation complexe.",
    "Votre profondeur émotionnelle est votre trésor secret. Une transformation intérieure est en cours — laissez-la s'accomplir.",
    "Ce qui était dans l'ombre commence à émerger. Faites confiance au processus de renouveau qui se dessine dans votre vie.",
  ],
  sagittaire: [
    "Jupiter, votre protecteur céleste, ouvre grandes les portes de l'aventure. Un voyage ou une nouvelle philosophie enrichira votre existence.",
    "Votre optimisme contagieux est votre plus belle offrande au monde. Partagez votre vision, elle inspire plus que vous ne le croyez.",
    "Une vérité universelle se révèle à vous aujourd'hui. Votre quête de sens vous mène exactement là où vous devez être.",
  ],
  capricorne: [
    "Saturne récompense votre discipline et votre ambition. Les efforts constants de ces derniers mois trouvent enfin leur juste rétribution.",
    "Votre sens des responsabilités est exemplaire. Aujourd'hui, une occasion de grimper d'un échelon supplémentaire se présente à vous.",
    "La montagne que vous gravissez révèle des panoramas magnifiques. Prenez le temps d'apprécier le chemin parcouru.",
  ],
  verseau: [
    "Uranus, votre planète de la liberté, vous inspire des idées révolutionnaires. Votre vision du futur est en avance sur votre temps.",
    "Votre désir de changer le monde commence par votre entourage immédiat. Une idée novatrice trouvera des oreilles réceptives aujourd'hui.",
    "Votre originalité est une force, pas une excentricité. Embrassez pleinement votre unicité — elle attire les bonnes personnes.",
  ],
  poissons: [
    "Neptune baigne votre monde de magie et d'inspiration. Votre sensibilité artistique atteint des sommets aujourd'hui — créez, rêvez, imaginez.",
    "Votre empathie naturelle vous permet de toucher les cœurs avec une douceur rare. Un être cher a besoin de votre lumière.",
    "La frontière entre rêve et réalité s'amenuise pour vous. Faites confiance à vos visions — elles contiennent des messages précieux.",
  ],
};

const DOMAINS = ["Amour", "Travail", "Santé", "Finances", "Famille", "Créativité"];
const DOMAIN_ICONS = ["♥", "★", "✦", "◆", "❋", "✿"];

router.get("/:sign", (req, res): void => {
  const auth = getAuth(req);
  if (!auth?.userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const sign = req.params.sign.toLowerCase();
  if (!ZODIAC_SIGNS[sign]) {
    res.status(404).json({ error: "Signe zodiacal non trouvé" });
    return;
  }

  const signData = ZODIAC_SIGNS[sign];
  const messages = HOROSCOPE_MESSAGES[sign];
  // Rotate message by day
  const dayOfYear = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
  const message = messages[dayOfYear % messages.length];

  // Generate domain scores seeded by sign + day
  const seed = sign.length + dayOfYear;
  const domains = DOMAINS.map((label, i) => ({
    label,
    icon: DOMAIN_ICONS[i],
    score: ((seed * (i + 7) * 31) % 40) + 60, // 60-99
  }));

  res.json({
    sign,
    date: new Date().toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "numeric" }),
    message,
    emoji: signData.emoji,
    domains,
  });
});

export default router;
