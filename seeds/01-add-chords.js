exports.seed = function (knex) {
  return knex("chords")
    .del()
    .then(function () {
      return knex("chords").insert([
        { name: "C minor", root: "C", symbol: "Cm", notes: ["C", "Eb", "G"] },
        {
          name: "C minor 7",
          root: "C",
          symbol: "Cm7",
          notes: ["C", "Eb", "G", "Bb"],
        },
        {
          name: "C minor 9",
          root: "C",
          symbol: "Cm9",
          notes: ["C", "Eb", "G", "Bb", "D"],
        },
      ]);
    });
};
