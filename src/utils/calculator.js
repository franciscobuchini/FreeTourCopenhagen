// ─── TOUR CONFIGURATIONS ───────────────────────────────────────────────────────────
export const TOUR_DEFAULTS = {
  'Tivoli and Citytour':    { hours: 4,   venues: ['Tivoli'], transport: 'Bus + Caminata + Tivoli Entrance', sights: 'La Sirenita, Nyhavn, Amalienborg, Tivoli' },
  'City Highlight':         { hours: 4.5, venues: [], transport: 'Bus + Caminata', sights: 'Rådhuspladsen, Amalienborg, Canalside walk 2km, Nyhavn, Christiansborg (exterior), La Sirenita' },
  'Dragor Village':         { hours: 4,   venues: ['Coffee and Pastry'], transport: 'Bus + Paseo a pie', sights: 'La Sirenita, Dragør village walk, Coffee & Pastry' },
  'Walking Tour':           { hours: 3,   venues: [], transport: 'Bus + Caminata', sights: 'La Sirenita, Kastellet, Gefion Fountain, Amalienborg, Nyhavn, Regreso al puerto', busHours: 3 },
  'Panoramic Tour':         { hours: 3.5, venues: [], transport: 'Bus', sights: 'Vistas panorámicas principales' },
  'Private Transfers':      { hours: 1,   venues: [], transport: 'Traslado directo', sights: 'Aeropuerto ↔ Puerto u Hotel' },
};

function getMarkupPercentage(email, config) {
   // Safe fallback values
   const mCorp = config.markup_corporate !== undefined ? config.markup_corporate : 25;
   const mPers = config.markup_personal !== undefined ? config.markup_personal : 30;

   if (!email || !email.includes('@')) return mPers;

   const personalDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com', 'aol.com', 'live.com', 'msn.com', 'freetourcph.com'];
   const domain = email.split('@')[1].toLowerCase();
   
   return personalDomains.includes(domain) ? mPers : mCorp;
}

function getGuidePrice(hours, config) {
  // Guides are paid 0.5h extra for arrival, setup and group collection
  const billableHours = hours + 0.5;
  const hr = Math.min(Math.ceil(billableHours), 10);
  return config.guide_prices[hr] || config.guide_prices[10];
}

function getBusPrice(pax, hours, config, isDisembarking) {
  if (pax === 0) return { totalBusPrice: 0, busCount: 0, busType: 'No Bus', hr: 0 };

  const hr = Math.min(11, Math.ceil(hours));
  if (hr < 1) return { totalBusPrice: 0, busCount: 0, busType: 'No Bus', hr: 0 };
  let totalBusPrice = 0;
  let busTypesArr = [];
  let remainingPax = pax;

  // Luggage rule: Only 70% capacity for disembarking tours
  const capFactor = isDisembarking ? 0.7 : 1.0;
  const cap48 = Math.floor(48 * capFactor);
  const cap16 = Math.floor(16 * capFactor);
  const cap10 = Math.floor(10 * capFactor);
  const cap6 = Math.floor(6 * capFactor);

  // 1. Fill full 48-seater buses
  let num48 = Math.floor(remainingPax / cap48);
  if (num48 > 0) {
      const price48 = config.bus_prices_48[hr] || config.bus_prices_48[11];
      totalBusPrice += (price48 * num48);
      busTypesArr.push(`${num48}x 48-seater`);
      remainingPax = remainingPax % cap48;
  }

  // 2. Fit remainder in smallest possible bus
  if (remainingPax > 0) {
      let remainderBus = {};
      if (remainingPax <= cap6) {
          remainderBus.type = '6-seater';
          remainderBus.price = config.bus_prices_6[hr] || config.bus_prices_6[11];
      } else if (remainingPax <= cap10) {
          remainderBus.type = '10-seater';
          remainderBus.price = config.bus_prices_10[hr] || config.bus_prices_10[11];
      } else if (remainingPax <= cap16) {
          remainderBus.type = '16-seater';
          remainderBus.price = config.bus_prices_16[hr] || config.bus_prices_16[11];
      } else {
          // If remainder is between the cap of 16-seater and cap of 48-seater, we need another 48-seater!
          num48++;
          totalBusPrice += (config.bus_prices_48[hr] || config.bus_prices_48[11]);
          busTypesArr = [`${num48}x 48-seater`];
          remainingPax = 0; // consumed
      }
      
      if (remainingPax > 0) {
        totalBusPrice += remainderBus.price;
        busTypesArr.push(remainderBus.type);
      }
  }

  return {
    totalBusPrice: totalBusPrice,
    busCount: num48 + (remainingPax > 0 ? 1 : 0),
    busType: busTypesArr.join(' + '),
    hr: hr
  };
}

