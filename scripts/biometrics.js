/* ==========================================================================
   BIOMETRICS & PHYSICAL EVOLUTION MODULE
   ========================================================================== */

export class BiometricsModule {
  constructor(summaryData) {
    this.physicalTrends = summaryData.physicalTrends.filter(p => p.decade >= 1900 && p.avgAge !== null);
    this.chart = null;

    this.init();
  }

  init() {
    this.setupChart();
  }

  setupChart() {
    const ctx = document.getElementById('biometricsChart')?.getContext('2d');
    if (!ctx) return;

    const labels = this.physicalTrends.map(p => `${p.decade}s`);
    const ages = this.physicalTrends.map(p => p.avgAge);
    const heights = this.physicalTrends.map(p => p.avgHeight);
    const weights = this.physicalTrends.map(p => p.avgWeight);

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Idade Média (Anos)',
            data: ages,
            borderColor: '#EC4899',
            backgroundColor: 'rgba(236, 72, 153, 0.2)',
            yAxisID: 'yAge',
            tension: 0.4,
            borderWidth: 3,
            pointRadius: 5
          },
          {
            label: 'Altura Média (cm)',
            data: heights,
            borderColor: '#06B6D4',
            backgroundColor: 'rgba(6, 182, 212, 0.2)',
            yAxisID: 'yHeight',
            tension: 0.4,
            borderWidth: 3,
            pointRadius: 5
          },
          {
            label: 'Peso Médio (kg)',
            data: weights,
            borderColor: '#F59E0B',
            backgroundColor: 'rgba(245, 158, 11, 0.2)',
            yAxisID: 'yWeight',
            tension: 0.4,
            borderWidth: 2,
            borderDash: [5, 5],
            pointRadius: 4
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
              font: { family: 'Plus Jakarta Sans', size: 12, weight: 600 }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            borderColor: '#EC4899',
            borderWidth: 1
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#94A3B8' }
          },
          yAge: {
            type: 'linear',
            display: true,
            position: 'left',
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#EC4899', callback: v => v + ' anos' },
            title: { display: true, text: 'Idade', color: '#EC4899' }
          },
          yHeight: {
            type: 'linear',
            display: true,
            position: 'right',
            grid: { drawOnChartArea: false },
            ticks: { color: '#06B6D4', callback: v => v + ' cm' },
            title: { display: true, text: 'Altura', color: '#06B6D4' }
          },
          yWeight: {
            type: 'linear',
            display: false
          }
        }
      }
    });
  }
}
