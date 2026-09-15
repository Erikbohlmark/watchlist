import type {
  CreateWatchListRequest,
  UpsertWatchListItemRequest,
  WatchList,
  WatchListItem,
} from "@watchlist/shared";

async function parseJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const body = (await response.json()) as { error?: string };
      if (body.error) {
        message = body.error;
      }
    } catch {
      // ignore
    }
    throw new Error(message);
  }
  if (response.status === 204) {
    return undefined as T;
  }
  return (await response.json()) as T;
}

export async function listWatchlists(): Promise<WatchList[]> {
  const response = await fetch("/api/watchlists?orderBy=created");
  return parseJson<WatchList[]>(response);
}

export async function getWatchlist(id: string): Promise<WatchList> {
  const response = await fetch(`/api/watchlists/${id}`);
  return parseJson<WatchList>(response);
}

export async function createWatchlist(body: CreateWatchListRequest): Promise<WatchList> {
  const response = await fetch("/api/watchlists", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return parseJson<WatchList>(response);
}

export async function listItems(watchlistId: string): Promise<WatchListItem[]> {
  const response = await fetch(`/api/watchlists/${watchlistId}/items?orderBy=created`);
  return parseJson<WatchListItem[]>(response);
}

export async function createItem(
  watchlistId: string,
  body: UpsertWatchListItemRequest,
): Promise<WatchListItem> {
  const response = await fetch(`/api/watchlists/${watchlistId}/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return parseJson<WatchListItem>(response);
}

export async function updateItem(
  watchlistId: string,
  id: string,
  body: UpsertWatchListItemRequest,
): Promise<WatchListItem> {
  const response = await fetch(`/api/watchlists/${watchlistId}/items/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return parseJson<WatchListItem>(response);
}
