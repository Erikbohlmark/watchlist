export type Link = {
  label: string;
  url: string;
};

export type WatchList = {
  id: string;
  created: string;
  title: string;
};

export type WatchListItem = {
  id: string;
  watchlistId: string;
  created: string;
  title: string;
  thumbnailImage: string;
  price?: string;
  links: Link[];
};

export type CreateWatchListRequest = {
  title: string;
};

export type UpdateWatchListRequest = {
  title: string;
};

export type UpsertWatchListItemRequest = {
  title: string;
  thumbnailImage: string;
  price?: string;
  links?: Link[];
};

export type OrderByField = "created" | "price";
