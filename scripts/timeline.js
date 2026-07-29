/* ==========================================================================
   TIMELINE CHART & MILESTONES MODULE
   ========================================================================== */

export class TimelineModule {
  constructor(summaryData) {
    this.editionsList = summaryData.editionsList.filter(e => e.season === 'Summer');
    this.chart = null;
    this.currentMode = 'ratio'; // 'ratio', 'athletes', 'sports'

    this.init();
  }

  init() {
    this.renderMilestoneCards();
    this.setupChart();
    this.setupToggleButtons();
  }

  setupChart() {
    const ctx = document.getElementById('timelineChart')?.getContext('2d');
    if (!ctx) return;

    const labels = this.editionsList.map(e => e.year);
    const fRatioData = this.editionsList.map(e => e.fRatioPct);
    const mRatioData = this.editionsList.map(e => (100 - e.fRatioPct).toFixed(2));

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: '% Atletas Mulheres',
            data: fRatioData,
            borderColor: '#EC4899',
            backgroundColor: 'rgba(236, 72, 153, 0.25)',
            fill: true,
            tension: 0.35,
            borderWidth: 3,
            pointBackgroundColor: '#EC4899',
            pointRadius: 5,
            pointHoverRadius: 8
          },
          {
            label: '% Atletas Homens',
            data: mRatioData,
            borderColor: '#3B82F6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            fill: true,
            tension: 0.35,
            borderWidth: 2,
            borderDash: [4, 4],
            pointRadius: 3
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          legend: {
            labels: {
              color: '#F8FAFC',
              font: { family: 'Plus Jakarta Sans', size: 13, weight: 600 }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            borderColor: '#EC4899',
            borderWidth: 1,
            titleColor: '#F8FAFC',
            bodyColor: '#CBD5E1',
            padding: 12,
            callbacks: {
              afterBody: (context) => {
                const index = context[0].dataIndex;
                const ed = this.editionsList[index];
                let text = `Total Atletas: ${ed.totalAthletes.toLocaleString()} (${ed.fAthletesCount} Mulheres / ${ed.mAthletesCount} Homens)\n`;
                text += `Cidade: ${ed.city}\n`;
                if (ed.milestone) {
                  text += `★ MARCO: ${ed.milestone.title}`;
                }
                return text;
              }
            }
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#94A3B8', font: { family: 'Plus Jakarta Sans' } }
          },
          y: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: {
              color: '#94A3B8',
              font: { family: 'Plus Jakarta Sans' },
              callback: (value) => value + '%'
            },
            min: 0,
            max: 100
          }
        }
      }
    });
  }

  setupToggleButtons() {
    const btns = document.querySelectorAll('.timeline-controls .toggle-btn');
    btns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        btns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const mode = btn.dataset.mode;
        this.updateChartMode(mode);
      });
    });
  }

  updateChartMode(mode) {
    if (!this.chart) return;
    this.currentMode = mode;

    if (mode === 'ratio') {
      this.chart.data.datasets[0].label = '% Atletas Mulheres';
      this.chart.data.datasets[0].data = this.editionsList.map(e => e.fRatioPct);
      this.chart.data.datasets[1].hidden = false;
      this.chart.data.datasets[1].label = '% Atletas Homens';
      this.chart.data.datasets[1].data = this.editionsList.map(e => (100 - e.fRatioPct).toFixed(2));
      this.chart.options.scales.y.ticks.callback = (v) => v + '%';
      this.chart.options.scales.y.max = 100;
    } else if (mode === 'athletes') {
      this.chart.data.datasets[0].label = 'Mulheres (Total)';
      this.chart.data.datasets[0].data = this.editionsList.map(e => e.fAthletesCount);
      this.chart.data.datasets[1].hidden = false;
      this.chart.data.datasets[1].label = 'Homens (Total)';
      this.chart.data.datasets[1].data = this.editionsList.map(e => e.mAthletesCount);
      this.chart.options.scales.y.ticks.callback = (v) => v.toLocaleString();
      delete this.chart.options.scales.y.max;
    } else if (mode === 'sports') {
      this.chart.data.datasets[0].label = 'Modalidades Femininas';
      this.chart.data.datasets[0].data = this.editionsList.map(e => e.fSportsCount);
      this.chart.data.datasets[1].hidden = false;
      this.chart.data.datasets[1].label = 'Modalidades Masculinas';
      this.chart.data.datasets[1].data = this.editionsList.map(e => e.mSportsCount);
      this.chart.options.scales.y.ticks.callback = (v) => v;
      delete this.chart.options.scales.y.max;
    }

    this.chart.update();
  }

  renderMilestoneCards() {
    const container = document.getElementById('milestonesContainer');
    if (!container) return;

    const milestonesEditions = this.editionsList.filter(e => e.milestone);
    
    container.innerHTML = milestonesEditions.map((e, idx) => `
      <div class="milestone-card ${idx === 1 ? 'active' : ''}" data-year="${e.year}">
        <i class="lucide-award milestone-icon"></i>
        <span class="milestone-year">${e.year} - ${e.city}</span>
        <h4 class="milestone-card-title">${e.milestone.title}</h4>
        <p class="milestone-desc">${e.milestone.description}</p>
      </div>
    `).join('');

    // Add click listeners to focus chart on milestone year
    container.querySelectorAll('.milestone-card').forEach(card => {
      card.addEventListener('click', () => {
        container.querySelectorAll('.milestone-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        
        const year = parseInt(card.dataset.year);
        const index = this.editionsList.findIndex(e => e.year === year);
        if (index !== -1 && this.chart) {
          const meta = this.chart.getDatasetMeta(0);
          const point = meta.data[index];
          if (point) {
            this.chart.setActiveElements([{ datasetIndex: 0, index: index }]);
            this.chart.tooltip.setActiveElements([{ datasetIndex: 0, index: index }], { x: point.x, y: point.y });
            this.chart.update();
          }
        }
      });
    });
  }
}
