// Audio context for generating sounds
let audioContext: AudioContext | null = null;

const getAudioContext = (): AudioContext => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
};

/**
 * Play window open sound - a pleasant ascending tone
 */
export const playWindowOpenSound = () => {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Create oscillator for the main tone
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    // Connect nodes
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Configure sound - ascending frequency sweep
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(400, now);
    oscillator.frequency.exponentialRampToValueAtTime(600, now + 0.15);

    // Envelope - quick fade in, gentle fade out
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.15, now + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

    // Play
    oscillator.start(now);
    oscillator.stop(now + 0.2);
  } catch (error) {
    // Silently fail if audio context is not available
    console.debug('Audio playback failed:', error);
  }
};

/**
 * Play window close sound - a pleasant descending tone
 */
export const playWindowCloseSound = () => {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Create oscillator for the main tone
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    // Connect nodes
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Configure sound - descending frequency sweep
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(600, now);
    oscillator.frequency.exponentialRampToValueAtTime(400, now + 0.15);

    // Envelope - quick fade in, gentle fade out
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.15, now + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

    // Play
    oscillator.start(now);
    oscillator.stop(now + 0.2);
  } catch (error) {
    // Silently fail if audio context is not available
    console.debug('Audio playback failed:', error);
  }
};

/**
 * Play tap/click sound - a short, subtle click
 */
export const playTapSound = () => {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Create oscillator for a short click sound
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    // Connect nodes
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Configure sound - very short, high-pitched click
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(800, now);

    // Very short envelope for a click
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.08, now + 0.005);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.04);

    // Play
    oscillator.start(now);
    oscillator.stop(now + 0.04);
  } catch (error) {
    // Silently fail if audio context is not available
    console.debug('Audio playback failed:', error);
  }
};

/**
 * Play select sound - a subtle tone for selection
 */
export const playSelectSound = () => {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Create oscillator for selection tone
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    // Connect nodes
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Configure sound - short, mid-range tone
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(500, now);

    // Short envelope
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.06, now + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.06);

    // Play
    oscillator.start(now);
    oscillator.stop(now + 0.06);
  } catch (error) {
    // Silently fail if audio context is not available
    console.debug('Audio playback failed:', error);
  }
};

/**
 * Resume audio context if it's suspended (required for some browsers)
 */
export const resumeAudioContext = () => {
  if (audioContext && audioContext.state === 'suspended') {
    audioContext.resume();
  }
};
