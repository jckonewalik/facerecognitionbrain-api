const express = require("express");
const db_config = require("./configs/db_config");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const register = require("./controllers/register");
const profile = require("./controllers/profile");
const signin = require("./controllers/signin");
const image = require("./controllers/image");
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

app.get("/", profile.getUsers(knex));

app.post("/signin", signin.handleSignin(bcrypt, knex));

app.post("/register", register.handleRegister(bcrypt, knex));

app.get("/profile/:id", profile.getProfile(knex));

app.put("/image", image.handleImage(knex));

app.listen(3000, () => {
  console.log("app is running on port 3000");
});
