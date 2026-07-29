const fs = require('fs');
const path = require('path');

// NOC to GeoJSON / SVG Country mapping with simplified polygon data or lat/lng coordinates and ISO-3 codes
const countryGeoData = [
  { noc: "USA", iso: "USA", name: "Estados Unidos", lat: 37.0902, lng: -95.7129, path: "M 150 150 L 220 150 L 220 200 L 150 200 Z" },
  { noc: "BRA", iso: "BRA", name: "Brasil", lat: -14.235, lng: -51.9253 },
  { noc: "CHN", iso: "CHN", name: "China", lat: 35.8617, lng: 104.1954 },
  { noc: "GER", iso: "GER", name: "Alemanha", lat: 51.1657, lng: 10.4515 },
  { noc: "GBR", iso: "GBR", name: "Reino Unido", lat: 55.3781, lng: -3.436 },
  { noc: "FRA", iso: "FRA", name: "França", lat: 46.2276, lng: 2.2137 },
  { noc: "RUS", iso: "RUS", name: "Rússia", lat: 61.524, lng: 105.3188 },
  { noc: "URS", iso: "RUS", name: "União Soviética", lat: 60.0, lng: 90.0 },
  { noc: "GDR", iso: "DEU", name: "Alemanha Oriental", lat: 52.5, lng: 13.4 },
  { noc: "ROU", iso: "ROU", name: "Romênia", lat: 45.9432, lng: 24.9668 },
  { noc: "NED", iso: "NLD", name: "Holanda", lat: 52.1326, lng: 5.2913 },
  { noc: "AUS", iso: "AUS", name: "Austrália", lat: -25.2744, lng: 133.7751 },
  { noc: "CAN", iso: "CAN", name: "Canadá", lat: 56.1304, lng: -106.3468 },
  { noc: "JPN", iso: "JPN", name: "Japão", lat: 36.2048, lng: 138.2529 },
  { noc: "ITA", iso: "ITA", name: "Itália", lat: 41.8719, lng: 12.5674 },
  { noc: "ESP", iso: "ESP", name: "Espanha", lat: 40.4637, lng: -3.7492 },
  { noc: "KOR", iso: "KOR", name: "Coreia do Sul", lat: 35.9078, lng: 127.7669 },
  { noc: "JAM", iso: "JAM", name: "Jamaica", lat: 18.1096, lng: -77.2975 },
  { noc: "CUB", iso: "CUB", name: "Cuba", lat: 21.5218, lng: -77.7812 },
  { noc: "KEN", iso: "KEN", name: "Quênia", lat: -0.0236, lng: 37.9062 },
  { noc: "ETH", iso: "ETH", name: "Etiópia", lat: 9.145, lng: 40.4897 },
  { noc: "NZL", iso: "NZL", name: "Nova Zelândia", lat: -40.9006, lng: 174.886 },
  { noc: "NOR", iso: "NOR", name: "Noruega", lat: 60.472, lng: 8.4689 },
  { noc: "SWE", iso: "SWE", name: "Suécia", lat: 60.1282, lng: 18.6435 },
  { noc: "FIN", iso: "FIN", name: "Finlândia", lat: 61.9241, lng: 25.7482 },
  { noc: "HUN", iso: "HUN", name: "Hungria", lat: 47.1625, lng: 19.5033 },
  { noc: "POL", iso: "POL", name: "Polônia", lat: 51.9194, lng: 19.1451 },
  { noc: "MEX", iso: "MEX", name: "México", lat: 23.6345, lng: -102.5528 },
  { noc: "ARG", iso: "ARG", name: "Argentina", lat: -38.4161, lng: -63.6167 },
  { noc: "RSA", iso: "ZAF", name: "África do Sul", lat: -30.5595, lng: 22.9375 },
  { noc: "EGY", iso: "EGY", name: "Egito", lat: 26.8206, lng: 30.8025 },
  { noc: "MAR", iso: "MAR", name: "Marrocos", lat: 31.7917, lng: -7.0926 },
  { noc: "IND", iso: "IND", name: "Índia", lat: 20.5937, lng: 78.9629 },
  { noc: "TUR", iso: "TUR", name: "Turquia", lat: 38.9637, lng: 35.2433 },
  { noc: "UKR", iso: "UKR", name: "Ucrânia", lat: 48.3794, lng: 31.1656 },
  { noc: "BLR", iso: "BLR", name: "Bielorrússia", lat: 53.7098, lng: 27.9534 },
  { noc: "KSA", iso: "SAU", name: "Arábia Saudita", lat: 23.8859, lng: 45.0792 },
  { noc: "QAT", iso: "QAT", name: "Catar", lat: 25.3548, lng: 51.1839 },
  { noc: "BRN", iso: "BHR", name: "Bahrein", lat: 26.0667, lng: 50.5577 }
];

fs.writeFileSync(
  path.join(__dirname, '../data/geojson_countries.json'),
  JSON.stringify(countryGeoData, null, 2)
);
console.log("Mapa de geolocalização salvo com sucesso!");
