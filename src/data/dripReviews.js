// src/data/dripReviews.js

const names = [
  "Laura", "Carlos", "Giulia", "Mark", "Emma", "David", "Sofia", "Alejandro", 
  "Marco", "Sophie", "Lucas", "Elena", "Francesco", "Sarah", "Mateo", 
  "Anna", "Daniel", "Martina", "Thomas", "Lucia", "John", "Maria", "Alessandro"
];

const countriesES = ["España", "Argentina", "México", "Colombia", "Chile"];
const countriesEN = ["UK", "USA", "Canada", "Australia", "Ireland"];
const countriesIT = ["Italia", "Svizzera"];

const templatesES = [
  "El tour fue muy bueno. El guía fue muy amable, nos explicó dónde ir a comer barato y qué puntos visitar.",
  "Excelente experiencia. El guía nos dio súper recomendaciones para comer a buen precio y lugares para conocer.",
  "¡Recomendadísimo! Un tour fantástico con un guía amabilísimo que nos recomendó sitios baratos y ricos para comer.",
  "La pasamos genial, muy buena información histórica y los mejores tips para ahorrar en comida.",
  "Muy buen tour, súper entretenido. Las recomendaciones de dónde comer barato nos salvaron el viaje."
];

const templatesEN = [
  "The tour was very good. The guide was extremely friendly and explained exactly where to eat cheap and what to visit.",
  "Amazing experience! The guide was very kind and gave us great tips for cheap food and places to see.",
  "Great tour! Guide was awesome, showed us all the best spots and affordable local restaurants.",
  "Highly recommended. We got a great overview of the city and some excellent tips on where to eat on a budget.",
  "Very informative and fun! The guide's tips for cheap eats were totally worth it."
];

const templatesIT = [
  "Il tour è stato molto bello. La guida è stata molto gentile e ci ha spiegato dove mangiare a poco prezzo e cosa visitare.",
  "Bellissima esperienza! Guida simpaticissima e tanti consigli su dove mangiare in modo economico.",
  "Consigliatissimo! Ottima introduzione alla città con fantastici suggerimenti per ristoranti economici.",
  "Tour perfetto, molto interessante e le dritte su dove mangiare a basso costo sono state utilissime."
];

// Deterministic random generator
function seededRandom(seed) {
  let x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

const generateReviews = () => {
  const reviews = [];
  let seed = 12345;

  for (let i = 0; i < 100; i++) {
    // 40% ES, 40% EN, 20% IT
    const langRoll = seededRandom(seed++);
    let lang = 'en';
    if (langRoll < 0.4) lang = 'es';
    else if (langRoll < 0.8) lang = 'en';
    else lang = 'it';

    const name = names[Math.floor(seededRandom(seed++) * names.length)];
    let country = "";
    let text = "";

    if (lang === 'es') {
      country = countriesES[Math.floor(seededRandom(seed++) * countriesES.length)];
      text = templatesES[Math.floor(seededRandom(seed++) * templatesES.length)];
    } else if (lang === 'en') {
      country = countriesEN[Math.floor(seededRandom(seed++) * countriesEN.length)];
      text = templatesEN[Math.floor(seededRandom(seed++) * templatesEN.length)];
    } else {
      country = countriesIT[Math.floor(seededRandom(seed++) * countriesIT.length)];
      text = templatesIT[Math.floor(seededRandom(seed++) * templatesIT.length)];
    }

    const rating = seededRandom(seed++) > 0.8 ? 4 : 5; // 80% 5 stars, 20% 4 stars
    
    // Group distribution
    const groupRoll = seededRandom(seed++);
    let group = 'Couple';
    if (groupRoll < 0.3) group = 'Single';
    else if (groupRoll > 0.7) group = 'Group';

    reviews.push({
      id: `drip-${i}`,
      name,
      country,
      group,
      rating,
      text,
      source: 'drip',
      tour: 'Tour01' // We will overwrite this dynamically in Reviews.jsx so it applies to any tour
    });
  }
  return reviews;
};

export const dripReviewsList = generateReviews();
