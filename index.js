const express = require("express");
const app = express();

const cors = require("cors");

const knex = require("knex");
const config = require("./knexfile")[process.env.NODE_ENV || "development"];
const database = knex(config);
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { Model } = require("objection");
Model.knex(database);

const Chord = require("./models/Chord");
const { response } = require("express");

app.use(cors());
app.use(bodyParser.json());

app.post("/users", (request, response) => {
  const { user } = request.body;
  bcrypt
    .hash(user.password, 12)
    .then((hashedPassword) => {
      return database("user")
        .insert({
          id: user.id,
          firstname: user.firstname,
          lastname: user.lastname,
          username: user.username,
          email: user.email,
          password_hash: hashedPassword,
        })
        .returning("*");
    })
    .then((users) => {
      const user = users[0];
      response.json({ user });
    })
    .catch((error) => {
      response.json({ error: error.message });
    });
});

app.post("/login", (request, response) => {
  const { user } = request.body;

  database("user")
    .select()
    .where({ username: user.username })
    .first()
    .then((retrievedUser) => {
      if (!retrievedUser) throw new Error("No User Found..");

      return Promise.all([
        bcrypt.compare(user.password, retrievedUser.password_hash),
        Promise.resolve(retrievedUser),
      ]);
    })
    .then((results) => {
      const arePasswordsTheSame = results[0];
      const user = results[1];

      if (!arePasswordsTheSame) throw new Error("Wrong Password");

      const payload = { username: user.username };
      const secret = "hmmmkaythen?!";

      jwt.sign(payload, secret, (error, token) => {
        if (error) throw new Error("Signing in did not work");

        response.json({ token });
      });
    })
    .catch((error) => {
      response.json({ error: error.message });
    });
});

app.get("/lucky-charms", authenticate, (request, response) => {
  response.json({
    message: `${request.user.username} You found me luck charms?!`,
  });
});

function authenticate(request, response, next) {
  const authHeader = request.get("Authorization");
  const token = authHeader.split(" ")[1];

  const secret = "hmmmkaythen?!";
  jwt.verify(token, secret, (error, payload) => {
    if (error) response.json({ error: error.message });

    database("user")
      .select()
      .where({ username: payload.username })
      .first()
      .then((user) => {
        request.user = user;
        next();
      })
      .catch((error) => {
        response.json({ error: error.message });
      });
  });
}

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
