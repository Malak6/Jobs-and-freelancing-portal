const {User , registerValidation , loginValidation} = require('../models/user');
const {EmailVerification , sendCodeVerification ,checkCodeVerification} = require('../models/emailVerification');

const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

module.exports.userRegister = async function register(req , res){
    // validate the request 
    const {error} = registerValidation(req.body);

    if (error) return res.status(400).send(error);
    // check if the user is registered before

    // check if the email was verified

    const checkUser =await User.findOne({email : req.body.email});
    // status code
    if(checkUser) return res.status(400).send("You are already registered");


    const emailRecord = await EmailVerification.findOne({email : req.body.email});

    if (!emailRecord){
        return res.status(400).send("We do not send you a code");
    }

    if(emailRecord.isVerified === false){
        return res.status(400).send("You did not verified your email");
    }

    // genreted the crypted password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password,salt);

    let exper =null ;

    if(req.body.experience) {
        exper=req.body.experience;
    }
    
    const user = new User ({
        userName    : req.body.userName ,
        password    : hashedPassword,
        firstName   : req.body.firstName,
        secondName  : req.body.secondName,
        birthDate   : req.body.birthDate ,
        Address     : req.body.Address  ,
        email       : req.body.email  ,
        experience  : exper,
    });
    const result =await user.save();
    await EmailVerification.findByIdAndDelete(emailRecord._id);
    return res.status(200).send(result);
}
module.exports.sendCode = async function sendCode(req,res){
     // validate the request 
    const {error} = sendCodeVerification(req.body);
     // bad request status code ??
    if (error) return res.status(400).send(error);

    const old = await EmailVerification.findOne({email : req.body.email});
    console.log(old);
    if (old) return res.status(400).send("You already have a code.");
    
    // create random number
    const code = Math.floor(Math.random() * (9999 - 1000) + 1000);

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "malakayman4433@gmail.com",
            pass: "mhkjrgtlirnbwgjm"
        }
      });
      
      let message = {
        from: "malakayman4433@gmail.com",
        to: req.body.email,
        subject: "Test Mail Using Node Js",
        html: "<h1>Hi, blablalblalnal I am<h1>" +code+ "<h1>from Online Web Tutor</h1>"
      }
      
      transporter.sendMail(message, async function(err, info) {
        if (err) {
            console.log(err);
        } else {
            const record = new EmailVerification({
                email       :  req.body.email ,
                code        :  code ,
                isVerified  :  false , 
            });
            const result = await record.save();
            return res.status(200).send(result);
        }
      });
} 

module.exports.checkCode = async function checkCode(req,res){
     // validate the request 
     const {error} = checkCodeVerification(req.body);
     // bad request status code ??
    if (error) return res.status(400).send(error);

    let emailRecord = await EmailVerification.findOne({email : req.body.email});
    if (!emailRecord.code === req.body.code){
        return res.status(400).send("error");
    }
    emailRecord.isVerified = true;
    const result =await emailRecord.save();
    return res.status(200).send(result);
}

module.exports.login = async function login(req,res){
    const {error} = loginValidation(req.body);
    if (error) return res.status(400).send(error);

    const user =await User.findOne({email : req.body.email});
    // status code
    if(!user) return res.status(400).send("You are not registered");

    const isValid = await bcrypt.compare(req.body.password, user.password);
    if(! isValid) return res.status(404).send("wrong password");

    const token = jwt.sign({_id :  user._id}, "myPrivateKey");

    return res.status(200).send(token);

}