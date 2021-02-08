const express = require("express");
const app = express();

const cors = require("cors");

const knex = require("knex");
const config = require("./knexfile")[process.env.NODE_ENV || "development"];
const database = knex(config);

const { Model } = require("objection");
Model.knex(database);

const Chord = require("./models/Chord");

app.use(cors());

app.get("/chords", (request, response) => {
  Chord.query().then((chords) => response.json({ chords }));
});

app.get("/chords/:id", (request, response) => {
  Chord.query()
    .where({ id: request.params.id })
    .first()
    .then((chord) => response.json({ chord }));
});

app.listen(process.env.PORT || 4000);
