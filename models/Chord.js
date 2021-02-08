const { Model } = require("objection");

class Chord extends Model {
  static tableName = "chords";
}

module.exports = Chord;
