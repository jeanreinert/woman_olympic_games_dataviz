/* ==========================================================================
   COUNTRY COMPARATOR MODULE
   ========================================================================== */

export class ComparatorModule {
  constructor(countriesData) {
    this.countries = countriesData;
    this.countryA = 'BRA';
    this.countryB = 'CHN';
    
    this.init();
  }

  init() {
    this.populateDropdowns();
    this.renderComparison();
    this.setupListeners();
  }

  populateDropdowns() {
    const selA = document.getElementById('countrySelectA');
    const selB = document.getElementById('countrySelectB');
    if (!selA || !selB) return;

    const list = Object.values(this.countries)
      .filter(c => c.totalAthletes > 50)
      .sort((a, b) => a.region.localeCompare(b.region));

    const optionsHtml = list.map(c => `<option value="${c.noc}">${c.region} (${c.noc})</option>`).join('');

    selA.innerHTML = optionsHtml;
    selB.innerHTML = optionsHtml;

    selA.value = this.countryA;
    selB.value = this.countryB;
  }

  setupListeners() {
    const selA = document.getElementById('countrySelectA');
    const selB = document.getElementById('countrySelectB');

    selA?.addEventListener('change', (e) => {
      this.countryA = e.target.value;
      this.renderComparison();
    });

    selB?.addEventListener('change', (e) => {
      this.countryB = e.target.value;
      this.renderComparison();
    });
  }

  renderComparison() {
    const cA = this.countries[this.countryA];
    const cB = this.countries[this.countryB];
    if (!cA || !cB) return;

    const container = document.getElementById('comparatorResults');
    if (!container) return;

    container.innerHTML = `
      <div class="comparator-grid">
        <!-- Country A -->
        <div class="glass-panel comparator-card">
          <div class="country-header">
            <div class="country-flag-icon">🏆</div>
            <div>
              <h3 class="country-name">${cA.region}</h3>
              <span class="country-noc-code">NOC: ${cA.noc}</span>
            </div>
          </div>

          <div class="comparison-metric">
            <div class="metric-values">
              <span>% Medalhas Femininas</span>
              <span style="color: var(--gold);">${cA.fMedalRatioPct}%</span>
            </div>
            <div class="progress-bar-bg">
              <div class="progress-bar-fill" style="width: ${cA.fMedalRatioPct}%; background: linear-gradient(90deg, var(--gold), var(--magenta));"></div>
            </div>
          </div>

          <div class="comparison-metric">
            <div class="metric-values">
              <span>% Atletas Femininas</span>
              <span style="color: var(--magenta);">${cA.fAthleteRatioPct}%</span>
            </div>
            <div class="progress-bar-bg">
              <div class="progress-bar-fill" style="width: ${cA.fAthleteRatioPct}%;"></div>
            </div>
          </div>

          <div class="metric-row" style="margin-top: 1.5rem;">
            <span class="metric-label">Primeira Participação Feminina</span>
            <span class="metric-val">${cA.firstYearF || 'Sem registro'}</span>
          </div>
          <div class="metric-row">
            <span class="metric-label">Total Medalhas (Mulheres)</span>
            <span class="metric-val" style="color: var(--gold);">${cA.fMedals.Total}</span>
          </div>
          <div class="metric-row">
            <span class="metric-label">Total Atletas (Mulheres)</span>
            <span class="metric-val">${cA.fAthletesCount.toLocaleString()}</span>
          </div>
        </div>

        <!-- Country B -->
        <div class="glass-panel comparator-card">
          <div class="country-header">
            <div class="country-flag-icon">⭐</div>
            <div>
              <h3 class="country-name">${cB.region}</h3>
              <span class="country-noc-code">NOC: ${cB.noc}</span>
            </div>
          </div>

          <div class="comparison-metric">
            <div class="metric-values">
              <span>% Medalhas Femininas</span>
              <span style="color: var(--gold);">${cB.fMedalRatioPct}%</span>
            </div>
            <div class="progress-bar-bg">
              <div class="progress-bar-fill" style="width: ${cB.fMedalRatioPct}%; background: linear-gradient(90deg, var(--gold), var(--magenta));"></div>
            </div>
          </div>

          <div class="comparison-metric">
            <div class="metric-values">
              <span>% Atletas Femininas</span>
              <span style="color: var(--magenta);">${cB.fAthleteRatioPct}%</span>
            </div>
            <div class="progress-bar-bg">
              <div class="progress-bar-fill" style="width: ${cB.fAthleteRatioPct}%;"></div>
            </div>
          </div>

          <div class="metric-row" style="margin-top: 1.5rem;">
            <span class="metric-label">Primeira Participação Feminina</span>
            <span class="metric-val">${cB.firstYearF || 'Sem registro'}</span>
          </div>
          <div class="metric-row">
            <span class="metric-label">Total Medalhas (Mulheres)</span>
            <span class="metric-val" style="color: var(--gold);">${cB.fMedals.Total}</span>
          </div>
          <div class="metric-row">
            <span class="metric-label">Total Atletas (Mulheres)</span>
            <span class="metric-val">${cB.fAthletesCount.toLocaleString()}</span>
          </div>
        </div>
      </div>
    `;
  }
}
