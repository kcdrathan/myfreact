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

router.post("/", passport.authenticate("jwt", {session: false}), (req, res) => {
    let errors = {}
    const profileFields = {}
    profileFields.user = req.user.id
    if (req.body.handle) profileFields.handle = req.body.handle
    if (req.body.company) profileFields.company = req.body.company
    if (req.body.website) profileFields.website = req.body.website
    if (req.body.location) profileFields.location = req.body.location
    if (req.body.bio) profileFields.bio = req.body.bio
    if (req.body.status) profileFields.status = req.body.status
    // Skills (array)
    if (typeof skills !== undefined) {
        profileFields.skills = req.body.skills.split(",")
    }
    profileFields.social = {}
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter
    if (req.body.linkedIn) profileFields.social.linkedIn = req.body.linkedIn
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook
    
    console.log(profileFields)

    Profile.findOne({ user: req.user.id })
        .then(profile => {
            if (profile) {
                // Update
                Profile.findOneAndUpdate({ user: req.user.id }, { $set: profileFields }, {new: true})
                    .then(profile => {
                        res.json(profile)
                    })
            } else {
                // Check if handle exists
                profile.findOne({handle: profileFields.handle})
                    .then(profile => {
                        if (profile) {
                            errors.handle = "This handle already exists"
                            return ReadableStream.status(400).json(errors)
                        }
                        // Create
                        new Profile(profileFields).save().then(profile => res.json(profile))
                    })
            }
        })
})

module.exports = router;
