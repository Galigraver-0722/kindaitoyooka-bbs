"use client";

/**
 * Keeps every like / save button pointed at the same record in step without a
 * page reload.
 *
 * Two channels carry the same payload: a window event reaches all buttons on
 * this page, and a BroadcastChannel reaches the same site in other tabs. Both
 * only ever fire after the server has answered, so subscribers apply the real
 * count rather than a guess. Changes made by *other people* arrive through the
 * existing `/api/pulse` refresh; this module handles the same person's tabs.
 */
export type LiveCount = {
  endpoint: string;
  count: number;
  active: boolean;
  /** The button that made the change; it already holds these numbers. */
  source: string;
};

const EVENT = "kinjo:count";
const CHANNEL = "kinjo:counts";

let channel: BroadcastChannel | null = null;
let channelReady = false;

function bus(): BroadcastChannel | null {
  if (channelReady) {
    return channel;
  }
  channelReady = true;
  try {
    channel = typeof BroadcastChannel === "undefined" ? null : new BroadcastChannel(CHANNEL);
  } catch {
    channel = null;
  }
  return channel;
}

export function publishCount(update: LiveCount): void {
  window.dispatchEvent(new CustomEvent<LiveCount>(EVENT, { detail: update }));
  try {
    bus()?.postMessage(update);
  } catch {
    // A closed or unsupported channel only costs cross-tab sync.
  }
}

export function subscribeCounts(handler: (update: LiveCount) => void): () => void {
  const onEvent = (event: Event) => handler((event as CustomEvent<LiveCount>).detail);
  window.addEventListener(EVENT, onEvent);

  const broadcast = bus();
  const onMessage = (event: MessageEvent<LiveCount>) => handler(event.data);
  broadcast?.addEventListener("message", onMessage);

  return () => {
    window.removeEventListener(EVENT, onEvent);
    broadcast?.removeEventListener("message", onMessage);
  };
}
