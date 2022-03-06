const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const errorhandler = require('errorhandler');

//connect to mongoDB server
mongoose.connect('mongodb://127.0.0.1/knjige',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => console.log('connected'))
  .catch(error => console.log(error));

//enable cors 
app.use(cors({
  origin: "http://127.0.0.1:4000",
  methods: ['GET', 'POST', 'DELETE', 'PUT']
}));

//serves front end files
app.use(express.static('knjige-public'));

//initialize body parser before accessing routes
app.use(bodyParser.json());

//initialize morgan - used for logging requests
app.use(morgan('dev'));

//initialize routes
app.use('/api', require('./knjige-routes.js'));

//handle errors if none of the routes match
app.use(errorhandler());

//listen for requests
app.listen(process.env.port || 4000, () => console.log("Listening for requests on 4000"));