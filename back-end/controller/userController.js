const prisma = require('../index');
const bcrypt = require("bcrypt");
const {body,validationResult} = require("express-validator");
const userControllerHelper = require("./userControllerHelper");
const axios = require("axios");
const path = require("path");
const fs = require("fs");

const lengthErr1 = "length must be more than 8 characters";
const lengthErr2 = "length must be more than 4 characters and less than 10 characters";

const validateUser = [
    body("password").trim()
    .isLength({min:8}).withMessage(`Password ${lengthErr1}`)
    .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])/)
    .withMessage("Password must contain at least one letter, one number, and one special character")
    .escape(),

    body("confirmPassword").trim()
    .custom((value,{req}) =>{
        if(value !== req.body.password){
            throw new Error("Passwords do not match");
        }
        return true;
    }).escape(),

    body("userName").trim().toLowerCase()
    .isLength({min:4,max:10}).withMessage(`User name ${lengthErr2}`)
    .custom(async (value)=>{ //value is the same as req.body.userName
        const user = await userControllerHelper.getUser(value);
        if(user){
            throw new Error("User already exists");
        }
    }).escape(),

];

exports.postAddUser = [
    validateUser,
    async (req,res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.render('test',{
                errors:errors.array(),//For showing the error input by the user
                old:req.body// It puts the previous user inputs after the page get reloaded for better UX
            })
        }
        const {userName,userEmail,password} = req.body;
        const hashedPassword = await bcrypt.hash(password,10);
        try{
            await prisma.user.create({
                data:{
                    username:userName,
                    email:userEmail.toLowerCase(),
                    passwordHash:hashedPassword
                }
            })

            //Changes to be made on the logic for putting new users into prisma db
            console.log(`User name ${userName} has been successfully created`);
            res.render('login',{error:errors.array()});
        }catch (error) {
            res.status(500).json({error: error.message})
        }
    
        const findAllUsers = await prisma.user.findMany();
        console.log(`All users are here men`, findAllUsers);
    }
]