import { ToneName } from "../types";

export function playTone(tone: ToneName) {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;

  if (!AudioContextClass) {
    return;
  }

  const context = new AudioContextClass();
  const gain = context.createGain();
  gain.connect(context.destination);
  gain.gain.setValueAtTime(0.0001, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.28, context.currentTime + 0.04);

  const pattern =
    tone === "chime"
      ? [660, 880, 990]
      : tone === "pulse"
        ? [440, 440, 440, 440]
        : [523, 784];

  pattern.forEach((frequency, index) => {
    const oscillator = context.createOscillator();
    oscillator.type = tone === "pulse" ? "square" : "sine";
    oscillator.frequency.setValueAtTime(frequency, context.currentTime + index * 0.16);
    oscillator.connect(gain);
    oscillator.start(context.currentTime + index * 0.16);
    oscillator.stop(context.currentTime + index * 0.16 + 0.12);
  });

  gain.gain.exponentialRampToValueAtTime(
    0.0001,
    context.currentTime + pattern.length * 0.16 + 0.16
  );
}

export async function ensureNotificationPermission() {
  if (!("Notification" in window)) {
    return "unsupported" as const;
  }

  if (Notification.permission === "granted") {
    return "granted" as const;
  }

  if (Notification.permission === "denied") {
    return "denied" as const;
  }

  return Notification.requestPermission();
}

export function notify(title: string, body: string) {
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification(title, { body });
  }
}

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}
