exports.up = function (knex) {
  return knex.schema.createTable("chords", (chords) => {
    chords.increments();
    chords.string("name");
    chords.string("root");
    chords.string("symbol");
    chords.specificType("notes", "text ARRAY");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("chords");
};