function getVenuePrices(venues, pax, startTime, config) {
  let total = 0;
  const breakdown = [];
  
  for (const venue of venues) {
    if (!venue || venue === 'No Venue') continue;
    
    let pricePerPax = config.venue_prices[venue];
    
    if (pricePerPax === null || pricePerPax === undefined) {
      return { error: 'OTHER_VENUE', message: `Cotización manual requerida para venue personalizado (${venue}).` };
    }
    
    const subtotal = pricePerPax * pax;
    total += subtotal;
    breakdown.push({ venue, pricePerPax, subtotal });
  }
  
  return { total, breakdown };
}

export const DEFAULT_TRANSFER_PRICES = {
  "City Transfers max 10 km": { "1-16": 1341, "17-30": 1534, "31-52": 1661, "53-57": null, "58-65": 1986, "66-80": null },
  "City Transfers night 22-05": { "1-16": 2553, "17-30": 2922, "31-52": 3334, "53-57": null, "58-65": 3972, "66-80": null },
  "Airport – Hotel/Langelinie bagage": { "1-16": 1723, "17-30": 1899, "31-52": 2076, "53-57": null, "58-65": 2483, "66-80": null },
  "Hotel/Langelinie – Airport bagage": { "1-16": 1341, "17-30": 1534, "31-52": 1661, "53-57": null, "58-65": 1986, "66-80": null },
  "Airport – Oceankaj bagage": { "1-16": 1815, "17-30": 2118, "31-52": 2191, "53-57": null, "58-65": 2979, "66-80": null },
  "Oceankaj – Airport bagage*": { "1-16": 1723, "17-30": 1899, "31-52": 2076, "53-57": null, "58-65": 2483, "66-80": null },
  "Langelinie – City visa/versa": { "1-16": 1341, "17-30": 1534, "31-52": 1661, "53-57": null, "58-65": 1986, "66-80": null },
  "Langelinie – City visa/versa bagage": { "1-16": 1539, "17-30": 1715, "31-52": 1891, "53-57": null, "58-65": 2298, "66-80": null },
  "Oceankaj – City visa/versa bagage": { "1-16": 1539, "17-30": 1715, "31-52": 1891, "53-57": null, "58-65": 2298, "66-80": null },
  "Oceankaj – City visa/versa": { "1-16": 1248, "17-30": 1442, "31-52": 1568, "53-57": null, "58-65": null, "66-80": null },
  "Oceankaj – Havnen/Norgeport visa/versa": { "1-16": 1341, "17-30": 1534, "31-52": 1661, "53-57": null, "58-65": 1986, "66-80": null },
  "Transfer ekstra stop": { "1-16": 277, "17-30": 369, "31-52": 369, "53-57": null, "58-65": 369, "66-80": null },
  "Trailer **": { "1-16": 410, "17-30": 513, "31-52": 513, "53-57": null, "58-65": 513, "66-80": null },
  "Luggage van 1200 kg Airport port visa/versa": { "1-16": 923, "17-30": 923, "31-52": 923, "53-57": 923, "58-65": 923, "66-80": 923 },
  "Luggage van 3 hours": { "1-16": 1333, "17-30": 1333, "31-52": 1333, "53-57": 1333, "58-65": 1333, "66-80": 1333 }
};

