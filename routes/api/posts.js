const express = require("express");
const router = express.Router();
const mongoose = require("mongoose")
const passport = require("passport")

const validatePostInput = require("../../validation/post")

const User = require("../../models/User")
const Post = require("../../models/Post")

router.get("/tests", (req, res) => {
    res.json({ msg: "posts works" });
});

router.post("/", passport.authenticate("jwt", { session: false }), (req, res) => {

    const {errors, isValid} = validatePostInput(req.body)

    if(!isValid) {
        res.status(400).json(errors)
    }

    const newPost = new Post({
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.body.user
    })

    newPost.save().then(post => {res.json(post)})
})

router.get("/", (req, res) => {
    Post.find()
        .sort({date: -1})
        .then(posts => {
            res.json(posts)
        })
        .catch(err => res.status(404))
})

router.get("/:id", (req, res) => {
    Post.findById(req.params.id)
        .then(post => {
            res.json(post)
        })
        .catch(err => res.status(404))
})

module.exports = router;
