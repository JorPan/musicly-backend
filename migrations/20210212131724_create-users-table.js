exports.up = function (knex) {
  return knex.schema.createTable("user", (table) => {
    table.increments();
    table.string("firstname");
    table.string("lastname");
    table.string("username");
    table.string("email");
    table.string("password_hash");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("user");
};
