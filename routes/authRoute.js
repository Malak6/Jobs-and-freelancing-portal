const express = require('express');
const router = express.Router();
router.use(express.json());
const authController = require('../controllers/authController');

router.post('/sendcode' , (req , res) => {authController.sendCode(req,res)});
router.post('/checkcode' , (req , res) => {authController.checkCode(req,res)});
router.post('/register' , (req , res) => {authController.userRegister(req,res)});
router.post('/login' , (req , res) => {authController.login(req,res)});

module.exports.router = router;





