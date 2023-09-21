const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const joi = require('joi')
const passwordcomplexity = require('joi-password-complexity')

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
})

userSchema.methods.generateToken = function() {
    const token = jwt.sign({ id: this._id }, process.env.TOKENKEY, { expiresIn: '7d' });
    return token;
  };
  

const User = mongoose.model("user", userSchema)

const validateSignUP = (data) => {
    const schema = joi.object({
        firstName: joi.string().required().label("FirstName"),
        lastName: joi.string().required().label("LasttName"),
        email: joi.string().required().email().label("Email"),
        password: passwordcomplexity().required().label("Password")
    })
    return schema.validate(data)
}

const validateSignIn = (data) => {
    const schema = joi.object({
        email: joi.string().email().required().label("Email"),
        password: joi.string().required().label("password")
    }
    )
    return schema.validate(data)
}

const validatepwd = (data) => {
    const schema = joi.object({
        newPassword: passwordcomplexity().required().label("Password")
    })
    return schema.validate(data)
}

module.exports = { User, validateSignUP, validateSignIn, validatepwd }