const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

const validateProfileInput = require("../../validation/profile");
const validateExpInput = require("../../validation/experience");
const validateEducationInput = require("../../validation/education");

const Profile = require("../../models/Profile")
const User = require("../../models/User")

router.get("/tests", (req, res) => {
    res.json({ msg: "profile works" });
});

router.get("/", passport.authenticate("jwt", { session: false }), (req, res) => {
    let errors = {}
    Profile.findOne({user: req.user.id})
        .populate("user", ["name", "avatar"])
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

router.get("/profiles/all", (req, res) => {
    const errors = {}

    Profile.find()
        .populate("user", ["name", "avatar"])
        .then(profiles => {
            if (!profiles) {
                errors.noprofiles = "There are no profiles"
                return res.ststus(404).json(errors)
            }
            res.json(profiles)
        })
        .catch(err => res.status(404).json({profiles: "There are no profiles"}))
})


router.get("/handle/:handle", (req, res) => {
    let errors = {}

    Profile.findOne({ handle: req.params.handle })
        .populate("user", ["name", "avatar"])
        .then(profile => {
            if (!profile) {
                errors.noprofile = "There is no profile for this user"
                return res.ststus(404).json(errors)
            }
            res.json(profile)
        })
        .catch(err => res.status(404).json({profile: "There is no profile for this user"}))
})

router.get("/user/:user_id", (req, res) => {
    let errors = {}

    Profile.findOne({ user: req.params.user_id })
        .populate("user", ["name", "avatar"])
        .then(profile => {
            if (!profile) {
                errors.noprofile = "There is no profile for this user"
                res.ststus(404).json(errors)
            }
            res.json(profile)
        })
        .catch(err => res.status(404).json({profile: "There is no profile for this user"}))
})

router.post("/", passport.authenticate("jwt", {session: false}), (req, res) => {
    

    const {errors, isValid} = validateProfileInput(req.body)
    if(!isValid && errors === {}) {
        return res.status(400).json(errors)
    }

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
                Profile.findOne({handle: profileFields.handle})
                    .then(profile => {
                        if (profile) {
                            errors.handle = "This handle already exists"
                            return res.status(400).json(errors)
                        }
                        // Create
                        new Profile(profileFields).save().then(profile => res.json(profile))
                    })
            }
        })
})

router.post("/experience", passport.authenticate("jwt", {session: false}), (req, res) => {

    const {errors, isValid} = validateExpInput(req.body)
    if(!isValid && errors === {}) {
        return res.status(400).json(errors)
    }

    Profile.findOne({ user: req.user.id })
        .then(profile => {
            const newExp = {
                title: req.body.title,
                company: req.body.company,
                location: req.body.location,
                from: req.body.from,
                to: req.body.to,
                current: req.body.current,
                description: req.body.description,
            }

            profile.experience.unshift(newExp)

            profile.save().then(profile => res.json(profile))
            console.log(profile)
        })
})

router.post("/education", passport.authenticate("jwt", {session: false}), (req, res) => {

    const {errors, isValid} = validateEducationInput(req.body)
    if(!isValid && errors === {}) {
        return res.status(400).json(errors)
    }

    Profile.findOne({ user: req.user.id })
        .then(profile => {
            const newEdu = {
                school: req.body.school,
                degree: req.body.degree,
                fieldOfStudy: req.body.fieldOfStudy,
                from: req.body.from,
                to: req.body.to,
                current: req.body.current,
                description: req.body.description,
            }

            profile.education.unshift(newEdu)

            profile.save().then(profile => res.json(profile))
        })
})

module.exports = router;
