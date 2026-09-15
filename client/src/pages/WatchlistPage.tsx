import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { UpsertWatchListItemRequest, WatchList, WatchListItem } from "@watchlist/shared";
import { createItem, getWatchlist, listItems, updateItem } from "../api";
import WatchlistItemModal from "../components/WatchlistItemModal";

export default function WatchlistPage() {
  const { id } = useParams();
  const [watchlist, setWatchlist] = useState<WatchList | null>(null);
  const [items, setItems] = useState<WatchListItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<WatchListItem | null>(null);

  async function load(watchlistId: string) {
    const [list, listItemsData] = await Promise.all([
      getWatchlist(watchlistId),
      listItems(watchlistId),
    ]);
    setWatchlist(list);
    setItems(listItemsData);
    document.title = list.title;
  }

  useEffect(() => {
    if (!id) {
      return;
    }
    load(id).catch((err: unknown) => {
      setError(err instanceof Error ? err.message : "Failed to load watchlist");
    });
  }, [id]);

  async function handleSave(body: UpsertWatchListItemRequest, itemId?: string) {
    if (!id) {
      return;
    }
    if (itemId) {
      await updateItem(id, itemId, body);
    } else {
      await createItem(id, body);
    }
    await load(id);
  }

  return (
    <main className="page">
      <header className="page-header">
        <h1>{watchlist?.title ?? "Watchlist"}</h1>
        <button
          type="button"
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
        >
          Add
        </button>
      </header>
      {error ? <p className="error">{error}</p> : null}
      <ul className="item-list">
        {items.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              className="item-card"
              onClick={() => {
                setEditing(item);
                setModalOpen(true);
              }}
            >
              <img src={item.thumbnailImage} alt="" />
              <div>
                <h2>{item.title}</h2>
                {item.price ? <p>{item.price}</p> : null}
                <ul className="links">
                  {item.links.map((link) => (
                    <li key={link.url}>
                      <a href={link.url} onClick={(event) => event.stopPropagation()}>
                        {link.url}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </button>
          </li>
        ))}
      </ul>
      <WatchlistItemModal
        open={modalOpen}
        item={editing}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        onSave={handleSave}
      />
    </main>
  );
}
