const express = require("express");
const router = express.Router();

const placesController = require("../controllers/places-controller");


router.get("/:pid", placesController.getPlaceByPlaceId);
router.get("/users/:uid", placesController.getPlacesByUserId);
router.post("/", placesController.createPlace);

module.exports = router;