export function calculateQuote(input, config) {
  if (!config) {
      return { error: 'CONFIG_MISSING', message: 'Los precios base no se han cargado desde Supabase.' };
  }

  let hours, venues, finalBusHours;
  const isTransfer = input.tour === 'Private Transfers';
  let transferPrice = 0;
  const transferType = input.transferType || 'City Transfers max 10 km';

  if (isTransfer) {
    hours = 1;
    finalBusHours = 1;
    venues = [];
    
    // Retrieve transfer prices
    const tPrices = (config.custom_tours?._transfer_prices || DEFAULT_TRANSFER_PRICES)[transferType];
    if (!tPrices) {
      return { error: 'UNKNOWN_TRANSFER', message: `Traslado desconocido (${transferType}).` };
    }
    
    const pax = input.pax || 1;
    let price = null;
    if (pax >= 1 && pax <= 16) price = tPrices['1-16'];
    else if (pax >= 17 && pax <= 30) price = tPrices['17-30'];
    else if (pax >= 31 && pax <= 52) price = tPrices['31-52'];
    else if (pax >= 53 && pax <= 57) price = tPrices['53-57'];
    else if (pax >= 58 && pax <= 65) price = tPrices['58-65'];
    else if (pax >= 66 && pax <= 80) price = tPrices['66-80'];
    
    if (price === null || price === undefined || price === '—' || price === 'N/A' || String(price).trim() === '' || String(price).trim() === '—') {
      return { error: 'TRANSFER_CAPACITY_ERROR', message: `Capacidad no disponible para este traslado (${pax} pax).` };
    }
    
    transferPrice = Number(price);
  } else if (input.tour === 'OTHER') {
    hours = input.customHours || 4;
    finalBusHours = hours;
    const v = [input.venue1, input.venue2, input.venue3].filter(Boolean);
    venues = v;
  } else {
    // Check custom tours first, then defaults
    const combinedTours = { ...TOUR_DEFAULTS, ...(config.custom_tours || {}) };
    const defaults = combinedTours[input.tour];
    if (!defaults) return { error: 'UNKNOWN_TOUR' };
    hours = defaults.hours;
    venues = defaults.venues || [];
    finalBusHours = defaults.busHours || hours;
  }
  
  // Custom logic for guide requirement
  let needsGuide = true;
  if (input.tour === 'Private Transfers') {
    needsGuide = false;
  } else if (input.tour === 'OTHER') {
    needsGuide = input.needsGuide !== false;
  }
  
  // Calculate bus and guide prices
  const busInfo = isTransfer ? {
    totalBusPrice: transferPrice,
    busCount: 1,
    busType: transferType,
    hr: 1
  } : getBusPrice(input.pax, finalBusHours, config, input.isDisembarking === 'Yes');
  
  const baseGuidePrice = needsGuide ? getGuidePrice(hours, config) : 0;
  const guidePrice = baseGuidePrice * busInfo.busCount;
  
  const venueResult = getVenuePrices(venues, input.pax, input.startTime, config);
  if (venueResult.error) return venueResult;
  
  const netTotal = guidePrice + busInfo.totalBusPrice + venueResult.total;
  
  // Calculate Markup
  const markupPercent = getMarkupPercentage(input.email || '', config);
  const marginValue = netTotal * (markupPercent / 100);
  const totalPrice = netTotal + marginValue;
  
  return {
    success: true,
    summary: {
      tour: input.tour,
      transferType: isTransfer ? transferType : undefined,
      name: input.name,
      email: input.email,
      pax: input.pax,
      date: input.date,
      startTime: input.startTime,
      language: input.language,
      hours: hours,
      isDisembarking: input.isDisembarking,
    },
    breakdown: {
      guidePrice:      guidePrice,
      guideHours:      needsGuide ? hours + 0.5 : 0,
      busPrice: busInfo.totalBusPrice,
      busCount: busInfo.busCount,
      guideCount: needsGuide ? busInfo.busCount : 0,
      busType: busInfo.busType,
      venues: venueResult.breakdown,
      venueTotal: venueResult.total,
      netTotal: netTotal,
      markupPercent: markupPercent,
      marginValue: marginValue
    },
    totalPrice: Math.round(totalPrice), // Round to full DKK
    currency: 'DKK'
  };
}
