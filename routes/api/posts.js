const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const validatePostInput = require('../../validation/post');

const User = require('../../models/User');
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');

router.get('/tests', (req, res) => {
    res.json({ msg: 'posts works' });
});

router.post(
    '/',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        const { errors, isValid } = validatePostInput(req.body);

        if (!isValid) {
            return res.status(400).json(errors);
        }

        const newPost = new Post({
            text: req.body.text,
            name: req.body.name,
            avatar: req.user.avatar,
            user: req.user.id
        });

        newPost.save().then(post => {
            res.json(post);
        });
    }
);

router.get('/', (req, res) => {
    Post.find()
        .sort({ date: -1 })
        .then(posts => {
            res.json(posts);
        })
        .catch(err => res.status(404).json({ onpostsfound: 'No Posts found' }));
});

router.get('/:id', (req, res) => {
    Post.findById(req.params.id)
        .then(post => {
            res.json(post);
        })
        .catch(err =>
            res.status(404).json({ onpostfound: 'No Post found with that id' })
        );
});

router.delete(
    '/:id',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        Post.findById(req.params.id)
            .then(post => {
                if (post) {
                    if (post.user.toString() !== req.user.id) {
                        return res
                            .status(401)
                            .json({ Unauthorised: 'FUCK YOU!!!' });
                    }
                    post.remove().then(() => res.json({ success: true }));
                }
            })
            .catch(err =>
                res.status(404).json({ onpostfound: 'No Post found' })
            );
    }
);

router.delete('/madness/:id', (req, res) => {
    Post.findById(req.params.id)
        .then(post => {
            if (post) {
                post.remove().then(() => res.json({ success: true }));
            }
        })
        .catch(err => res.status(404).json({ madness: 'overheated madness' }));
});

router.post(
    '/like/:id',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        Post.findById(req.params.id)
            .then(post => {
                if (post) {
                    const liked =
                        post.likes.filter(
                            like => like.user.toString() === req.user.id
                        ).length !== 0;
                    const unliked =
                        post.unlikes.filter(
                            unlike => unlike.user.toString() === req.user.id
                        ).length !== 0;

                    // console.log("liked: " + liked + ", unliked: " + unliked)

                    if (!liked && !unliked) {
                        post.likes.unshift({ user: req.user.id });
                        post.save().then(post => res.json(post));
                    } else if (!liked && unliked) {
                        res.json({
                            alreadyunliked: 'User already unliked this post'
                        });
                    } else if (liked && !unliked) {
                        const removeIndex = post.likes
                            .map(item => item.user.toString())
                            .indexOf(req.user.id);
                        // console.log(removeIndex)
                        post.likes.splice(removeIndex, 1);

                        post.save().then(post => res.json(post));
                    } else {
                        res.json({ failed: 'Cannot accept the request' });
                    }
                } else {
                    console.log('not valid post');
                }
            })
            .catch(err => {
                // console.log(err)
                res.status(404).json({
                    error: err.toString(),
                    postnotfound: 'No post found'
                });
            });
    }
);

router.post(
    '/unlike/:id',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        Post.findById(req.params.id)
            .then(post => {
                if (post) {
                    const liked =
                        post.likes.filter(
                            like => like.user.toString() === req.user.id
                        ).length !== 0;
                    const unliked =
                        post.unlikes.filter(
                            unlike => unlike.user.toString() === req.user.id
                        ).length !== 0;

                    // console.log("liked: " + liked + ", unliked: " + unLiked)

                    if (!liked && !unliked) {
                        post.unlikes.unshift({ user: req.user.id });
                        post.save().then(post => res.json(post));
                    } else if (!liked && unliked) {
                        const removeIndex = post.unlikes
                            .map(item => item.user.toString())
                            .indexOf(req.user.id);
                        // console.log(removeIndex)
                        post.unlikes.splice(removeIndex, 1);

                        post.save().then(post => res.json(post));
                    } else if (liked && !unliked) {
                        res.json({
                            alreadyliked: 'User alreadyliked this post'
                        });
                    } else {
                        res.json({ failed: 'Cannot accept the request' });
                    }
                } else {
                    console.log('not valid post');
                }
            })
            .catch(err =>
                res
                    .status(404)
                    .json({
                        err: err.toString(),
                        postnotfound: 'No post found'
                    })
            );
    }
);

router.post(
    '/comment/:id',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        const { errors, isValid } = validatePostInput(req.body);

        if (!isValid) {
            return res.status(400).json(errors);
        }

        Post.findById(req.params.id)
            .then(post => {
                const newComment = {
                    text: req.body.text,
                    name: req.body.name,
                    avatar: req.user.avatar,
                    user: req.user.id
                };
                post.comment.unshift(newComment);
                post.save().then(post => res.json(post));
            })
            .catch(err =>
                res.status(404).json({ postnotfound: 'No Post found' })
            );
    }
);

router.delete(
    '/comment/:id/:comment_id',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        Post.findById(req.params.id)
            .then(post => {
                if (post) {
                    if (
                        post.comment.filter(
                            comment =>
                                comment._id.toString() === req.params.comment_id
                        ).length === 0
                    ) {
                        return res.json({
                            commentdoesnotexist: "Comment doesn't exist"
                        });
                    }

                    const removeIndex = post.comment
                        .map(item => item._id.toString())
                        .indexOf(req.params.comment_id);

                    post.comment.splice(removeIndex, 1);

                    post.save().then(post => res.json(post));
                }
            })
            .catch(err =>
                res.status(404).json({ onpostfound: 'No Post found' })
            );
    }
);

module.exports = router;
