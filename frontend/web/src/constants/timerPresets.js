/** Green / Yellow / Red / Grace as seconds from start (Chronomaster visual timer). */
export const TIMER_MODES = [
  {
    id: 'preparedSpeech',
    title: 'Prepared speech',
    phases: [
      { name: 'Green', endSec: 180, color: '#2e7d32' },
      { name: 'Yellow', endSec: 240, color: '#f9a825' },
      { name: 'Red', endSec: 300, color: '#c62828' },
      { name: 'Grace', endSec: 330, color: '#5e35b1' }
    ]
  },
  {
    id: 'evaluation',
    title: 'Evaluation',
    phases: [
      { name: 'Green', endSec: 120, color: '#2e7d32' },
      { name: 'Yellow', endSec: 150, color: '#f9a825' },
      { name: 'Red', endSec: 180, color: '#c62828' },
      { name: 'Grace', endSec: 210, color: '#5e35b1' }
    ]
  },
  {
    id: 'tableTopics',
    title: 'Table topics',
    phases: [
      { name: 'Green', endSec: 60, color: '#2e7d32' },
      { name: 'Yellow', endSec: 90, color: '#f9a825' },
      { name: 'Red', endSec: 120, color: '#c62828' },
      { name: 'Grace', endSec: 150, color: '#5e35b1' }
    ]
  }
];

export function formatElapsed(sec) {
  const s = Math.max(0, Math.floor(sec));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`;
}

export function currentPhase(mode, elapsedSec) {
  const phases = mode.phases;
  for (let i = 0; i < phases.length; i++) {
    if (elapsedSec < phases[i].endSec) return { phase: phases[i], index: i };
  }
  return { phase: phases[phases.length - 1], index: phases.length - 1 };
}
