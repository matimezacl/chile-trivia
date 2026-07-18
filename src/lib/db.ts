import { promises as fs } from "fs";
import path from "path";
import { createClient, type RedisClientType } from "redis";

export interface LeagueMember {
  name: string;
  joinedAt: number;
}

export interface DayResult {
  correct: number; // 0..5
  points: number;
  at: number;
}

export interface League {
  id: string;
  name: string;
  createdAt: number;
  members: Record<string, LeagueMember>;
  // results[day][playerId]
  results: Record<string, Record<string, DayResult>>;
}

interface Store {
  get(id: string): Promise<League | null>;
  set(league: League): Promise<void>;
  // Generic JSON-string KV, used by party rooms. Optional TTL in seconds.
  kvGet(key: string): Promise<string | null>;
  kvSet(key: string, value: string, ttlSeconds?: number): Promise<void>;
}

// Production: standard Redis over TCP via REDIS_URL (injected by the Vercel
// Marketplace Redis integration). Lazy module-level singleton so warm
// serverless invocations reuse the connection.
class RedisStore implements Store {
  private client: RedisClientType;

  constructor(url: string) {
    this.client = createClient({ url });
    this.client.on("error", (err) => console.error("Redis error", err));
  }

  private async connected(): Promise<RedisClientType> {
    if (!this.client.isOpen) await this.client.connect();
    return this.client;
  }

  async get(id: string): Promise<League | null> {
    const raw = await (await this.connected()).get(`cachai:league:${id}`);
    return raw ? (JSON.parse(raw) as League) : null;
  }

  async set(league: League): Promise<void> {
    await (await this.connected()).set(`cachai:league:${league.id}`, JSON.stringify(league));
  }

  async kvGet(key: string): Promise<string | null> {
    return (await this.connected()).get(key);
  }

  async kvSet(key: string, value: string, ttlSeconds?: number): Promise<void> {
    const client = await this.connected();
    if (ttlSeconds) await client.set(key, value, { EX: ttlSeconds });
    else await client.set(key, value);
  }
}

// Local development: JSON files under .data/ (gitignored).
class FileStore implements Store {
  private dir = path.join(process.cwd(), ".data", "leagues");

  private file(id: string) {
    return path.join(this.dir, `${id.replace(/[^a-z0-9-]/gi, "")}.json`);
  }

  async get(id: string): Promise<League | null> {
    try {
      return JSON.parse(await fs.readFile(this.file(id), "utf8")) as League;
    } catch {
      return null;
    }
  }

  async set(league: League): Promise<void> {
    await fs.mkdir(this.dir, { recursive: true });
    await fs.writeFile(this.file(league.id), JSON.stringify(league, null, 2));
  }

  private kvDir = path.join(process.cwd(), ".data", "kv");
  private kvFile(key: string) {
    return path.join(this.kvDir, `${key.replace(/[^a-z0-9:_-]/gi, "_")}.json`);
  }

  async kvGet(key: string): Promise<string | null> {
    try {
      return await fs.readFile(this.kvFile(key), "utf8");
    } catch {
      return null;
    }
  }

  async kvSet(key: string, value: string): Promise<void> {
    await fs.mkdir(this.kvDir, { recursive: true });
    await fs.writeFile(this.kvFile(key), value);
  }
}

let store: Store | null = null;

export function getStore(): Store {
  if (!store) {
    const url = process.env.REDIS_URL;
    store = url ? new RedisStore(url) : new FileStore();
  }
  return store;
}

export function newId(len = 8): string {
  const alphabet = "abcdefghjkmnpqrstuvwxyz23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(len));
  return Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
}
