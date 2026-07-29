/* ==========================================================================
   DATA LOADER MODULE
   ========================================================================== */

export class DataLoader {
  constructor() {
    this.summaryData = null;
    this.countryDetailsData = null;
    this.geoMapData = null;
  }

  async loadAllData() {
    try {
      const [summaryRes, countryRes, geoRes] = await Promise.all([
        fetch('./data/olympics_summary.json'),
        fetch('./data/country_details.json'),
        fetch('./data/geojson_countries.json')
      ]);

      this.summaryData = await summaryRes.json();
      this.countryDetailsData = await countryRes.json();
      this.geoMapData = await geoRes.json();

      console.log('Todos os dados olímpicos carregados com sucesso!');
      return {
        summary: this.summaryData,
        countries: this.countryDetailsData,
        geoMap: this.geoMapData
      };
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      throw err;
    }
  }
}
