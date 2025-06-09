const express = require("express");
const bodyParser = require("body-parser");
const placesRouter = require("./routes/places-route");

const app = express();

app.use(placesRouter);

app.listen(5002);

