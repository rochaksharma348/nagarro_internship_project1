const express = require('express');
const passport = require('passport');
const User = require('../models/user');
const router = express.Router();
const flash = require('connect-flash');

router.get('/register', (req, res) => {
    res.render('auth/signup', {success: req.flash('success'), error : req.flash('error')});
});

//routes to register
router.post('/register', async(req, res) => {
    try{
        // console.log(req.body);
        const user = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            username: req.body.username
        }
        const newUser = await User.register(user, req.body.password);
        req.flash("success","Registered Successfully,Please Login to continue")
        res.redirect('/login');
    } catch(err) {
        req.flash('error', err.message);
        res.redirect('/register');
    }
});

//login route
router.get('/login', (req, res) => {
    res.render('auth/login', {success: req.flash('success'),error : req.flash('error')});
});

//actually verifying the user to be logged in
router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash:true
}), (req, res) => {
    res.redirect('/');
});

//logout 
router.get('/logout', (req, res) => {
    req.logout(()=> {
        res.redirect('/login');
    })
})


module.exports = router;