const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

const Profile = require("../../models/Profile")
const User = require("../../models/User")

router.get("/tests", (req, res) => {
    res.json({ msg: "profile works" });
});

router.get("/", passport.authenticate("jwt", { session: false }), (req, res) => {
    let errors = {}
    Profile.findOne({user: req.user.id})
        .then( profile => {
            if (!profile) {
                errors.noprofile = "User has no profile"
                return res.status(404).json(errors)
            }
            res.json(profile)
        })
        .catch(err => {
            res.ststus(404).json(err)
        })
})

module.exports = router;
