const getProfile = knex => (req, res) => {
  const { id } = req.params;
  knex
    .select("*")
    .from("users")
    .where({ id })
    .then(u => {
      if (u.length) {
        res.json(u[0]);
      } else {
        res.status(404).json("not found");
      }
    })
    .catch(err => {
      res.status(400).json("error getting user");
    });
};

const getUsers = knex => (req, res) => {
  knex
    .select("*")
    .from("users")
    .then(data => {
      console.log(data);
    });
};

module.exports = { getProfile: getProfile, getUsers: getUsers };
