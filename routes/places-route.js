const express = require("express");
const router = express.Router();
const HttpError = require("../models/http-error");

const DUMMY_PLACES = [
  {
    id: 'p1',
    title: 'Empire State Building',
    description: 'One of the most famous sky scrapers in the world!',
    location: {
      lat: 40.7484474,
      lng: -73.9871516
    },
    address: '20 W 34th St, New York, NY 10001',
    creator: 'u1'
  }
];

router.get("/:pid", (req, res, next) => {
    const pid = req.params.pid;
    const place = DUMMY_PLACES.find(place => place.id == pid)
    if(!place) {
      throw new HttpError("Counld not find place", 404);
    }
    res.json(place);
});

router.get("/users/:uid", (req, res, next) => {
    const uid = req.params.uid;
    const places = DUMMY_PLACES.filter(p => p.creator == uid);
    if(places.length === 0) {
      throw new HttpError("could not find palces", 404);
    }
    res.json(places);
});

module.exports = router;