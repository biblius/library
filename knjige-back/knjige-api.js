const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors')

//connect to mongoDB
mongoose.connect('mongodb://127.0.0.1/knjige',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => console.log('connected'))
  .catch(e => console.log(e));

//set up express
const app = express();

//enable cors 
app.use(cors({
  origin: "http://127.0.0.1:4000",
  methods: ['GET', 'POST', 'DELETE', 'PUT']
}))

//serves front end files - middleware 0
app.use(express.static('knjige-public'))

//initialize body parser before accessing routes for HTTP methods - middleware 1
app.use(bodyParser.json())

//initialize routes - middleware 2
app.use('/api', require('./knjige-routes.js'))

//handle errors if none of the routes match - middleware 3
app.use(function (err, req, res, next) {
  res.send(err.message)
})

//listen for requests
app.listen(process.env.port || 4000, function () {
  console.log("Listening for requests on 4000");
})