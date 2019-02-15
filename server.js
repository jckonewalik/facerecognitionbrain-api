const express = require("express");
const db_config = require("./configs/db_config");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");

const { server_name, db_name, db_user, db_password } = db_config;

const knex = require("knex")({
  client: "pg",
  connection: {
    host: server_name,
    user: db_user,
    password: db_password,
    database: db_name
  }
});

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  knex
    .select("*")
    .from("users")
    .then(data => {
      console.log(data);
    });
});

app.post("/signin", (req, res) => {
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
});

app.post("/register", (req, res) => {
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
});

app.get("/profile/:id", (req, res) => {
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
});

app.put("/image", (req, res) => {
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
});

app.listen(3000, () => {
  console.log("app is running on port 3000");
});
