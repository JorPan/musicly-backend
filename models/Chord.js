const { Model } = require("objection");

class Chord extends Model {
  static get tableName() {
    return "chords";
  }
}

module.exports = Chord;
