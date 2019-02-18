const handleRegister = (bcrypt, knex) => (req, res) => {
  const { email, name, password } = req.body;
  bCryptedPassword = bcrypt.hashSync(password);
  knex
    .transaction(trx => {
      trx
        .insert({
          hash: bCryptedPassword,
          email: email
        })
        .into("login")
        .returning("email")
        .then(logginEmail => {
          return trx("users")
            .returning("*")
            .insert({
              name: name,
              email: logginEmail[0],
              joined: new Date()
            })
            .then(user => {
              res.json(user[0]);
            })
            .then(trx.commit)
            .catch(trx.rollback);
        });
    })
    .catch(err => {
      res.status(400).json("unable to register");
    });
};

module.exports = { handleRegister: handleRegister };
