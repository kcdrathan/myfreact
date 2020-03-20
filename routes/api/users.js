const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");

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

                bcrypt.genSalt(20, (err, salt) => {
                    bcrypt.hash(req.body.password, salt, (err, hash) => {
                        if(err) throw err;
                        newUser.password = hash;
                        newUser
                            .save()
                            .then(user => res.status(200).json(user))
                            .catch(err => res.send(err))
                    })
                })
            }
        })

    
})

module.exports = router;
