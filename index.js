const express = require("express");
const app = express();

const cors = require("cors");

const knex = require("knex");
const config = require("./knexfile")[process.env.NODE_ENV || "development"];
const database = knex(config);

app.use(cors());

app.get("/chords", (request, response) => {
  database("chords")
    .select()
    .then((chords) => response.json({ chords }));
});

app.get("/chords/:id", (request, response) => {
  database("chords")
    .select()
    .where({ id: request.params.id })
    .first()
    .then((chord) => response.json({ chord }));
});

app.listen(process.env.PORT || 4000);
