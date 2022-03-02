const express = require('express');
const router = express.Router();
const Borrower = require('./knjige-models/models.js');

//get a list of borrowers from the database
router.get('/knjige', function (req, res, next) {
    //find all borrowers and return them
    Borrower.find().then(function (borrower) {
        res.send(borrower);
        console.log("GET")
    })
});

//add new borrower to database
router.post('/knjige', function (req, res, next) {
    console.log("POST");
    console.log(req.body);
    Borrower.create(req.body).then((borrower) => res.send(borrower))
        .catch(next); //catches errors and sends them to next middleware - error hangling           
})

//update borrower in database
router.put('/knjige/:id', function (req, res, next) {
    if (req.body.deleteNote === true) {
        console.log("PUT");
        console.log(req.body)
        Borrower.updateOne({ _id: req.params.id }, { $unset: { notes: "" } }).then(borrower => console.log(borrower))
    } else {
        Borrower.updateOne({ _id: req.params.id }, { $push: req.body }).then(function (borrower) {
            res.send({ borrower });
        })
    }
});


//delete borrower from database
router.delete('/knjige/:id', function (req, res, next) {
    console.log("DELETE");
    Borrower.findByIdAndRemove({ _id: req.params.id }).then(function (borrower) {
        res.send(borrower);
    })
});

module.exports = router;