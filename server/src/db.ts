import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DatabaseSync } from "node:sqlite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.resolve(__dirname, "../data");
const dbPath = path.join(dataDir, "watchlist.sqlite");

fs.mkdirSync(dataDir, { recursive: true });

export const db = new DatabaseSync(dbPath);
db.exec("PRAGMA journal_mode = WAL");
db.exec("PRAGMA foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS watchlists (
    id TEXT PRIMARY KEY,
    created TEXT NOT NULL,
    title TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS watchlist_items (
    id TEXT PRIMARY KEY,
    watchlist_id TEXT NOT NULL,
    created TEXT NOT NULL,
    title TEXT NOT NULL,
    thumbnail_image TEXT NOT NULL,
    price TEXT,
    links TEXT NOT NULL DEFAULT '[]',
    FOREIGN KEY (watchlist_id) REFERENCES watchlists(id) ON DELETE CASCADE
  );
`);
