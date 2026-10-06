/**
 * Premium Web Audio API synthesizer for Duolingo sound effects.
 * Synthesizes tap, correct chime, wrong buzz, heart lost, streak, and fanfare.
 * Falls back to Web Audio oscillator synthesis with 0 external network requests!
 */

class SoundEffects {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public play(type: 'tap' | 'correct' | 'wrong' | 'heart_lost' | 'fanfare' | 'streak') {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      if (type === 'tap') {
        // Ultra-crisp wooden pop
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(120, now + 0.04);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.04);
      } else if (type === 'correct') {
        // Signature Duolingo 3-note harmonic chime (C5 -> E5 -> G5)
        const notes = [
          { f: 523.25, start: 0, dur: 0.18 },
          { f: 659.25, start: 0.08, dur: 0.22 },
          { f: 783.99, start: 0.16, dur: 0.35 },
        ];
        notes.forEach(({ f, start, dur }) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, now + start);
          gain.gain.setValueAtTime(0.28, now + start);
          gain.gain.exponentialRampToValueAtTime(0.001, now + start + dur);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + start);
          osc.stop(now + start + dur);
        });
      } else if (type === 'wrong') {
        // Dissonant dual-tone downward buzz (Eb3 + D3)
        [155.56, 146.83].forEach((freq) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(freq, now);
          osc.frequency.exponentialRampToValueAtTime(freq * 0.75, now + 0.28);
          gain.gain.setValueAtTime(0.22, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.28);
        });
      } else if (type === 'heart_lost') {
        // Descending melancholy plink (380Hz -> 180Hz)
        const notes = [380, 240, 160];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.09);
          gain.gain.setValueAtTime(0.3, now + idx * 0.09);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.14);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.09);
          osc.stop(now + idx * 0.09 + 0.14);
        });
      } else if (type === 'streak' || type === 'fanfare') {
        // Triumphant orchestral brass fanfare (C5 - E5 - G5 - C6)
        const fanfare = [
          { f: 523.25, start: 0, dur: 0.18 },
          { f: 659.25, start: 0.12, dur: 0.18 },
          { f: 783.99, start: 0.24, dur: 0.24 },
          { f: 1046.5, start: 0.38, dur: 0.6 },
        ];
        fanfare.forEach(({ f, start, dur }) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(f, now + start);
          gain.gain.setValueAtTime(0.35, now + start);
          gain.gain.exponentialRampToValueAtTime(0.001, now + start + dur);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + start);
          osc.stop(now + start + dur);
        });
      }
    } catch {
      // Audio playback fails gracefully if muted or disabled
    }
  }
}

export const sfx = new SoundEffects();
