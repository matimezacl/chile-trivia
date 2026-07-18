"use client";

import { useEffect, useRef, useState } from "react";
import type { HostView, PlayerView } from "./party";

// Per-room identity kept in localStorage: the host secret for a room you
// created, and your player id for a room you joined.

const isBrowser = typeof window !== "undefined";

// Poll the room state on an interval. Returns the latest view (host or player,
// depending on pid) plus any fatal error (e.g. the room expired).
export function usePartyPoll<T = HostView | PlayerView>(
  code: string,
  pid: string | null,
  intervalMs = 1200
): { view: T | null; error: string | null } {
  const [view, setView] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!pid) return;
    let alive = true;
    const tick = async () => {
      try {
        const res = await fetch(`/api/party/${code}?pid=${encodeURIComponent(pid)}`, { cache: "no-store" });
        if (!res.ok) {
          if (alive) setError(res.status === 404 ? "La sala ya no existe" : "Error de conexión");
          return;
        }
        const data = (await res.json()) as T;
        if (alive) {
          setView(data);
          setError(null);
        }
      } catch {
        /* transient network error — keep the last good view */
      }
    };
    void tick();
    const iv = setInterval(tick, intervalMs);
    return () => {
      alive = false;
      clearInterval(iv);
    };
  }, [code, pid, intervalMs]);

  return { view, error };
}

// A live countdown (seconds remaining) derived from a shared server timestamp,
// so every screen stays in sync without a socket.
export function useCountdown(startedAt: number | null, seconds: number): number {
  const [remaining, setRemaining] = useState(seconds);
  const raf = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    if (startedAt === null) {
      setRemaining(seconds);
      return;
    }
    const deadline = startedAt + seconds * 1000;
    const update = () => setRemaining(Math.max(0, Math.ceil((deadline - Date.now()) / 1000)));
    update();
    raf.current = setInterval(update, 200);
    return () => {
      if (raf.current) clearInterval(raf.current);
    };
  }, [startedAt, seconds]);
  return remaining;
}

export async function postParty(
  code: string,
  action: string,
  body: Record<string, unknown>
): Promise<{ ok: boolean; error?: string; [k: string]: unknown }> {
  try {
    const res = await fetch(`/api/party/${code}/${action}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    return { ok: res.ok, ...data };
  } catch {
    return { ok: false, error: "Error de conexión" };
  }
}

export function saveHostId(code: string, hostId: string) {
  if (isBrowser) localStorage.setItem(`ct:party:host:${code.toUpperCase()}`, hostId);
}

export function getHostId(code: string): string | null {
  return isBrowser ? localStorage.getItem(`ct:party:host:${code.toUpperCase()}`) : null;
}

export function savePlayer(code: string, playerId: string, name: string) {
  if (isBrowser) {
    localStorage.setItem(`ct:party:play:${code.toUpperCase()}`, JSON.stringify({ playerId, name }));
  }
}

export function getPlayer(code: string): { playerId: string; name: string } | null {
  if (!isBrowser) return null;
  try {
    const raw = localStorage.getItem(`ct:party:play:${code.toUpperCase()}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// Remember the last name a player used, to prefill the join form.
export function getLastName(): string {
  return (isBrowser && localStorage.getItem("ct:party:lastname")) || "";
}

export function setLastName(name: string) {
  if (isBrowser) localStorage.setItem("ct:party:lastname", name);
}
