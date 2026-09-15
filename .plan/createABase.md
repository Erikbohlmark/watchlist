# My first plan
Create a base project written with typescript. It should have a node server along with a frontend using react. 

## Backend

### Entities

WatchList {
    id: ID,
    created: Timestamp,
    title: String,
}

WatchListItem {
    id: ID,
    watchlistId: ID!,
    created: Timestamp,
    title: String,
    thumbnailImage: String,
    price: String, // this will be dynamic in the future
    links: Link[], // the link should be paired with label and url
}

Link {
    label: String,
    url: String
}

### APIs

There has to be CRUD endpoints for Watchlist and watchlist item. Persisting the entities to a datasource. The API should take and respond in JSON.

Listing Watchlists and watchlist items should be able to sort on created date by default and be able to take an orderBy parameter. In the beginning we will only allow sorting by created and price.


## Frontend

### Listing watchlist page
I should be able to list my watchlists in a descending order by the created timestamp. The title of the page should be List watchlists. 

#### Header
The header of the page should say 'Watchlists' left aligned. In the header there should be a button on the right side of the page. The button should say 'Create Watchlist'

#### Body
In table format we would list the watchlists showing the id, title and created.


There has to be and endpoint for listing watchlists .

### Watchlist page
The watchlist is a list of watchlist items. Each watchlist item should present the thumbnail, title, price and the list of links.

The watchlist should present the items in descending order by the created timestamp.

### 


### Create





## TODO
