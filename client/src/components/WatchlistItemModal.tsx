import { useEffect, useState, type FormEvent } from "react";
import type { UpsertWatchListItemRequest, WatchListItem } from "@watchlist/shared";

type ModalProps = {
  open: boolean;
  item: WatchListItem | null;
  onClose: () => void;
  onSave: (body: UpsertWatchListItemRequest, id?: string) => Promise<void>;
};

export default function WatchlistItemModal({ open, item, onClose, onSave }: ModalProps) {
  const [title, setTitle] = useState("");
  const [thumbnailImage, setThumbnailImage] = useState("");
  const [price, setPrice] = useState("");
  const [links, setLinks] = useState<string[]>([""]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }
    setError(null);
    setSaving(false);
    if (item) {
      setTitle(item.title);
      setThumbnailImage(item.thumbnailImage);
      setPrice(item.price ?? "");
      setLinks(item.links.length > 0 ? item.links.map((link) => link.url) : [""]);
    } else {
      setTitle("");
      setThumbnailImage("");
      setPrice("");
      setLinks([""]);
    }
  }, [open, item]);

  if (!open) {
    return null;
  }

  function close() {
    setTitle("");
    setThumbnailImage("");
    setPrice("");
    setLinks([""]);
    setError(null);
    onClose();
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    const body: UpsertWatchListItemRequest = {
      title,
      thumbnailImage,
      links: links
        .map((url) => url.trim())
        .filter((url) => url.length > 0)
        .map((url) => ({ label: "", url })),
    };
    if (price.trim()) {
      body.price = price.trim();
    }
    try {
      await onSave(body, item?.id);
      close();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-backdrop" role="presentation" onClick={close}>
      <div
        className="modal"
        role="dialog"
        aria-labelledby="watchlist-item-title"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="watchlist-item-title">
          {item ? "Edit Watchlist Item" : "Create Watchlist Item"}
        </h2>
        <form onSubmit={handleSubmit}>
          <label>
            Title
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
            />
          </label>
          <label>
            Thumbnail image
            <input
              value={thumbnailImage}
              onChange={(event) => setThumbnailImage(event.target.value)}
              required
            />
          </label>
          <label>
            Price
            <input value={price} onChange={(event) => setPrice(event.target.value)} />
          </label>
          <fieldset className="link-fields">
            <legend>Links</legend>
            {links.map((link, index) => (
              <div className="link-row" key={index}>
                <input
                  value={link}
                  onChange={(event) => {
                    const next = [...links];
                    next[index] = event.target.value;
                    setLinks(next);
                  }}
                  placeholder="https://"
                />
                <button
                  type="button"
                  aria-label="Remove link"
                  onClick={() => {
                    const next = links.filter((_, i) => i !== index);
                    setLinks(next.length > 0 ? next : [""]);
                  }}
                >
                  −
                </button>
              </div>
            ))}
            <button type="button" onClick={() => setLinks([...links, ""])} aria-label="Add link">
              +
            </button>
          </fieldset>
          {error ? <p className="error">{error}</p> : null}
          <div className="modal-actions">
            <button type="submit" disabled={saving}>
              Save
            </button>
            <button type="button" onClick={close} disabled={saving}>
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
