// Horoscope data by sign - generates varied content based on date
const signs = ["belier", "taureau", "gemeaux", "cancer", "lion", "vierge", "balance", "scorpion", "sagittaire", "capricorne", "verseau", "poissons"];

const horoscopeMessages: Record<string, string[]> = {
  belier: [
    "Mars, votre planète gouvernante, vous insuffle une énergie renouvelée. Les portes qui semblaient fermées s'ouvrent aujourd'hui. Osez prendre l'initiative — le cosmos vous soutient.",
    "Un feu intérieur vous guide vers de nouvelles aventures. Votre courage naturel attire des opportunités inattendues. Les étoiles vous invitent à agir avec détermination.",
    "Votre instinct est votre boussole aujourd'hui. Ne laissez pas les doutes freiner votre élan. L'univers reconnaît les âmes audacieuses.",
  ],
  taureau: [
    "Vénus illumine votre chemin avec une lumière dorée. La stabilité que vous cultivez avec patience porte ses fruits. Un investissement émotionnel ou financier montre des signes encourageants.",
    "La terre sous vos pieds vous rappelle votre force. Les plaisirs sensoriels enrichissent votre journée. Votre persévérance est sur le point d'être récompensée.",
    "La beauté du monde vous parle aujourd'hui d'une façon particulière. Faites confiance à votre sens profond de la valeur. Ce qui compte vraiment devient évident.",
  ],
  gemeaux: [
    "Mercure active votre esprit avec une vivacité rare. Les connexions que vous établissez aujourd'hui peuvent changer le cours de votre trajectoire. Parlez, écrivez, communiquez.",
    "Votre dualité est une force, pas une faiblesse. Deux chemins s'offrent à vous — l'intuition sait lequel choisir. Les conversations inattendues révèlent des vérités précieuses.",
    "L'information circule vers vous comme une rivière. Votre curiosité insatiable vous mène vers des découvertes remarquables. Restez ouvert à l'imprévu.",
  ],
  cancer: [
    "La Lune vous enveloppe dans une lumière protectrice. Vos émotions sont une source de sagesse, pas de faiblesse. Ceux que vous aimez ressentent votre présence bienveillante.",
    "Votre intuition atteint des sommets inhabituels. Ce que vous ressentez dans votre cœur dépasse ce que la raison peut expliquer. Faites confiance à cette voix intérieure.",
    "Les racines profondes nourrissent les plus hauts sommets. Votre attachement à vos proches est votre ancre dans la tempête. Un foyer chaleureux est votre plus grand trésor.",
  ],
  lion: [
    "Le Soleil brille avec une intensité particulière sur votre chemin. Votre magnétisme naturel attire l'attention bienveillante. C'est le moment de briller sans vous excuser.",
    "Votre générosité crée des cercles d'or autour de vous. Le leadership vous vient naturellement aujourd'hui. Partagez votre lumière et elle se multipliera.",
    "La confiance que vous irradiez est contagieuse. Votre créativité déborde de possibilités inexplorées. Le monde a besoin de votre flamboyance unique.",
  ],
  vierge: [
    "Mercure affine votre perception jusqu'à l'excellence. Les détails qui échappent aux autres vous révèlent des vérités profondes. Votre discernement est un don précieux.",
    "L'ordre que vous créez dans le chaos est une forme d'art. Votre souci du travail bien fait inspire ceux qui vous entourent. La perfection que vous recherchez est à portée de main.",
    "Votre analyse pénétrante éclaire les zones d'ombre. Un problème complexe trouve enfin sa solution grâce à votre méthode. La santé et le bien-être méritent votre attention aujourd'hui.",
  ],
  balance: [
    "Vénus harmonise toutes les sphères de votre existence. L'équilibre que vous recherchez n'est pas une illusion — il se construit patiemment. Une relation s'approfondit de manière significative.",
    "Votre sens de la justice guide vos décisions avec élégance. La beauté que vous créez autour de vous élève l'âme de ceux qui vous entourent. La diplomatie ouvre des portes fermées.",
    "Les deux plateaux de votre balance cherchent leur point d'équilibre parfait. Une décision importante gagne en clarté. Votre charme naturel facilite les négociations délicates.",
  ],
  scorpion: [
    "Pluton révèle ce qui était caché dans l'obscurité. Votre capacité à regarder la vérité en face est votre superpouvoir. Une transformation profonde est en cours, faites-lui confiance.",
    "Votre intensité magnétique attire des âmes qui méritent votre profondeur. Les secrets que vous gardez sont votre force. Une renaissance intérieure approche à grands pas.",
    "Les eaux profondes de votre psyché recèlent des trésors insoupçonnés. Votre pouvoir d'investigation perce les mystères. Ce que vous ressentez au plus profond est votre vérité.",
  ],
  sagittaire: [
    "Jupiter ouvre des horizons dont vous ne pouviez que rêver. L'aventure vous appelle depuis un territoire inexploré. Votre optimisme contagieux est une force transformatrice.",
    "La sagesse que vous avez acquise en chemin devient votre enseignement. Partager vos connaissances enrichit autant celui qui donne que celui qui reçoit. L'expansion est votre nature.",
    "La liberté est votre droit de naissance. Les voyages — de l'âme comme du corps — révèlent des vérités universelles. Votre quête de sens mène vers des réponses profondes.",
  ],
  capricorne: [
    "Saturne renforce votre détermination avec une sagesse ancestrale. Ce que vous bâtissez aujourd'hui durera des années. La patience est votre arme secrète contre les obstacles.",
    "Votre ambition est guidée par une boussole morale solide. Le sommet que vous visez est accessible à qui persévère. Les responsabilités d'aujourd'hui forgent les succès de demain.",
    "La structure que vous créez abrite ceux que vous aimez. Votre sens pratique transforme les rêves en réalités concrètes. Un objectif à long terme franchit une étape décisive.",
  ],
  verseau: [
    "Uranus active votre génie intuitif avec une électricité particulière. Vos idées avant-gardistes trouvent enfin un écho favorable. L'humanité a besoin de votre vision unique.",
    "Votre indépendance d'esprit est un cadeau rare dans ce monde. Les connexions que vous tisserez aujourd'hui transcendent les frontières ordinaires. L'innovation est votre langage maternel.",
    "Le futur que vous envisagez est plus proche qu'il n'y paraît. Votre capacité à penser autrement crée des solutions révolutionnaires. La communauté qui vous entoure s'enrichit de votre présence.",
  ],
  poissons: [
    "Neptune enveloppe votre âme dans un voile de mysticisme et de grâce. Votre empathie profonde touche les cœurs que la logique ne peut atteindre. Un rêve prémonitoire mérite votre attention.",
    "La frontière entre le réel et le divin s'amincit aujourd'hui. Votre créativité puise dans des sources universelles. Ce que vous ressentez est souvent plus juste que ce que vous pensez.",
    "Votre compassion naturelle est une force de guérison. Les âmes en peine trouvent en vous un refuge. L'art, la musique ou la spiritualité vous parlent avec une acuité particulière.",
  ],
};

