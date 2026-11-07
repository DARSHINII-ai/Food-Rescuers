export function createSoundEngine() {
  let context = null;
  let enabled = false;
  let lastWhoosh = 0;

  const ensureContext = () => {
    if (!context) {
      const Ctor = window.AudioContext || window.webkitAudioContext;
      if (!Ctor) return null;
      context = new Ctor();
    }
    if (context.state === 'suspended') context.resume();
    return context;
  };

  const tone = ({ from, to, start, duration, peak, type = 'sine', attack = 0.08 }) => {
    const ctx = ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime + start;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(from, now);
    osc.frequency.exponentialRampToValueAtTime(to, now + duration);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(peak, now + attack);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + duration + 0.05);
  };

  return {
    isEnabled: () => enabled,

    setEnabled(next) {
      enabled = next;
      if (enabled) ensureContext();
    },

    whoosh() {
      if (!enabled) return;
      const now = performance.now();
      if (now - lastWhoosh < 1200) return;
      lastWhoosh = now;
      tone({ from: 320, to: 760, start: 0, duration: 1.1, peak: 0.035, attack: 0.45 });
      tone({ from: 480, to: 1140, start: 0.05, duration: 1.0, peak: 0.012, attack: 0.5 });
    },

    chime() {
      if (!enabled) return;
      tone({ from: 523.25, to: 523.25, start: 0, duration: 1.6, peak: 0.06, attack: 0.04 });
      tone({ from: 659.25, to: 659.25, start: 0.12, duration: 1.6, peak: 0.05, attack: 0.04 });
      tone({ from: 783.99, to: 783.99, start: 0.24, duration: 1.8, peak: 0.045, attack: 0.04 });
    },

    bloop() {
      if (!enabled) return;
      tone({ from: 392, to: 587, start: 0, duration: 0.5, peak: 0.03, attack: 0.06 });
    },
  };
}
