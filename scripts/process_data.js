const fs = require('fs');
const readline = require('readline');
const path = require('path');

const csvPath = path.join(__dirname, '../athlete_events.csv');
const nocPath = path.join(__dirname, '../noc_regions.csv');
const outputDir = path.join(__dirname, '../data');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// CSV Parser
function parseCSVLine(line) {
  const result = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(cur);
      cur = '';
    } else {
      cur += char;
    }
  }
  result.push(cur);
  return result.map(s => s.replace(/^"|"$/g, '').trim());
}

// Milestone events lookup
const MILESTONES = {
  1896: {
    title: "Proibição Total",
    description: "Em Atenas 1896, Pierre de Coubertin proibiu a participação de mulheres, afirmando que a presença feminina seria 'imprópria e anti-estética'."
  },
  1900: {
    title: "Primeiras Mulheres na História",
    description: "Em Paris 1900, 23 mulheres participaram (1,8% do total) em 5 modalidades (Tênis, Golfe, Vela, Croquet, Hípica). Hélène de Pourtalès (Vela) torna-se a 1ª mulher campeã olímpica."
  },
  1912: {
    title: "Natação e Saltos Ornamentais",
    description: "Em Estocolmo 1912, a natação feminina é introduzida. Fanny Durack (Austrália) conquista o ouro nos 100m livre."
  },
  1928: {
    title: "Estreia no Atletismo & Ginástica",
    description: "Em Amsterdã 1928, o atletismo e a ginástica feminina fazem sua estreia. A imprensa tentou banir os 800m alegando que a distância causava 'exaustão excessiva'."
  },
  1936: {
    title: "Pioneiras em Berlim",
    description: "O número de atletas femininas salta para 331. Treudl Beiser e Christl Cranz dominam no Esqui Alpino."
  },
  1948: {
    title: "A 'Dona de Casa Voadora'",
    description: "Em Londres 1948, Fanny Blankers-Koen (Holanda), mãe de 2 filhos, vence 4 medalhas de ouro no atletismo, destruindo preconceitos da época."
  },
  1952: {
    title: "Entrada da União Soviética & Equitação Mista",
    description: "Em Helsinque 1952, a União Soviética estreia e traz um enorme contingente feminino. Lis Hartel (dinamarquesa com poliomielite) ganha prata no Adestramento Misto."
  },
  1964: {
    title: "As 'Bruxas das Galáxias' do Vôlei",
    description: "Em Tóquio 1964, o Vôlei feminino estreia e a seleção do Japão conquista o ouro com uma campanha inesquecível."
  },
  1976: {
    title: "A Nota 10 Perfeita de Nadia",
    description: "Em Montreal 1976, Nadia Comăneci (Romênia) de 14 anos faz história ao conquistar a primeira nota 10.0 perfeita na ginástica artística."
  },
  1984: {
    title: "Maratona Feminina & Pioneira Árabe",
    description: "Em Los Angeles 1984, estreia a Maratona Feminina (vitória de Joan Benoit). Nawal El Moutawakel (Marrocos) torna-se a 1ª mulher muçulmana a conquistar um ouro olímpico."
  },
  1996: {
    title: "O Ano das Mulheres",
    description: "Em Atlanta 1996, o Futebol e o Basquete feminino atingem enorme destaque global. O Brasil conquista o Ouro no Vôlei de Praia com Jaqueline & Sandra."
  },
  2004: {
    title: "Lutas e Halterofilismo",
    description: "Em Atenas 2004, Luta Olímpica feminina é incluída. Esportes de força e combate passam a ter presença feminina consolidada."
  },
  2012: {
    title: "Paridade de Países & Boxe Feminino",
    description: "Em Londres 2012, pela primeira vez na história, TODAS as delegações participantes incluíram mulheres (incluindo Arábia Saudita, Catar e Brunei) e todas as modalidades contavam com provas femininas."
  },
  2016: {
    title: "O Esquadrão de Ouro Feminino",
    description: "Em Rio 2016, Simone Biles e Katie Ledecky quebram recordes históricos. Rafaela Silva ganha o 1º ouro do Brasil na Favela da Cidade de Deus."
  }
};

