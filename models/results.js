// Basic schema definition for the results collection in the database.

const mongoose = require('mongoose');

// Schema object to define all attributes and related propreties.
const resultModel = new mongoose.Schema({
    eid: {
        type: String,
        required: true,
    },
    cid: {
        type: String,
        required: true,
    },
    candidateName: {
        type: String,
        required: true,
    },
    candidateVotes: {
        type: Number,
        required: true,
    },
    eventName: {
        type: String,
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
});

// This model connects the collection and the schema.
// If the collection has not yet been created, this will create one.
module.exports = {
    Result: mongoose.model('results', resultModel)
};