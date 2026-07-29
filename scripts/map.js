/* ==========================================================================
   INTERACTIVE WORLD MAP & GEOPOLITICS MODULE
   ========================================================================== */

export class MapModule {
  constructor(countryDetailsData, geoMapData) {
    this.countries = countryDetailsData;
    this.geoMap = geoMapData;
    this.selectedNoc = 'BRA'; // Default selection
    
    this.init();
  }

  init() {
    this.renderWorldMap();
    this.updateCountryPanel(this.selectedNoc);
  }

  renderWorldMap() {
    const svgContainer = document.getElementById('worldMapSvg');
    if (!svgContainer) return;

    // Create world map SVG projection or point heat markers for key NOCs
    // Equirectangular / mercator layout representation for world countries
    const width = 900;
    const height = 480;
    svgContainer.setAttribute('viewBox', `0 0 ${width} ${height}`);

    // Mercator projection formula for lat/lng to x/y
    const project = (lat, lng) => {
      const x = (lng + 180) * (width / 360);
      const latRad = lat * Math.PI / 180;
      const mercN = Math.log(Math.tan((Math.PI / 4) + (latRad / 2)));
      const y = (height / 2) - (width * mercN / (2 * Math.PI));
      return { x, y };
    };

    let svgHtml = `
      <rect width="${width}" height="${height}" fill="#0A0E1A" rx="16"/>
      <!-- Grid lines -->
      <path d="M 0 120 L ${width} 120 M 0 240 L ${width} 240 M 0 360 L ${width} 360" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
      <path d="M 225 0 L 225 ${height} M 450 0 L 450 ${height} M 675 0 L 675 ${height}" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
    `;

    // Render country markers/nodes
    this.geoMap.forEach(item => {
      const nocData = this.countries[item.noc];
      const medalPct = nocData ? nocData.fMedalRatioPct : 0;
      const totalF = nocData ? nocData.fAthletesCount : 0;

      const pos = project(item.lat, item.lng);

      // Color scale based on female medal ratio
      let color = '#64748B';
      let radius = 6;
      if (totalF > 0) {
        if (medalPct >= 50) {
          color = '#F59E0B'; // Gold / high female power
          radius = 12;
        } else if (medalPct >= 35) {
          color = '#EC4899'; // Magenta / strong female power
          radius = 10;
        } else if (medalPct >= 20) {
          color = '#8B5CF6'; // Purple
          radius = 8;
        } else {
          color = '#3B82F6'; // Blue
          radius = 6;
        }
      }

      svgHtml += `
        <g class="country-marker" data-noc="${item.noc}" transform="translate(${pos.x.toFixed(1)}, ${pos.y.toFixed(1)})">
          <circle r="${radius + 4}" fill="${color}" opacity="0.25" class="marker-pulse"/>
          <circle r="${radius}" fill="${color}" stroke="#FFFFFF" stroke-width="1.5"/>
          <text y="${radius + 14}" text-anchor="middle" fill="#CBD5E1" font-size="10" font-weight="700" font-family="Plus Jakarta Sans">${item.noc}</text>
        </g>
      `;
    });

    svgContainer.innerHTML = svgHtml;

    // Attach Event Listeners
    const markers = svgContainer.querySelectorAll('.country-marker');
    const tooltip = document.getElementById('mapTooltip');

    markers.forEach(marker => {
      marker.addEventListener('click', () => {
        const noc = marker.dataset.noc;
        this.selectedNoc = noc;
        this.updateCountryPanel(noc);
      });

      marker.addEventListener('mousemove', (e) => {
        const noc = marker.dataset.noc;
        const data = this.countries[noc];
        if (!data || !tooltip) return;

        tooltip.style.display = 'block';
        tooltip.style.left = (e.pageX + 15) + 'px';
        tooltip.style.top = (e.pageY - 15) + 'px';
        tooltip.innerHTML = `
          <strong>${data.region} (${data.noc})</strong><br/>
          ★ Mulheres no Time: ${data.fAthletesCount} (${data.fAthleteRatioPct}%)<br/>
          ★ Medalhas Femininas: ${data.fMedals.Total} (${data.fMedalRatioPct}% do total)
        `;
      });

      marker.addEventListener('mouseleave', () => {
        if (tooltip) tooltip.style.display = 'none';
      });
    });
  }

  updateCountryPanel(noc) {
    const data = this.countries[noc];
    if (!data) return;

    const panel = document.getElementById('countryDetailPanel');
    if (!panel) return;

    panel.innerHTML = `
      <div class="country-header">
        <div class="country-flag-icon">🌐</div>
        <div>
          <h3 class="country-name">${data.region}</h3>
          <span class="country-noc-code">NOC: ${data.noc}</span>
        </div>
      </div>

      <div class="metric-row">
        <span class="metric-label">Primeira Participação Feminina</span>
        <span class="metric-val" style="color: var(--gold);">${data.firstYearF || 'Sem registro'}</span>
      </div>

      <div class="metric-row">
        <span class="metric-label">Total de Atletas Femininas</span>
        <span class="metric-val">${data.fAthletesCount.toLocaleString()}</span>
      </div>

      <div class="metric-row">
        <span class="metric-label">Proporção no Time Nacional</span>
        <span class="metric-val" style="color: var(--magenta);">${data.fAthleteRatioPct}%</span>
      </div>
      <div class="progress-bar-bg">
        <div class="progress-bar-fill" style="width: ${data.fAthleteRatioPct}%;"></div>
      </div>

      <div style="margin-top: 1.5rem;" class="metric-row">
        <span class="metric-label">Medalhas Conquistadas por Mulheres</span>
        <span class="metric-val" style="color: var(--gold);">${data.fMedals.Total}</span>
      </div>
      <div class="metric-row">
        <span class="metric-label">Representação nas Medalhas do País</span>
        <span class="metric-val" style="color: var(--gold);">${data.fMedalRatioPct}%</span>
      </div>
      <div class="progress-bar-bg">
        <div class="progress-bar-fill" style="width: ${data.fMedalRatioPct}%; background: linear-gradient(90deg, #F59E0B, #EC4899);"></div>
      </div>

      <div style="margin-top: 1.5rem; font-size: 0.85rem; color: var(--text-muted); line-height: 1.4;">
        <p><strong>Detalhamento por Medalha (Mulheres):</strong></p>
        <p>🥇 Ouro: <strong>${data.fMedals.Gold}</strong> | 🥈 Prata: <strong>${data.fMedals.Silver}</strong> | 🥉 Bronzes: <strong>${data.fMedals.Bronze}</strong></p>
      </div>
    `;
  }
}
