export const sounds = {
  move: 'https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/move-self.mp3',
  capture: 'https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/capture.mp3',
  check: 'https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/move-check.mp3',
  start: 'https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/game-start.mp3',
  end: 'https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/game-end.mp3',
};

const audioElements: Record<string, HTMLAudioElement> = {};

if (typeof window !== 'undefined') {
  Object.entries(sounds).forEach(([key, url]) => {
    const audio = new Audio(url);
    audio.preload = 'auto';
    audioElements[key] = audio;
  });
}

export const playSound = (type: keyof typeof sounds) => {
  try {
    const audio = audioElements[type];
    if (audio) {
      // Clone the node so we can play overlapping sounds if necessary
      const clone = audio.cloneNode() as HTMLAudioElement;
      clone.volume = 0.5; // Moderate volume
      clone.play().catch((e) => console.warn('Audio play failed:', e));
    }
  } catch (err) {
    console.warn('Audio play error:', err);
  }
};
