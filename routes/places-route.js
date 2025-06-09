const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
    console.log("places-route");
    res.json({message: "asd"});
})

module.exports = router;