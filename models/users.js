// Basic schema definition for the users collection in the database.

const mongoose = require('mongoose');

// Schema object to define all attributes and related propreties.
const userModel = new mongoose.Schema({ // Changed from userSchema.
    uid: {
        type: String,
        required: true,
    },
    authLevel: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    orgName: {
        type: String,
        required: true,
    },
    hash: {
        type: String,
        required: true,
    },
    salt: {
        type: String,
        required: true,
    },
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    dateOfBirth: {
        type: Date,
        required:true,
    },
    address: {
        type: String,
        required:true,
    },
    province: {
        type: String,
        required:true,
    },
    zipCode: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true,
    },
    phoneNumber:{
        type: Number,
        required: true,
    }
});

// This model connects the collection and the schema.
// If the collection has not yet been created, this will create one.
module.exports = {
    User: mongoose.model('users', userModel)
};

// const userModel = mongoose.model("users" , userSchema);
// module.exports = userModel;