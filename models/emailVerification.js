const mongoose = require('mongoose');
const Joi = require('joi');

// add created at ??

const emailVerificationSchema = mongoose.Schema({
    email       :  {type : String ,required: true , unique : true} ,
    code        :  {type : Number ,required: true } ,
    isVerified  :  {type :Boolean , required: true} , 
});

module.exports.EmailVerification = mongoose.model('EmailVerification', emailVerificationSchema);

module.exports.sendCodeVerification = function sendCodeVerification(req){
    const schema = new Joi.object({
        email       : Joi.string().email().required(),
    });
    return schema.validate(req);
}
module.exports.checkCodeVerification = function checkCodeVerification(req){
    const schema = new Joi.object({
        email  : Joi.string().email().required(),
        code   : Joi.number().required()
        });
    return schema.validate(req);
}

