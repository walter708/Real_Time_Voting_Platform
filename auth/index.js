// This file defines the strategy used to verify users logging into the system.
// This uses passport.js to handle login.

const passport = require('passport');
const LocalStrategy = require('passport-local');
const {User} = require('../models/users');
const validPassword = require('../lib/passwordUtils').validPassword;


const verifyCallback = (email, password, done) => {
    User.findOne({email})
        .then((user) => {
        	console.log("authenticating in callback ", user);
            if(!user) {return done(null, false)}

            const isValid = validPassword(password, user.hash, user.salt);

        	console.log("checking is valid ", isValid);

            if(isValid) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        })
        .catch((err) => {
            done(err);
        });
}


function initPassport(app) {
	app.use(passport.initialize())
	app.use(passport.session())

    const strategy = new LocalStrategy({usernameField: "email", passwordField: "password"}, verifyCallback);
	passport.use(strategy);

	passport.serializeUser((user, done) => {
		console.log("serializing ")
	    done(null, user.uid);
	});

	passport.deserializeUser((userId, done) => {
		console.log("deserializing ")

		User.findOne({uid: userId})
	        .then((user) => {
	            done(null, user);
	        })
	        .catch(err => done(err))
	});
}

module.exports = {initPassport}