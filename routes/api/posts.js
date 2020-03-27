const express = require("express");
const router = express.Router();
const mongoose = require("mongoose")
const passport = require("passport")

const validatePostInput = require("../../validation/post")

const User = require("../../models/User")
const Post = require("../../models/Post")
const Profile = require("../../models/Profile")


router.get("/tests", (req, res) => {
    res.json({ msg: "posts works" });
});

router.post("/", passport.authenticate("jwt", { session: false }), (req, res) => {

    const {errors, isValid} = validatePostInput(req.body)

    if(!isValid) {
        return res.status(400).json(errors)
    }

    const newPost = new Post({
        text: req.body.text,
        name: req.body.name,
        avatar: req.user.avatar,
        user: req.user.id
    })

    newPost.save().then(post => {res.json(post)})
})

router.get("/", (req, res) => {
    Post.find()
        .sort({date: -1})
        .then(posts => {
            res.json(posts)
        })
        .catch(err => res.status(404).json({onpostsfound: "No Posts found"}))
})

router.get("/:id", (req, res) => {
    Post.findById(req.params.id)
        .then(post => {
            res.json(post)
        })
        .catch(err => res.status(404).json({onpostfound: "No Post found with that id"}))
})

router.delete("/:id", passport.authenticate("jwt", {session: false}), (req, res) => {
    Post.findById(req.params.id)
        .then(post => {
            if (post) {

                if (post.user.toString() !== req.user.id) {
                    return res.status(401).json({Unauthorised: "FUCK YOU!!!"})
                }
                post.remove().then(() => res.json({success: true}))
            }
        })
        .catch(err => res.status(404).json({onpostfound: "No Post found"}))
            
})


router.delete("/madness/:id", (req, res) => {
    Post.findById(req.params.id)
        .then(post => {
            if (post) {
                post.remove().then(() => res.json({success: true}))
            }
        })
        .catch(err => res.status(404).json({madness: "overheated madness"}))
            
})

router.post("/like/:id", passport.authenticate("jwt", { session: false }), (req, res) => {
    Profile.findOne({user: req.user.id})
        .then(profile => {
            Post.findById(req.params.id)
                .then(post => {
                    if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
                        return res.status(400).json({alreadyliked: "User already liked this post"})
                    }

                    post.likes.unshift({user: req.user.id})

                    post.save().then(post => res.json(post))
                })
                .catch(err => res.status(404).json({postnotfound:"No post found"}))
        })
})

router.post("/unlike/:id", passport.authenticate("jwt", { session: false }), (req, res) => {
    Profile.findOne({user: req.user.id})
        .then(profile => {
            Post.findById(req.params.id)
                .then(post => {
                    if (post.likes.filter(unlike => unlike.user.toString() === req.user.id).length === 0) {
                        return res.status(400).json({notliked: "User hasn't liked this post yet"})
                    }

                    const removeIndex = post.likes
                        .map(item => item.user.toString())
                        .indexOf(req.user.id)
                    console.log(removeIndex)
                    post.likes.splice(removeIndex, 1)
                    post.save().then(post => res.json(post))
                })
                .catch(err => res.status(404).json({postnotfound:"No post found"}))
        })
})

module.exports = router;
