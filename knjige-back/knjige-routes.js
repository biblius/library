const express = require('express');
const router = express.Router();
const Borrower = require('./knjige-models/models.js');

//get a list of borrowers from the database
router.get('/knjige', (req, res, next) => {
    //find all borrowers and return them
    Borrower.find()
        .then(borrower => res.send(borrower))
        .catch(next); //catches errors and sends them to errorhandler  
});

//add new borrower to database
router.post('/knjige', (req, res, next) => {
    Borrower.create(req.body)
        .then(borrower => res.send(borrower))
        .catch(next);      
})

//update borrower in database
router.put('/knjige/:id', (req, res, next) => {
    if (req.body.deleteNote === true) {
        console.log(req.body)
        Borrower.updateOne({ _id: req.params.id }, { $unset: { notes: [] } })
            .then(borrower => res.send(borrower))
            .catch(next);
    } else {
        Borrower.updateOne({ _id: req.params.id }, { $push: req.body })
            .then(borrower => res.send(borrower))
            .catch(next);
    }
});

//delete borrower from database
router.delete('/knjige/:id', (req, res, next) => {
    Borrower.findByIdAndRemove({ _id: req.params.id })
        .then(borrower => res.send(borrower))
        .catch(next);
});

module.exports = router;