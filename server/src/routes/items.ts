import { Router } from "express";
import type { UpsertWatchListItemRequest } from "@watchlist/shared";
import { handle, routeParam } from "../http.js";
import {
  createItem,
  deleteItem,
  getItem,
  listItems,
  updateItem,
} from "../repos/items.js";

const router = Router({ mergeParams: true });

router.get(
  "/",
  handle((req, res) => {
    const orderBy = typeof req.query.orderBy === "string" ? req.query.orderBy : undefined;
    res.json(listItems(routeParam(req.params.watchlistId), orderBy));
  }),
);

router.post(
  "/",
  handle((req, res) => {
    const body = (req.body ?? {}) as UpsertWatchListItemRequest;
    res.status(201).json(createItem(routeParam(req.params.watchlistId), body));
  }),
);

router.get(
  "/:id",
  handle((req, res) => {
    res.json(getItem(routeParam(req.params.watchlistId), routeParam(req.params.id)));
  }),
);

router.put(
  "/:id",
  handle((req, res) => {
    const body = (req.body ?? {}) as UpsertWatchListItemRequest;
    res.json(
      updateItem(routeParam(req.params.watchlistId), routeParam(req.params.id), body),
    );
  }),
);

router.delete(
  "/:id",
  handle((req, res) => {
    deleteItem(routeParam(req.params.watchlistId), routeParam(req.params.id));
    res.status(204).end();
  }),
);

export default router;
