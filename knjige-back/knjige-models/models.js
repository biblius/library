const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//geolocation schema
// const GeoSchema = new Schema({
//     type: {
//         type: String,
//         default: 'Point'
//     },
//     coordinates: {
//         type: [Number],
//         index: '2dsphere'
//     }
// });


//create borrower schema and model
const borrowerSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is required"]
    },
    book: {
        type: String,
        required: [true, "Book is required"]
    },
    dateBorrowed: {
        type: String
    },
    notes: {
        type: Array,
        default: []
    }
});

const Borrower = mongoose.model('borrower', borrowerSchema)

module.exports = Borrower;