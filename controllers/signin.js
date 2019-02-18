const handleSignin = (bcrypt, knex) => (req, res) => {
  const { email, password } = req.body;
  knex
    .select("email", "hash")
    .from("login")
    .where("email", "=", email)
    .then(data => {
      if (data.length) {
        let valid = bcrypt.compareSync(password, data[0].hash);
        if (valid) {
          knex
            .select("*")
            .from("users")
            .where("email", "=", email)
            .then(data => {
              res.json(data[0]);
            })
            .catch(err => {
              res.status(400).json("failed to get user's info");
            });
        } else {
          res.status(400).json("bad credentials");
        }
      } else {
        res.status(400).json("bad credentials");
      }
    })
    .catch(err => {
      res.status(400).json("failed to signin");
    });
};

module.exports = { handleSignin: handleSignin };
