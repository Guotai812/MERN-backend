const {v4: uuidv4} = require("uuid");
const HttpError = require("../models/http-error");
const DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "One of the most famous sky scrapers in the world!",
    location: {
      lat: 40.7484474,
      lng: -73.9871516,
    },
    address: "20 W 34th St, New York, NY 10001",
    creator: "u1",
  },
];

const getPlaceByPlaceId = (req, res, next) => {
  const pid = req.params.pid;
  const place = DUMMY_PLACES.find((place) => place.id == pid);
  if (!place) {
    throw new HttpError("Counld not find place", 404);
  }
  res.json(place);
};

const getPlacesByUserId = (req, res, next) => {
  const uid = req.params.uid;
  const places = DUMMY_PLACES.filter((p) => p.creator == uid);
  if (places.length === 0) {
    throw new HttpError("could not find palces", 404);
  }
  res.json(places);
};

const createPlace = (req, res, next) => {
  const { title, description, location, address, creator} = req.body;
  const newPlace = {
    id: uuidv4(),
    title,
    description,
    location,
    address,
    creator
  }
  DUMMY_PLACES.push(newPlace);
  res.status(201).json({ place: newPlace });
}

exports.getPlaceByPlaceId = getPlaceByPlaceId;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
