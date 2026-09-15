import type { WatchList } from "@watchlist/shared";
import { db } from "../db.js";
import { badRequest, notFound } from "../errors.js";

type WatchListRow = {
  id: string;
  created: string;
  title: string;
};

function mapWatchList(row: WatchListRow): WatchList {
  return { id: row.id, created: row.created, title: row.title };
}

function assertOrderBy(orderBy: string | undefined): "created" {
  if (orderBy === undefined || orderBy === "created" || orderBy === "price") {
    return "created";
  }
  throw badRequest("orderBy must be created or price");
}

export function listWatchLists(orderBy?: string): WatchList[] {
  assertOrderBy(orderBy);
  const rows = db
    .prepare("SELECT id, created, title FROM watchlists ORDER BY created DESC")
    .all() as WatchListRow[];
  return rows.map(mapWatchList);
}

export function getWatchList(id: string): WatchList {
  const row = db
    .prepare("SELECT id, created, title FROM watchlists WHERE id = ?")
    .get(id) as WatchListRow | undefined;
  if (!row) {
    throw notFound("Watchlist not found");
  }
  return mapWatchList(row);
}

export function createWatchList(title: string): WatchList {
  const trimmed = title.trim();
  if (!trimmed) {
    throw badRequest("title is required");
  }
  const entity: WatchList = {
    id: crypto.randomUUID(),
    created: new Date().toISOString(),
    title: trimmed,
  };
  db.prepare("INSERT INTO watchlists (id, created, title) VALUES (?, ?, ?)").run(
    entity.id,
    entity.created,
    entity.title,
  );
  return entity;
}

export function updateWatchList(id: string, title: string): WatchList {
  getWatchList(id);
  const trimmed = title.trim();
  if (!trimmed) {
    throw badRequest("title is required");
  }
  db.prepare("UPDATE watchlists SET title = ? WHERE id = ?").run(trimmed, id);
  return getWatchList(id);
}

export function deleteWatchList(id: string): void {
  getWatchList(id);
  db.prepare("DELETE FROM watchlists WHERE id = ?").run(id);
}
