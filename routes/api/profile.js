const express = require('express');
const router = express.Router();
const User = require('../../models/user');
const Post = require('../../models/post');
const isLoggedIn = require('../../middleware');

// personal profile
router.get('/profile', isLoggedIn, (req, res) => {

    const payload = {
        user : req.user,
        displayName : req.user.firstName + " " + req.user.lastName,
    }

    res.render('profile', {payload});
})

// other person's profile
router.get('/profile/:username', isLoggedIn, async (req, res) => {
    const otherUser = await User.findOne({username : req.params.username});

    const payload = {
        user : otherUser,
        displayName : otherUser.firstName + " " + otherUser.lastName,
    }

    res.render('profile', {payload});
});

// replies 
router.get ('/profile/:username/replies', isLoggedIn, async (req, res) => {
    const otherUser = await User.findOne({username : req.params.username});

    const payload = {
        user : otherUser,
        displayName : otherUser.firstName + " " + otherUser.lastName,
        onlyReplies : true
    }

    res.render('profile', {payload});
})

module.exports = router;