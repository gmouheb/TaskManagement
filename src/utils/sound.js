const toneMap = {
  "Gentle Chime": [523.25, 659.25, 783.99],
  "Soft Breeze": [392, 493.88, 587.33],
  "Morning Mist": [440, 554.37, 659.25],
};

export function playSessionSound({ enabled = true, tone = "Gentle Chime", volume = 70 } = {}) {
  if (!enabled) {
    return;
  }

  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) {
    return;
  }

  const audioContext = new AudioContext();
  const now = audioContext.currentTime;
  const normalizedVolume = Math.max(0, Math.min(volume, 100)) / 100;
  const frequencies = toneMap[tone] || toneMap["Gentle Chime"];
  const totalDuration = 5;
  const pulseInterval = 0.75;
  const pulseDuration = 0.58;
  const pulseCount = Math.floor(totalDuration / pulseInterval);

  for (let pulse = 0; pulse < pulseCount; pulse += 1) {
    const pulseStart = now + pulse * pulseInterval;
    const gain = audioContext.createGain();

    gain.gain.setValueAtTime(0.0001, pulseStart);
    gain.gain.exponentialRampToValueAtTime(0.12 * normalizedVolume + 0.0001, pulseStart + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, pulseStart + pulseDuration);
    gain.connect(audioContext.destination);

    frequencies.forEach((frequency, index) => {
      const oscillator = audioContext.createOscillator();
      const noteStart = pulseStart + index * 0.07;

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(frequency, noteStart);
      oscillator.connect(gain);
      oscillator.start(noteStart);
      oscillator.stop(pulseStart + pulseDuration + 0.05);
    });
  }

  window.setTimeout(() => audioContext.close(), (totalDuration + 0.4) * 1000);
}
