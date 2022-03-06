const { request } = require('express');
const express = require('express');
const router = express.Router();
const Borrower = require('./knjige-models/borrower-model.js');
const History = require('./knjige-models/history-model.js');

//get a list of borrowers from the database
router.get('/knjige', (req, res, next) => {
    //find all borrowers and return them
    Borrower.find()
        .then(borrower => res.send(borrower))
        .catch(next); //catches errors and sends them to errorhandler  
});

//get the last 15 transactions
router.get('/knjige/history', (req, res, next) => {
    console.log(req.body)
    History.aggregate([
        { '$sort': { 'date': -1 } },
        { '$limit': 15 }
    ])
        .then(history => {
            console.log(history)
            res.send(history)
        })
        .catch(next);
})

//add new borrower to database
router.post('/knjige', (req, res, next) => {
    Borrower.create(req.body)
        .then(borrower => {
            History.create({ name: borrower.name, book: borrower.book, date: borrower.dateBorrowed, type: "BORROWED" })
                .then(history => {
                    const both = JSON.stringify({ borrower: borrower, history: history })
                    res.send(both);
                })
                .catch(next);
        })
        .catch(next);
});

//add notes to borrower in database
router.put('/knjige/:id', (req, res, next) => {
    Borrower.updateOne({ _id: req.params.id }, { $push: req.body })
        .then(borrower => res.send(borrower))
        .catch(next);
});

//delete borrower from database
router.delete('/knjige/:id', (req, res, next) => {
    const date = new Date()
    Borrower.findByIdAndRemove({ _id: req.params.id })
        .then(borrower => {
            History.create({ name: borrower.name, book: borrower.book, date: date, type: "RETURNED" })
                .then(history => {
                    const both = JSON.stringify({ borrower: borrower, history: history })
                    res.send(both);
                })
                .catch(next);
        })
        .catch(next);
});

//delete all notes from borrower
router.delete('/knjige/:id/notes', (req, res, next) => {
    Borrower.updateOne({ _id: req.params.id }, { $unset: { notes: [] } })
        .then(borrower => res.send(borrower))
        .catch(next);
})

module.exports = router;