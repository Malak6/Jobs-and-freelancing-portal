const mongoose = require('mongoose');
const Joi = require('joi');

// add created at ??

const experienceSchema = mongoose.Schema({
    jobTitle  :  {type : String ,required: true } ,
    company   :  {type : String ,required: true } ,
    startDate :  {type :Date , required: true} , 
    endDate   :  {type :Date , required: true} , 
});

const userSchema = mongoose.Schema({
    userName    : {type : String , required: true , unique : true} ,
    password    : {type : String ,required: true } ,
    firstName   : {type : String , required: true} ,
    secondName  : {type : String , required: true} ,
    birthDate   : {type :Date , required: true} , 
    Address     : {type : String , required: true} ,
    email       : {type : String , required: true , unique : true} ,
    experience  : [experienceSchema] ,
});

module.exports.User = mongoose.model('User', userSchema);
module.exports.registerValidation = function registerValidation(req){
    const schema = new Joi.object({
        userName    : Joi.string().required() ,
        password    : Joi.string().required(),
        firstName   : Joi.string().required(),
        secondName  : Joi.string().required(),
        birthDate   : Joi.date().required() ,
        Address     : Joi.string().required()  ,
        email       : Joi.string().email().required(),
        experience  : Joi.array()
    });
    return schema.validate(req);
}
module.exports.loginValidation = function loginValidation(req){
    const schema = new Joi.object({
        email       : Joi.string().email().required(),
        password    : Joi.string().required(),
    });
    return schema.validate(req);
}
