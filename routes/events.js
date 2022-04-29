const express = require('express');
const {model} = require('mongoose');
const {Event} = require('../models/events');
const {Candidate} = require('../models/candidates');
const router = express.Router();

router.post('/saveEvent', async (req, res, next) => {
  // Generate a random, unique eid.
  let eid = "";

  while(eid === "") {
    // Generate random eid.
    let newRand = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');

    // Ensure that generated ID does not already exist.
    let eventID = await Event.count({eid: newRand});
    if(eventID === 0) {
      eid = newRand;
    }
  }

  // Array to hold the Candidate IDs that will be generated.
  const cids = [];

  // Extract the candidates data from the received event object.
  for(const candidate of req.body.candidates) {
    // Generate a random, unique cid.
    let cid = "";

    while(cid === "") {
      // Generate random cid.
      let newRand = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');

      // Ensure that generated ID does not already exist.
      let candidateID = await Candidate.count({cid: newRand});
      if(candidateID === 0) {
        cid = newRand;
      }
    }

    // Create new candidate item.
    const newCandidate = new Candidate({
      cid,
      email: candidate.Email,
      fullName: candidate.Name,
      affiliation: candidate.Affiliation,
      platform: candidate.Platform,
    });

    await newCandidate.save();

    // Add new candidate ID to the list of IDs.
    cids.push(cid);
  }

  // Create new event item.
  const newEvent = new Event({
    eid,
    eventName: req.body.eventName,
    votersTag: req.body.votersTag,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    description: req.body.eventDescription,
    candidateIDs: cids,
    voterUIDs: new Array(),
    isClosed: false,
  });

  await newEvent.save()
    .then((user) => {
      console.log(user);
    next();
  });

  res.redirect('/adminDashboard/dashboard_admin.html');
});

module.exports = router;