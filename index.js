const express = require('express');
const app = express();
const cors = require('cors');
const Web3 = require('web3');
const passport = require('passport');
const mongodb = require('mongodb').MongoClient
const mongoose = require('mongoose');
const session = require('express-session');
const artifacts = require('./build/contracts/Vote.json');
const contract = require('@truffle/contract');
const MongoStore = require('connect-mongo');
const bodyParser = require('body-parser');

const port = 5000;

const localhost_addr = "http://localhost:";

const mongoURL = "mongodb+srv://r3parmar:CandidVoTePWD@candidvote.wxjmp.mongodb.net/CandidVoTeDB?retryWrites=true&w=majority";

// Block chain connection
if (typeof web3 !== 'undefined') {
    var web3 = new Web3(web3.currentProvider); 
} else {
    var web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'));
    console.log("########### web3 object created ###########");
}
const LMS = contract(artifacts);
LMS.setProvider(web3.currentProvider);


mongoose.connect(mongoURL).then(async() =>{
    const accounts = await web3.eth.getAccounts();
    const lms = await LMS.deployed();
    console.log("###### all the blockchain object created ########")

    // MIDDLEWARE
    app.options("*", cors({ origin: localhost_addr + port, optionsSuccessStatus: 200 }));
    app.use(cors({ origin: localhost_addr + port, optionsSuccessStatus: 200 }));
    app.use(express.json());
    app.use('/', express.static('public'));
    app.use(bodyParser.json());

    app.use(session({
        secret: 'my secret, any string', // TODO: Change to rely on env var later.
        store: MongoStore.create({mongoUrl: mongoURL}),
        cookie: {
            maxAge: 1000 * 60 * 60 * 24  // 1 day
        },
        resave: false,
        saveUninitialized: false
    }));

    // PASSPORT AUTH
    const auth = require('./auth');
    auth.initPassport(app);

    // ROUTES
    const users = require('./routes/users');
    app.use('/users', users);

    const events = require('./routes/events');
    app.use('/events', events);

    const votes = require('./routes/votes');
    app.use('/votes', votes);

    // SERVER LAUNCH
    app.listen(process.env.PORT || port, () => {
        console.log('Listening on port '+ (port));
     })
});