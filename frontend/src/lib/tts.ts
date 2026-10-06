/**
 * Browser SpeechSynthesis wrapper for Spanish audio pronunciation.
 */

export function speakText(text: string, options: { slow?: boolean; lang?: string } = {}) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return;
  }

  try {
    window.speechSynthesis.cancel(); // Stop any pending speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = options.lang || 'es-ES';
    utterance.rate = options.slow ? 0.6 : 0.95;
    utterance.pitch = 1.0;

    // Pick Spanish voice if available
    const voices = window.speechSynthesis.getVoices();
    const esVoice = voices.find((v) => v.lang.startsWith('es'));
    if (esVoice) {
      utterance.voice = esVoice;
    }

    window.speechSynthesis.speak(utterance);
  } catch {
    // Fail silently
  }
}
