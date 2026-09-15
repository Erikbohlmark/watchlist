import { Navigate, Route, Routes } from "react-router-dom";
import WatchlistPage from "./pages/WatchlistPage";
import WatchlistsPage from "./pages/WatchlistsPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/watchlists" replace />} />
      <Route path="/watchlists" element={<WatchlistsPage />} />
      <Route path="/watchlists/:id" element={<WatchlistPage />} />
    </Routes>
  );
}
