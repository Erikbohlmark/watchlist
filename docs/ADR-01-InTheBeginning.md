# ADR - 01 - In the Beginning
Create a base project written with typescript. It should have a node server along with a frontend using react. 

## Backend

### Entities

WatchList {
    id: ID, // generated first time when persisted
    created: Timestamp, // generated first time when persisted 
    title: String, - required
}

WatchListItem {
    id: ID, // generated first time when persisted
    watchlistId: ID!, // required
    created: Timestamp, // generated first time when persisted
    title: String, // required
    thumbnailImage: String, // required
    price: String, // optional, also this will be dynamic in the future
    links: Link[], // optional the link should be paired with label and url
}

Link {
    label: String,
    url: String // required
}

### APIs

There has to be CRUD endpoints for Watchlist and watchlist item. Persisting the entities to a datasource. The API should take and respond in JSON.

There should be two GET endpoints, one that lists the entities and one by ID.

Endpoints for Listing Watchlists and watchlist items should be able to sort on created date by default and be able to take an orderBy parameter. In the beginning we will only allow sorting by created and price.

## Frontend

### Listing watchlist page
path: /watchlists
I should be able to list my watchlists in a descending order by the created timestamp. The title of the page should be List watchlists. 

#### Page Header
The header of the page should say 'Watchlists' left aligned. In the header there should be a button on the right side of the page. The button should say 'Create Watchlist'.

#### Page Body
In table format we would list the watchlists showing the id, title and created. Each row should be clickable which takes you to the Watchlist page.

#### Create Watchlist module
When clicking on the 'Create watchlist' button a module should popup.
The title of the module should be 'Create Watchlist'. 
It should contain a form with one editable input field with the label 'Title'.
There should be two buttons at the bottom of the form, save and cancel.

##### Module On Save
Sends a create watchlist request to the server with the title in the request. the when the request has completed the form has to close and we have to refetch the list of watchlists. The table with watchlists should be refreshed.

##### Module On Cancel
clearing the form and Closing the module. No requests should be made.

### Watchlist page
path: /watchlists/:id - where the id is the id of the watchlist

#### Page Header
Title of the watchlist that is left aligned. 
Button for creating watch list item should be right aligned to the page. The button should say 'Add'. the 'Create watchlist item' module should appear when selected.

#### Page Body
The watchlist is a list of watchlist items. Each watchlist item should present the thumbnail, title, price and the list of links.

The watchlist should present the items in descending order by the created timestamp.

#### Create and Edit Watchlist Item Module
Form with following fields
* title: Text
* thumbnailImage: url (text)
* price: Text
* links - this should be one text field per link in the list of links. if the list is empty then there should be an empty text field by default. For now we will skip the label part of the link. at the bottom of the link section there should be a button with a plus sign and when you click on the plus it should give you a new link input field. On the right side of each link input field there should be a minus button. if the button is selected that link should be removed from the list of links.

The form will have two actions
Save - On Click it will send a create watchlist item request to the server. if the entity contains an ID it will instead send an update request. When the request has finished we should refresh the list of watchlist items.
Close - clearing the form and closing the module.
