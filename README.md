For the app to work you must install and spin up a local [mongoDB server](https://www.mongodb.com/try/download/community). Follow the [instructions](https://docs.mongodb.com/manual/administration/install-community/) for your OS. If there is no instance of the mongo server running, the app won't be able to connect to it and it will throw an error.

The app establishes a connection to a local mongoDB server with mongoose and starts listening for requests. The requests are sent from the front page and are routed with express. 

On load, the site sends a get request to localhost:4000/knjige. Upon receiveing it the server instructs mongoose to find all borrowers in the database and sends them as a response in an array (according to the schema from models.js). The front end then iterates through that array and maps values from it to a user friendly card interface.

The add new borrower form creates a post request upon submition with the given values for the name and book.

The add note button opens up a form where the user can add a note to the selected tile. All borrowers have a notes property in their schema which is initially an empty array. Upon submition a put request is sent with whatever was typed in the form and is pushed to the notes array.

If notes exist, a ul element is appended to the card with each note being a li element for that list. Additionally, a remove notes button will be created which will remove all notes from the array by sending a put request for that user with an additional deleteNote property set to true. The router for put requests will check if that property is true and will act accordingly.

Finally, the remove borrower button (the minus) sends a delete request for that borrower, completely removing him/her from the database. It also has a tooltip letting the user know what it does.