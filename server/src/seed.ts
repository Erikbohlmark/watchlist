import { db } from "./db.js";
import { createWatchList } from "./repos/watchlists.js";
import { createItem } from "./repos/items.js";

db.exec("DELETE FROM watchlist_items");
db.exec("DELETE FROM watchlists");

const weekend = createWatchList("Weekend projects");
createItem(weekend.id, {
  title: "Bookshelf",
  thumbnailImage: "https://picsum.photos/id/367/200",
  price: "89.00",
  links: [{ label: "", url: "https://example.com/bookshelf" }],
});
createItem(weekend.id, {
  title: "Desk lamp",
  thumbnailImage: "https://picsum.photos/id/201/200",
  price: "34.50",
  links: [{ label: "", url: "https://example.com/desk-lamp" }],
});

const gifts = createWatchList("Gifts");
createItem(gifts.id, {
  title: "Headphones",
  thumbnailImage: "https://picsum.photos/id/3/200",
  price: "129.00",
  links: [
    { label: "", url: "https://example.com/headphones" },
    { label: "", url: "https://example.com/headphones-review" },
  ],
});

console.log("Seeded sample watchlists:", weekend.title, "and", gifts.title);
