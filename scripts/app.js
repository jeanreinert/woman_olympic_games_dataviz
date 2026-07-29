/* ==========================================================================
   MAIN APPLICATION CONTROLLER
   ========================================================================== */

import { DataLoader } from './dataLoader.js';
import { ParticleHero } from './particleHero.js';
import { TimelineModule } from './timeline.js';
import { MapModule } from './map.js';
import { ComparatorModule } from './comparator.js';
import { BiometricsModule } from './biometrics.js';
import { HallOfFameModule } from './hallOfFame.js';

document.addEventListener('DOMContentLoaded', async () => {
  console.log('Inicializando Plataforma A Revolução Feminina nas Olimpíadas...');

  // Initialize Canvas Particles
  new ParticleHero('heroCanvas');

  // Load Data & Initialize Modules
  try {
    const loader = new DataLoader();
    const data = await loader.loadAllData();

    // Instantiate Modules
    new TimelineModule(data.summary);
    new MapModule(data.countries, data.geoMap);
    new ComparatorModule(data.countries);
    new BiometricsModule(data.summary);
    new HallOfFameModule(data.summary);

    // Active Nav Links Scroll Spy
    setupNavScrollSpy();

  } catch (err) {
    console.error('Falha ao inicializar módulos:', err);
  }
});

function setupNavScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.scrollY + 200;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}