async function processData() {
  console.log("Iniciando pré-processamento dos dados olímpicos...");

  // Load NOC mapping
  const nocMap = {};
  const nocRaw = fs.readFileSync(nocPath, 'utf8');
  const nocLines = nocRaw.split(/\r?\n/);
  for (let l of nocLines) {
    if (!l.trim()) continue;
    const parts = parseCSVLine(l);
    if (parts.length >= 2 && parts[0] !== 'NOC') {
      nocMap[parts[0]] = parts[1];
    }
  }

  // Data Containers
  const editions = {};
  const femaleAthletes = {};
  const nocStats = {};
  const physicalByDecade = {};
  const sportsFemaleHistory = {}; // Sport -> { firstYear: 9999, totalAthletes: Set, totalEvents: Set }

  const fileStream = fs.createReadStream(csvPath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let isHeader = true;

  for await (const line of rl) {
    if (isHeader) {
      isHeader = false;
      continue;
    }

    const row = parseCSVLine(line);
    if (row.length < 15) continue;

    const [id, name, sex, ageStr, heightStr, weightStr, team, noc, games, yearStr, season, city, sport, event, medal] = row;
    const year = parseInt(yearStr);
    if (isNaN(year)) continue;

    const age = parseFloat(ageStr);
    const height = parseFloat(heightStr);
    const weight = parseFloat(weightStr);

    const editionKey = `${year} ${season}`;
    if (!editions[editionKey]) {
      editions[editionKey] = {
        year,
        season,
        city,
        mAthletes: new Set(),
        fAthletes: new Set(),
        mSports: new Set(),
        fSports: new Set(),
        mEvents: new Set(),
        fEvents: new Set(),
        mNocs: new Set(),
        fNocs: new Set(),
        mMedals: { Gold: 0, Silver: 0, Bronze: 0 },
        fMedals: { Gold: 0, Silver: 0, Bronze: 0 }
      };
    }

    const ed = editions[editionKey];
    if (sex === 'F') {
      ed.fAthletes.add(id);
      ed.fSports.add(sport);
      ed.fEvents.add(event);
      ed.fNocs.add(noc);
      if (medal && medal !== 'NA') {
        ed.fMedals[medal] = (ed.fMedals[medal] || 0) + 1;
      }

      // Sports history
      if (!sportsFemaleHistory[sport]) {
        sportsFemaleHistory[sport] = { firstYear: year, fAthletes: new Set(), fEvents: new Set() };
      }
      sportsFemaleHistory[sport].fAthletes.add(id);
      sportsFemaleHistory[sport].fEvents.add(event);
      if (year < sportsFemaleHistory[sport].firstYear) {
        sportsFemaleHistory[sport].firstYear = year;
      }
    } else {
      ed.mAthletes.add(id);
      ed.mSports.add(sport);
      ed.mEvents.add(event);
      ed.mNocs.add(noc);
      if (medal && medal !== 'NA') {
        ed.mMedals[medal] = (ed.mMedals[medal] || 0) + 1;
      }
    }

    // Female Athletes highlight
    if (sex === 'F') {
      if (!femaleAthletes[id]) {
        femaleAthletes[id] = {
          id,
          name,
          noc,
          region: nocMap[noc] || noc,
          sports: new Set(),
          medals: { Gold: 0, Silver: 0, Bronze: 0, Total: 0 },
          games: new Set(),
          events: new Set(),
          firstYear: year,
          lastYear: year
        };
      }
      const fa = femaleAthletes[id];
      fa.sports.add(sport);
      fa.games.add(games);
      fa.events.add(event);
      if (year < fa.firstYear) fa.firstYear = year;
      if (year > fa.lastYear) fa.lastYear = year;
      if (medal && medal !== 'NA') {
        fa.medals[medal] = (fa.medals[medal] || 0) + 1;
        fa.medals.Total += 1;
      }
    }

    // NOC stats
    const regionName = nocMap[noc] || noc;
    if (!nocStats[noc]) {
      nocStats[noc] = {
        noc,
        region: regionName,
        fAthletes: new Set(),
        mAthletes: new Set(),
        fMedals: { Gold: 0, Silver: 0, Bronze: 0, Total: 0 },
        mMedals: { Gold: 0, Silver: 0, Bronze: 0, Total: 0 },
        firstYearF: 9999,
        firstYearM: 9999,
        fEditions: new Set(),
        byYear: {}
      };
    }
    const ns = nocStats[noc];
    if (!ns.byYear[year]) {
      ns.byYear[year] = { fAthletes: new Set(), mAthletes: new Set(), fMedals: 0, mMedals: 0 };
    }
    const yStat = ns.byYear[year];

    if (sex === 'F') {
      ns.fAthletes.add(id);
      ns.fEditions.add(editionKey);
      yStat.fAthletes.add(id);
      if (year < ns.firstYearF) ns.firstYearF = year;
      if (medal && medal !== 'NA') {
        ns.fMedals[medal] = (ns.fMedals[medal] || 0) + 1;
        ns.fMedals.Total += 1;
        yStat.fMedals += 1;
      }
    } else {
      ns.mAthletes.add(id);
      yStat.mAthletes.add(id);
      if (year < ns.firstYearM) ns.firstYearM = year;
      if (medal && medal !== 'NA') {
        ns.mMedals[medal] = (ns.mMedals[medal] || 0) + 1;
        ns.mMedals.Total += 1;
        yStat.mMedals += 1;
      }
    }

    // Biometrics by decade and sport category
    if (sex === 'F') {
      const decade = Math.floor(year / 10) * 10;
      if (!physicalByDecade[decade]) {
        physicalByDecade[decade] = { height: [], weight: [], age: [], sports: {} };
      }
      const dec = physicalByDecade[decade];
      if (!isNaN(height) && height > 120 && height < 220) dec.height.push(height);
      if (!isNaN(weight) && weight > 30 && weight < 180) dec.weight.push(weight);
      if (!isNaN(age) && age > 10 && age < 80) dec.age.push(age);

      if (!dec.sports[sport]) {
        dec.sports[sport] = { height: [], weight: [], age: [] };
      }
      const spDec = dec.sports[sport];
      if (!isNaN(height)) spDec.height.push(height);
      if (!isNaN(weight)) spDec.weight.push(weight);
      if (!isNaN(age)) spDec.age.push(age);
    }
  }

  // Format Summary / Timeline Data
  const editionsList = Object.values(editions).map(e => {
    const fCount = e.fAthletes.size;
    const mCount = e.mAthletes.size;
    const total = fCount + mCount;
    return {
      edition: `${e.year} ${e.season}`,
      year: e.year,
      season: e.season,
      city: e.city,
      fAthletesCount: fCount,
      mAthletesCount: mCount,
      totalAthletes: total,
      fRatioPct: total > 0 ? parseFloat(((fCount / total) * 100).toFixed(2)) : 0,
      fSportsCount: e.fSports.size,
      mSportsCount: e.mSports.size,
      fEventsCount: e.fEvents.size,
      mEventsCount: e.mEvents.size,
      fNocsCount: e.fNocs.size,
      mNocsCount: e.mNocs.size,
      fMedalsTotal: e.fMedals.Gold + e.fMedals.Silver + e.fMedals.Bronze,
      mMedalsTotal: e.mMedals.Gold + e.mMedals.Silver + e.mMedals.Bronze,
      milestone: MILESTONES[e.year] || null
    };
  }).sort((a, b) => a.year - b.year || a.season.localeCompare(b.season));

  // Format Physical Trends
  const avg = arr => arr.length ? parseFloat((arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1)) : null;

  const physicalTrends = Object.keys(physicalByDecade).sort().map(d => {
    const data = physicalByDecade[d];
    return {
      decade: parseInt(d),
      avgHeight: avg(data.height),
      avgWeight: avg(data.weight),
      avgAge: avg(data.age),
      sampleCount: data.age.length
    };
  });

  // Sports summary
  const sportsList = Object.keys(sportsFemaleHistory).map(sport => ({
    sport,
    firstYear: sportsFemaleHistory[sport].firstYear,
    fAthletesCount: sportsFemaleHistory[sport].fAthletes.size,
    fEventsCount: sportsFemaleHistory[sport].fEvents.size
  })).sort((a, b) => a.firstYear - b.firstYear || b.fAthletesCount - a.fAthletesCount);

  // Format NOCs JSON
  const formattedNocs = {};
  Object.values(nocStats).forEach(ns => {
    const fTotalAth = ns.fAthletes.size;
    const mTotalAth = ns.mAthletes.size;
    const totalAth = fTotalAth + mTotalAth;
    const fTotalMed = ns.fMedals.Total;
    const mTotalMed = ns.mMedals.Total;
    const totalMed = fTotalMed + mTotalMed;

    if (totalAth > 0) {
      formattedNocs[ns.noc] = {
        noc: ns.noc,
        region: ns.region,
        fAthletesCount: fTotalAth,
        mAthletesCount: mTotalAth,
        totalAthletes: totalAth,
        fAthleteRatioPct: parseFloat(((fTotalAth / totalAth) * 100).toFixed(1)),
        fMedals: ns.fMedals,
        mMedals: ns.mMedals,
        totalMedals: totalMed,
        fMedalRatioPct: totalMed > 0 ? parseFloat(((fTotalMed / totalMed) * 100).toFixed(1)) : 0,
        firstYearF: ns.firstYearF === 9999 ? null : ns.firstYearF,
        firstYearM: ns.firstYearM === 9999 ? null : ns.firstYearM,
        byYear: Object.keys(ns.byYear).reduce((acc, y) => {
          acc[y] = {
            fCount: ns.byYear[y].fAthletes.size,
            mCount: ns.byYear[y].mAthletes.size,
            fMedals: ns.byYear[y].fMedals,
            mMedals: ns.byYear[y].mMedals
          };
          return acc;
        }, {})
      };
    }
  });

  // Top female legends
  const topFemaleAthletes = Object.values(femaleAthletes)
    .sort((a, b) => b.medals.Total - a.medals.Total || b.medals.Gold - a.medals.Gold)
    .slice(0, 50)
    .map(a => ({
      id: a.id,
      name: a.name,
      noc: a.noc,
      region: a.region,
      sports: Array.from(a.sports),
      gamesCount: a.games.size,
      medals: a.medals,
      games: Array.from(a.games),
      firstYear: a.firstYear,
      lastYear: a.lastYear
    }));

  const mainSummary = {
    editionsList,
    physicalTrends,
    sportsList,
    topFemaleAthletes
  };

  fs.writeFileSync(path.join(outputDir, 'olympics_summary.json'), JSON.stringify(mainSummary, null, 2));
  fs.writeFileSync(path.join(outputDir, 'country_details.json'), JSON.stringify(formattedNocs, null, 2));

  console.log("Dados salvos com sucesso em:", outputDir);
}

processData().catch(err => console.error(err));
