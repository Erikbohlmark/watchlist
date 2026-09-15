import { useEffect, useState, type FormEvent } from "react";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  onSave: (title: string) => Promise<void>;
};

export default function CreateWatchlistModal({ open, onClose, onSave }: ModalProps) {
  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setTitle("");
      setError(null);
      setSaving(false);
    }
  }, [open]);

  if (!open) {
    return null;
  }

  function cancel() {
    setTitle("");
    setError(null);
    onClose();
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await onSave(title);
      setTitle("");
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-backdrop" role="presentation" onClick={cancel}>
      <div
        className="modal"
        role="dialog"
        aria-labelledby="create-watchlist-title"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="create-watchlist-title">Create Watchlist</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Title
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
              autoFocus
            />
          </label>
          {error ? <p className="error">{error}</p> : null}
          <div className="modal-actions">
            <button type="submit" disabled={saving}>
              Save
            </button>
            <button type="button" onClick={cancel} disabled={saving}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
