const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport")

const users = require("./routes/api/users");
const posts = require("./routes/api/posts");
const profile = require("./routes/api/profile");

const app = express();

const db = require("./config/keys");

mongoose
    .connect(db.mongoURI, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        })
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(`DB connection error ${err}`));

app.use(passport.initialize());

require("./config/passport")(passport);

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use("/api/users", users);
app.use("/api/posts", posts);
app.use("/api/profile", profile);

const port = process.env.PORT || 2020;

app.listen(port, () => console.log(`Server running on port ${port}`));
