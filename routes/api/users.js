const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const keys = require("../../config/keys");
const User =  require("../../models/User");

router.get("/tests", (req, res) => {
    res.json({ msg: "users works" });
});

router.post("/register", (req, res) => {
    User.findOne({ email: req.body.email})
        .then(user => {
            if (user) {
                res.send("User already exists");
            } else {
                const avatar = gravatar.url(req.body.email, {
                    s: "200",
                    r: "pg",
                    d: "mm"
                })

                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password,
                    avatar: avatar
                })

                bcrypt.genSalt(5, (err, salt) => {
                    bcrypt.hash(req.body.password, salt, (err, hash) => {
                        if(err) throw err;
                        newUser.password = hash;
                        newUser
                            .save()
                            .then(user => res.status(200).json(user))
                            .catch(err => res.send(err))
                    });
                });
            }
        });
});

router.post("/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({email})
        .then(user => {
            if(!user) {
                res.status(404).json("User doesn't exist")
            } else {
                bcrypt.compare(password, user.password)
                    .then(match => {
                        if (match) {
                            const payload = {
                                id: user.id,
                                name: user.name,
                                email: user.email
                            }

                            jwt.sign(
                                payload,
                                keys.secretOrKey,
                                { expiresIn: 3600 },
                                (err, token) => {
                                    res.json({
                                        success: true,
                                        token: "Barrer " + token
                                    })
                            })
                        }
                        else res.status(400).json({password: "Password incorrect"})
                    })
                    .catch(err => res.status(500).json({err: err}))
            }
        })
})

module.exports = router;
