import { useCallback } from 'react';

export type SoundType = 'click' | 'boop' | 'chime' | 'fanfare' | 'pop';

export function useSound(soundEnabled: boolean = true) {
  const playSound = useCallback((type: SoundType = 'click') => {
    if (!soundEnabled) return;
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();

      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'click') {
        // Crisp retro button click
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(420, now);
        osc.frequency.exponentialRampToValueAtTime(140, now + 0.04);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc.start(now);
        osc.stop(now + 0.045);
      } else if (type === 'boop') {
        // Friendly retro boop for tab switches
        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.setValueAtTime(480, now + 0.03);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.09);
      } else if (type === 'pop') {
        // Soft bubble pop
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(180, now + 0.06);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
        osc.start(now);
        osc.stop(now + 0.07);
      } else if (type === 'chime') {
        // High pleasant star chime
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.05); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.1); // G5
        gain.gain.setValueAtTime(0.09, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.26);
      } else if (type === 'fanfare') {
        // Victory fanfare mini-arpeggio
        osc.type = 'square';
        osc.frequency.setValueAtTime(392.00, now); // G4
        osc.frequency.setValueAtTime(523.25, now + 0.08); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.16); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.24); // G5
        gain.gain.setValueAtTime(0.07, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        osc.start(now);
        osc.stop(now + 0.46);
      }
    } catch {
      // Audio not permitted or supported; fail silently
    }
  }, [soundEnabled]);

  return { playSound };
}
