const handleImage = knex => (req, res) => {
  const { id } = req.body;
  return knex("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then(entries => {
      res.json(entries[0]);
    })
    .catch(err => {
      res.status(400).json("failed to update entries");
    });
};

module.exports = { handleImage: handleImage };
