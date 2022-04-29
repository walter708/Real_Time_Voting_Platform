const express = require('express');
const {model} = require('mongoose');
const {User} = require('../models/users');
const {Event} = require('../models/events');
const {Candidate} = require('../models/candidates');
const {Result} = require('../models/results');
const artifacts = require('../build/contracts/Vote.json');
const contract = require('@truffle/contract');
const Web3 = require('web3');
var converter = require('hex2dec');
const router = express.Router();


if (typeof web3 !== 'undefined') {
  var web3 = new Web3(web3.currentProvider); 
} else {
  var web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'));
  console.log("########### web3 object created in vote route #############")
}
const LMS = contract(artifacts)
LMS.setProvider(web3.currentProvider)


// Load the event data for all open events that a given user is eligible for.
router.get('/loadEventsForUser', async (req, res, next) => {
  const uid = req.query.uid;

  // Using uid, get the user's orgName.
  const userData = await User.findOne({uid: uid});
  const userOrgName = userData.orgName;

  // Using orgName, find all open events with same voter tag.
  const eventsForUser = await Event.find({votersTag: userOrgName, isClosed: false});

  // Send back open events as list of objects.
  res.status(200).send({eventsForUser});
});


// Load the candidate data for a given event.
router.get('/loadCandidates', async (req, res, next) => {
  const eid = req.query.eid;

  // Get event data for the given EID.
  const eventData = await Event.findOne({eid: eid});

  // Retrieve the list of cids from the event data.
  const cids = eventData.candidateIDs;
  
  // Produce an array of candidate data for the given event.
  let candDataArr = [];
  for(const cid of cids) {
    const canData = await Candidate.findOne({'cid': cid});
    candDataArr.push(canData);
  }

  res.status(200).send({candDataArr});
});


// Load the event data for all closed events that a given user is authorized to view.
router.get('/loadResultsForUser', async (req, res, next) => {
  console.log("Loading results for user.");

  const uid = req.query.uid;

  // Using uid, get the user's orgName.
  const userData = await User.findOne({uid: uid});
  const userOrgName = userData.orgName;

  // Using orgName, find all closed events with same voter tag.
  const eventsForUser = await Event.find({votersTag: userOrgName, isClosed: true});

  // Create variable to store the results of all elections that the user may view.  
  let resultsForUser = [];

  // For each event, use the eid to get the results of the election.
  for(const event of eventsForUser) {
    const result = await Result.findOne({eid: event.eid});
    resultsForUser.push(result);
  }

  const results = {resultsForUser: resultsForUser, authLevel: userData.authLevel};

  // Send back open events as list of objects.
  res.status(200).send(results);
});


// Set the voting for an event to be closed.
router.post('/closeEvent', async (req, res, next) => {
  const eid = req.body.eid;
  const accounts = await web3.eth.getAccounts();
  const lme = await LMS.deployed();

  // Using the eid, retrieve the event's data and set it to be closed.
  await Event.findOneAndUpdate({eid: eid}, {isClosed: true});
  const modEvent = await Event.findOne({eid: eid});
  console.log(modEvent);

  // Blockchain magic to tally winner and vote counts for the newly closed event.
  const event = Number(eid);
  let cache = [];
  const ctr = await lme.voteCount()
  console.log("vote counts: "+ ctr.toNumber())
  const ctr1 = ctr.toNumber()  
  console.log("the event Id recieved from backend: " + event);

  var votes_dict = {};
  for (let i = 1; i <= ctr1; i++) {
    const votes = await lme.tasks(i);
    const votes_temp = JSON.stringify(votes);
    const votes_json = JSON.parse(votes_temp);

    var dec_eventId = converter.hexToDec(votes_json.eventId);
    var votes_event = converter.hexToDec(votes_json.vote);
    var num = Number(votes_event);
    var eve = Number(dec_eventId);
    console.log("eventId: "+ eve + "    "+ " candidate ID: "+ num);
    
    if(event == dec_eventId) {
      if(num in votes_dict) {
        votes_dict[num] += 1;
      } else {
        votes_dict[num] = 1
      }
    }
    console.log("####################################")
    cache = [...cache, votes];
  }
  console.log(votes_dict)

  // Determine candidate cid with the most votes in votes_dict.
  let winnerCID = "";
  let winnerTally = 0;
  for (const [key, value] of Object.entries(votes_dict)) {
    if(value > winnerTally) {
      winnerCID = key;
      winnerTally = value;
    }
  }
  console.log("Winner CID : " + winnerCID + "    " + "Winner tally: "+ winnerTally);

  // Determine the winning candidate's name.
  const candData = await Candidate.findOne({cid: winnerCID});
  const candName = candData.fullName;
  console.log("Winner name: " + candName);

  // Create new 'results' item.
  const newResult = new Result({
    eid,
    cid: winnerCID,
    candidateName: candName,
    candidateVotes: winnerTally,
    eventName: modEvent.eventName,
    startDate: modEvent.startDate,
    endDate: modEvent.endDate,
  });

  // Store data for newly closed event on mongoDB under the "results" collection.
  await newResult.save();

  // Send back a status to indicate success.
  res.status(200).send({msg: "Event closed for voting. Check view results page for details."});
});


// Store the received vote on the blockchain.
router.post('/storeVote', async (req, res, next) => {
  cid = req.body.cid;
  eid = req.body.eid;
  uid = req.body.uid;

  console.log(cid);
  console.log(eid);
  console.log(uid);

  const accounts = await web3.eth.getAccounts();
  const lme = await LMS.deployed();

  console.log("the account is : "+ accounts[0]);
  
  // Using the eid, retrieve the event's data and add the uid to the voterUIDs array.
  let modEvent = await Event.findOne({eid: eid});
  await Event.findOneAndUpdate({eid: eid}, {"$push": {"voterUIDs": uid}});
  modEvent = await Event.findOne({eid: eid});
  console.log(modEvent); // TODO

  // Blockchain magic to store the vote as its cid and eid.
  const ctr = await lme.voteCount();
  console.log("vote counts: " + ctr.toNumber());
  const cast = await lme.createVote(eid, cid, {from: accounts[0]});
  console.log(cast);

  res.status(200).send({msg: "Received!"});
});


module.exports = router;