// Basic schema definition for the candidates collection in the database.

const mongoose = require('mongoose');

// Schema object to define all attributes and related propreties.
const candidateModel = new mongoose.Schema({
    cid: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    fullName: {
        type: String,
        required: true,
    },
    affiliation: {
        type: String,
    },
    platform: {
        type: String,
    }
});

// This model connects the collection and the schema.
// If the collection has not yet been created, this will create one.
module.exports = {
    Candidate: mongoose.model('candidates', candidateModel)
};