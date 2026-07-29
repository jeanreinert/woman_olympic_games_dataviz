/* ==========================================================================
   HALL OF FAME & ATHLETE LEGENDS MODULE
   ========================================================================== */

export class HallOfFameModule {
  constructor(summaryData) {
    this.athletes = summaryData.topFemaleAthletes;
    this.filteredAthletes = [...this.athletes];
    
    this.init();
  }

  init() {
    this.renderGrid();
    this.setupSearchAndFilter();
    this.setupModal();
  }

  renderGrid() {
    const container = document.getElementById('hallGrid');
    if (!container) return;

    if (this.filteredAthletes.length === 0) {
      container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 3rem;">Nenhuma atleta encontrada.</div>`;
      return;
    }

    container.innerHTML = this.filteredAthletes.map(a => {
      const sportsStr = a.sports.join(', ');
      const initials = a.name.split(' ').map(n => n[0]).slice(0, 2).join('');

      return `
        <div class="athlete-card" data-id="${a.id}">
          <div>
            <div class="athlete-avatar">${initials}</div>
            <h4 class="athlete-name">${a.name}</h4>
            <div class="athlete-sport-noc">${a.region} (${a.noc}) • ${sportsStr}</div>
          </div>
          <div>
            <div style="font-size: 0.85rem; color: var(--text-muted);">
              Participações: <strong>${a.gamesCount} Olimpíadas</strong> (${a.firstYear} - ${a.lastYear})
            </div>
            <div class="athlete-medals-pills">
              <span class="medal-pill medal-gold">🥇 ${a.medals.Gold}</span>
              <span class="medal-pill medal-silver">🥈 ${a.medals.Silver}</span>
              <span class="medal-pill medal-bronze">🥉 ${a.medals.Bronze}</span>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Attach Click Event for Modal
    container.querySelectorAll('.athlete-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.dataset.id;
        const athlete = this.athletes.find(a => a.id.toString() === id);
        if (athlete) {
          this.openModal(athlete);
        }
      });
    });
  }

  setupSearchAndFilter() {
    const searchInput = document.getElementById('athleteSearchInput');
    searchInput?.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      this.filteredAthletes = this.athletes.filter(a => 
        a.name.toLowerCase().includes(q) ||
        a.region.toLowerCase().includes(q) ||
        a.noc.toLowerCase().includes(q) ||
        a.sports.some(s => s.toLowerCase().includes(q))
      );
      this.renderGrid();
    });
  }

  setupModal() {
    const modal = document.getElementById('athleteModal');
    const closeBtn = document.getElementById('modalCloseBtn');

    closeBtn?.addEventListener('click', () => {
      modal?.classList.remove('active');
    });

    modal?.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  }

  openModal(a) {
    const modal = document.getElementById('athleteModal');
    const content = document.getElementById('modalBody');
    if (!modal || !content) return;

    content.innerHTML = `
      <div style="text-align: center; margin-bottom: 1.5rem;">
        <div class="athlete-avatar" style="width: 80px; height: 80px; font-size: 2rem; margin: 0 auto 1rem;">${a.name.split(' ').map(n => n[0]).slice(0, 2).join('')}</div>
        <h2 style="font-family: var(--font-heading); font-size: 1.75rem; color: var(--text-main);">${a.name}</h2>
        <div style="color: var(--magenta); font-weight: 700; font-size: 1rem; margin-top: 0.25rem;">${a.region} (${a.noc}) • ${a.sports.join(', ')}</div>
      </div>

      <div class="glass-panel" style="padding: 1.5rem; margin-bottom: 1.5rem;">
        <h4 style="color: var(--gold); font-size: 1.1rem; margin-bottom: 0.75rem;">🏆 Quadro de Medalhas Olímpicas</h4>
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; text-align: center;">
          <div>
            <div style="font-size: 1.5rem; font-weight: 800; color: var(--gold);">🥇 ${a.medals.Gold}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">OURO</div>
          </div>
          <div>
            <div style="font-size: 1.5rem; font-weight: 800; color: #CBD5E1;">🥈 ${a.medals.Silver}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">PRATA</div>
          </div>
          <div>
            <div style="font-size: 1.5rem; font-weight: 800; color: #F59E0B;">🥉 ${a.medals.Bronze}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">BRONZE</div>
          </div>
          <div>
            <div style="font-size: 1.5rem; font-weight: 800; color: var(--magenta);">${a.medals.Total}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">TOTAL</div>
          </div>
        </div>
      </div>

      <div style="font-size: 0.95rem; color: var(--text-muted); line-height: 1.6;">
        <p style="margin-bottom: 0.75rem;"><strong>Jogos Disputados (${a.gamesCount}):</strong></p>
        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1rem;">
          ${a.games.map(g => `<span style="padding: 0.25rem 0.75rem; background: rgba(255,255,255,0.08); border-radius: 20px; font-size: 0.85rem; color: var(--text-main);">${g}</span>`).join('')}
        </div>
      </div>
    `;

    modal.classList.add('active');
  }
}
