import { Router } from "express";
import type { CreateWatchListRequest, UpdateWatchListRequest } from "@watchlist/shared";
import { handle, routeParam } from "../http.js";
import {
  createWatchList,
  deleteWatchList,
  getWatchList,
  listWatchLists,
  updateWatchList,
} from "../repos/watchlists.js";
import itemsRouter from "./items.js";

const router = Router();

router.get(
  "/",
  handle((req, res) => {
    const orderBy = typeof req.query.orderBy === "string" ? req.query.orderBy : undefined;
    res.json(listWatchLists(orderBy));
  }),
);

router.post(
  "/",
  handle((req, res) => {
    const body = req.body as CreateWatchListRequest;
    res.status(201).json(createWatchList(body?.title ?? ""));
  }),
);

router.get(
  "/:id",
  handle((req, res) => {
    res.json(getWatchList(routeParam(req.params.id)));
  }),
);

router.put(
  "/:id",
  handle((req, res) => {
    const body = req.body as UpdateWatchListRequest;
    res.json(updateWatchList(routeParam(req.params.id), body?.title ?? ""));
  }),
);

router.delete(
  "/:id",
  handle((req, res) => {
    deleteWatchList(routeParam(req.params.id));
    res.status(204).end();
  }),
);

router.use("/:watchlistId/items", itemsRouter);

export default router;
