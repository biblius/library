//create history schema and model
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const historySchema = new Schema({
    name: {
        type: String
    },
    book: {
        type: String
    },
    date: {
        type: Date
    },
    type: {
        type: String
    }
})
const History = mongoose.model('history', historySchema);
module.exports = History;