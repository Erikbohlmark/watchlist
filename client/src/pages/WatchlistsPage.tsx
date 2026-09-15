import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { WatchList } from "@watchlist/shared";
import { createWatchlist, listWatchlists } from "../api";
import CreateWatchlistModal from "../components/CreateWatchlistModal";

export default function WatchlistsPage() {
  const navigate = useNavigate();
  const [watchlists, setWatchlists] = useState<WatchList[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  async function load() {
    const data = await listWatchlists();
    setWatchlists(data);
  }

  useEffect(() => {
    document.title = "List watchlists";
    load().catch((err: unknown) => {
      setError(err instanceof Error ? err.message : "Failed to load watchlists");
    });
  }, []);

  return (
    <main className="page">
      <header className="page-header">
        <h1>Watchlists</h1>
        <button type="button" onClick={() => setModalOpen(true)}>
          Create Watchlist
        </button>
      </header>
      {error ? <p className="error">{error}</p> : null}
      <table className="watchlists-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Title</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {watchlists.map((watchlist) => (
            <tr
              key={watchlist.id}
              onClick={() => navigate(`/watchlists/${watchlist.id}`)}
            >
              <td>{watchlist.id}</td>
              <td>{watchlist.title}</td>
              <td>{watchlist.created}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <CreateWatchlistModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={async (title) => {
          await createWatchlist({ title });
          await load();
        }}
      />
    </main>
  );
}
