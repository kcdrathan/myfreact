const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
// const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");

const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

const keys = require("../../config/keys");
const User =  require("../../models/User");

router.get("/tests", (req, res) => {
    res.json({ msg: "users works" });
});

router.post("/register", (req, res) => {

    const {errors, isValid} = validateRegisterInput(req.body)
    if (isValid) {
        return res.status(400).json(errors)
    }    
    console.log("check")

    User.findOne({ email: req.body.email})
        .then(user => {
            if (user) {
                res.send("User already exists");
            } else {
                const avatar = gravatar.url(req.body.email, {
                    s: "200",
                    r: "pg",
                    d: "mm" //Default
                })

                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password,
                    avatar: avatar
                })

                // bcrypt.genSalt(5, (err, salt) => {
                //     bcrypt.hash(req.body.password, salt, (err, hash) => {
                //         if(err) throw err;
                //         newUser.password = hash;
                        newUser
                            .save()
                            .then(user => res.status(200).json(user))
                            .catch(err => res.send(err))
                //     });
                // });
            }
        });
});

router.post("/login", (req, res) => {

    const {errors, isValid} = validateLoginInput(req.body)
    if (isValid) {
        return res.status(400).json(errors)
    } 
    console.log("check")

    const email = req.body.email;
    const password = req.body.password;
    User.findOne({email})
        .then(user => {
            if(!user) {
                errors.email = "User doesn't exist"
                return res.status(404).json(errors)
            } else {
                // bcrypt.compare(password, user.password)
                    // .then(match => {
                        if (password == user.password) {
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
                                        token: "Bearer " + token
                                    })
                            })
                        } else {
                            errors.password = "Password incorrect"
                            return res.status(400).json(errors)
                        }
                    // })
                    // .catch(err => res.status(500).json({err: err}))
            }
        })
})

router.get(
    "/current",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        res.json({id: req.user.id, name: req.user.name, email: req.user.email})
    }
)

module.exports = router;
