const express = require('express');
const passport = require('passport');
const router = express.Router();
const userController = require('../controller/userController');
const {ensureAuthenticated} = require('../middleware/ensureAuthenticated');


router.get('/',(req,res) =>{
    res.render('test');
});

router.post('/createAccount', userController.postAddUser);

router.get('/login',(req,res) => {
    res.render('login');
});

router.post('/login', 
                     passport.authenticate('local',{
                        successRedirect:'/success',
                        failureRedirect:'/login',
                        failureFlash:"Wrong user name or password"
                    }),                  
);

router.get('/success',(req,res) => {
    res.render('success');
})

module.exports = router;