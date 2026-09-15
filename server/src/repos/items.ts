import type { Link, UpsertWatchListItemRequest, WatchListItem } from "@watchlist/shared";
import { db } from "../db.js";
import { badRequest, notFound } from "../errors.js";
import { getWatchList } from "./watchlists.js";

type ItemRow = {
  id: string;
  watchlist_id: string;
  created: string;
  title: string;
  thumbnail_image: string;
  price: string | null;
  links: string;
};

function parseLinks(raw: string): Link[] {
  const parsed = JSON.parse(raw) as unknown;
  if (!Array.isArray(parsed)) {
    return [];
  }
  return parsed.filter(
    (link): link is Link =>
      typeof link === "object" &&
      link !== null &&
      typeof (link as Link).url === "string",
  ).map((link) => ({
    label: typeof link.label === "string" ? link.label : "",
    url: link.url,
  }));
}

function mapItem(row: ItemRow): WatchListItem {
  const item: WatchListItem = {
    id: row.id,
    watchlistId: row.watchlist_id,
    created: row.created,
    title: row.title,
    thumbnailImage: row.thumbnail_image,
    links: parseLinks(row.links),
  };
  if (row.price) {
    item.price = row.price;
  }
  return item;
}

function normalizeLinks(links: Link[] | undefined): Link[] {
  if (!links) {
    return [];
  }
  return links
    .map((link) => ({
      label: typeof link.label === "string" ? link.label.trim() : "",
      url: typeof link.url === "string" ? link.url.trim() : "",
    }))
    .filter((link) => link.url.length > 0);
}

function validatePayload(body: UpsertWatchListItemRequest): {
  title: string;
  thumbnailImage: string;
  price: string | null;
  links: Link[];
} {
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const thumbnailImage =
    typeof body.thumbnailImage === "string" ? body.thumbnailImage.trim() : "";
  if (!title) {
    throw badRequest("title is required");
  }
  if (!thumbnailImage) {
    throw badRequest("thumbnailImage is required");
  }
  const price =
    typeof body.price === "string" && body.price.trim().length > 0
      ? body.price.trim()
      : null;
  return {
    title,
    thumbnailImage,
    price,
    links: normalizeLinks(body.links),
  };
}

function assertOrderBy(orderBy: string | undefined): "created" | "price" {
  if (orderBy === undefined || orderBy === "created") {
    return "created";
  }
  if (orderBy === "price") {
    return "price";
  }
  throw badRequest("orderBy must be created or price");
}

export function listItems(watchlistId: string, orderBy?: string): WatchListItem[] {
  getWatchList(watchlistId);
  const field = assertOrderBy(orderBy);
  const sql =
    field === "price"
      ? `SELECT id, watchlist_id, created, title, thumbnail_image, price, links
         FROM watchlist_items
         WHERE watchlist_id = ?
         ORDER BY price IS NULL, price DESC, created DESC`
      : `SELECT id, watchlist_id, created, title, thumbnail_image, price, links
         FROM watchlist_items
         WHERE watchlist_id = ?
         ORDER BY created DESC`;
  const rows = db.prepare(sql).all(watchlistId) as ItemRow[];
  return rows.map(mapItem);
}

export function getItem(watchlistId: string, id: string): WatchListItem {
  getWatchList(watchlistId);
  const row = db
    .prepare(
      `SELECT id, watchlist_id, created, title, thumbnail_image, price, links
       FROM watchlist_items WHERE watchlist_id = ? AND id = ?`,
    )
    .get(watchlistId, id) as ItemRow | undefined;
  if (!row) {
    throw notFound("Watchlist item not found");
  }
  return mapItem(row);
}

export function createItem(
  watchlistId: string,
  body: UpsertWatchListItemRequest,
): WatchListItem {
  getWatchList(watchlistId);
  const payload = validatePayload(body);
  const entity: WatchListItem = {
    id: crypto.randomUUID(),
    watchlistId,
    created: new Date().toISOString(),
    title: payload.title,
    thumbnailImage: payload.thumbnailImage,
    links: payload.links,
  };
  if (payload.price) {
    entity.price = payload.price;
  }
  db.prepare(
    `INSERT INTO watchlist_items
      (id, watchlist_id, created, title, thumbnail_image, price, links)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    entity.id,
    watchlistId,
    entity.created,
    entity.title,
    entity.thumbnailImage,
    payload.price,
    JSON.stringify(entity.links),
  );
  return entity;
}

export function updateItem(
  watchlistId: string,
  id: string,
  body: UpsertWatchListItemRequest,
): WatchListItem {
  getItem(watchlistId, id);
  const payload = validatePayload(body);
  db.prepare(
    `UPDATE watchlist_items
     SET title = ?, thumbnail_image = ?, price = ?, links = ?
     WHERE watchlist_id = ? AND id = ?`,
  ).run(
    payload.title,
    payload.thumbnailImage,
    payload.price,
    JSON.stringify(payload.links),
    watchlistId,
    id,
  );
  return getItem(watchlistId, id);
}

export function deleteItem(watchlistId: string, id: string): void {
  getItem(watchlistId, id);
  db.prepare("DELETE FROM watchlist_items WHERE watchlist_id = ? AND id = ?").run(
    watchlistId,
    id,
  );
}
