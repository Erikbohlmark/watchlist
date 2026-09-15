import express, { type NextFunction, type Request, type Response } from "express";
import { HttpError } from "./errors.js";
import "./db.js";
import watchlistsRouter from "./routes/watchlists.js";

const PORT = Number(process.env.PORT ?? 3001);
const app = express();

app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/watchlists", watchlistsRouter);

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof HttpError) {
    res.status(err.status).json({ error: err.message });
    return;
  }
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`API listening on http://127.0.0.1:${PORT}`);
});