const domains = ["Amour", "Travail", "Santé", "Finances", "Spiritualité", "Créativité"];

function getDayIndex(sign: string): number {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  const signIndex = ["belier", "taureau", "gemeaux", "cancer", "lion", "vierge", "balance", "scorpion", "sagittaire", "capricorne", "verseau", "poissons"].indexOf(sign);
  return (dayOfYear + signIndex * 7) % 3;
}

function getDomainScore(sign: string, domain: string): number {
  const today = new Date();
  const seed = today.getDate() + today.getMonth() * 31 + sign.charCodeAt(0) + domain.charCodeAt(0);
  return 50 + (seed * 17 + 13) % 51; // 50-100
}

const signEmojis: Record<string, string> = {
  belier: "♈", taureau: "♉", gemeaux: "♊", cancer: "♋",
  lion: "♌", vierge: "♍", balance: "♎", scorpion: "♏",
  sagittaire: "♐", capricorne: "♑", verseau: "♒", poissons: "♓",
};

const domainIcons: Record<string, string> = {
  Amour: "❤", Travail: "⚡", Santé: "✦", Finances: "◈", Spiritualité: "☽", Créativité: "✧",
};

export function getHoroscope(sign: string) {
  const normalizedSign = sign.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const messages = horoscopeMessages[normalizedSign] ?? horoscopeMessages["belier"];
  const msgIndex = getDayIndex(normalizedSign);
  const today = new Date();

  return {
    sign,
    date: today.toISOString().split("T")[0],
    message: messages[msgIndex],
    emoji: signEmojis[normalizedSign] ?? "✦",
    domains: domains.map((label) => ({
      label,
      icon: domainIcons[label] ?? "✦",
      score: getDomainScore(normalizedSign, label),
    })),
  };
}

export function getCompatibilityScore(sign1: string, sign2: string) {
  const s1 = sign1.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const s2 = sign2.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
  const elementMap: Record<string, string> = {
    belier: "feu", lion: "feu", sagittaire: "feu",
    taureau: "terre", vierge: "terre", capricorne: "terre",
    gemeaux: "air", balance: "air", verseau: "air",
    cancer: "eau", scorpion: "eau", poissons: "eau",
  };
  
  const compatMatrix: Record<string, Record<string, number>> = {
    feu: { feu: 85, terre: 55, air: 90, eau: 60 },
    terre: { feu: 55, terre: 80, air: 65, eau: 85 },
    air: { feu: 90, terre: 65, air: 80, eau: 70 },
    eau: { feu: 60, terre: 85, air: 70, eau: 88 },
  };

  const el1 = elementMap[s1] ?? "feu";
  const el2 = elementMap[s2] ?? "feu";
  const baseScore = compatMatrix[el1]?.[el2] ?? 70;
  
  // Add some variation based on specific signs
  const variation = (s1.charCodeAt(0) + s2.charCodeAt(0)) % 15 - 7;
  const overallScore = Math.min(99, Math.max(30, baseScore + variation));

  const messages: Record<string, string> = {
    excellent: "Une connexion cosmique rare et précieuse. Vos énergies se complètent avec une harmonie troublante. L'univers a tracé vos chemins pour se croiser.",
    bon: "Votre alchimie est prometteuse. Des défis existent, mais ils renforcent votre lien. Ensemble, vous êtes plus forts que séparément.",
    moyen: "Votre union demande du travail et de la compréhension mutuelle. Les différences qui vous séparent peuvent devenir vos plus grandes forces si vous les acceptez.",
    faible: "Les astres révèlent des tensions naturelles entre vos énergies. Cela ne signifie pas l'impossibilité — mais une leçon karmique à traverser ensemble.",
  };

  const msgKey = overallScore >= 80 ? "excellent" : overallScore >= 65 ? "bon" : overallScore >= 50 ? "moyen" : "faible";

  const domainLabels = ["Amour", "Amitié", "Communication", "Valeurs", "Passion"];
  const domains = domainLabels.map((label, i) => ({
    label,
    score: Math.min(99, Math.max(20, overallScore + ((s1.charCodeAt(i % s1.length) + i * 13) % 30) - 15)),
  }));

  return {
    sign1,
    sign2,
    overallScore,
    message: messages[msgKey],
    domains,
  };
}
