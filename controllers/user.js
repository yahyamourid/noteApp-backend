const express = require('express')
const router = express.Router()
const { User, validateSignUP, validateSignIn, validatepwd } = require('../models/user')
const bcrypt = require('bcrypt')
const jwt =require('jsonwebtoken')

//registraction
router.post('/', async (req, res) => {
    try {
        const validateData = validateSignUP(req.body)
        if (validateData.error)
            return res.status(400).json({ "message": validateData.error.details[0].message })
        const user = await User.findOne({ email: req.body.email })
        if (user)
            return res.status(409).json({ "message": "user's email is already exist" })
        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashPassword = await bcrypt.hash(req.body.password, salt);

        await new User({ ...req.body, password: hashPassword }).save();
        res.status(201).send({ message: "User created successfully" });

    } catch (error) {
        res.status(501).json({ "message": error.message })
    }
})

//Authentification
router.post('/auth', async (req, res) => {
    try {
        const validateData = validateSignIn(req.body)
        if (validateData.error)
            return res.status(400).json({ "message": validateData.error.details[0] })

        const user = await User.findOne({ email: req.body.email })
        if (!user)
            return res.status(401).json({ "message": "Invalid email or password" })

        const validpwd = await bcrypt.compare(
            req.body.password,
            user.password
        )
        
        if (!validpwd)
            return res.status(401).json({ "message": "Invalid email or password" })
        const token = user.generateToken()
        res.status(201).json({ "token": token, "id":user._id, "message": "logged in successfully" })

    } catch (error) {
        res.status(501).json({ "message": error.message })
    }
})

//Get all users
router.get('/', async(req,res) => {
    try {
        const users = await User.find()
        res.status(201).json(users)
        
    } catch (error) {
        res.status(501).json({ "message": error.message })
    }
})

//Get user by id
router.get('/:id', getUser, (req,res) => {
    res.status(201).json(res.user)
})

//Update user (first-name last-name email)
router.put('/:id', getUser, async (req, res) => {
    try {
       res.user.firstName = req.body.firstName
       res.user.lastName = req.body.lastName
       const updatedUser = await res.user.save()
       res.status(201).json(updatedUser)
    } catch (error) {
        res.status(501).json({ "message": error.message })
    }
})

//Update user's password
router.put('/pwd/:id', getUser, async(req, res) => {
    try {
        const validpwd = await bcrypt.compare(
            req.body.password,
            res.user.password
        )
        if(!validpwd)
           return  res.status(404).json({"message":"wrong password"})
        const validNewpwd = validatepwd({newPassword: req.body.newPassword})
        if(validNewpwd.error)
            return res.status(401).json( {"message": validNewpwd.error.details[0].message})

            const salt = await bcrypt.genSalt(Number(process.env.SALT));
            const hashPassword = await bcrypt.hash(req.body.newPassword, salt);
            res.user.password = hashPassword
            const updatedUser =await res.user.save()
            res.status(201).json(updatedUser)
    } catch (error) {
        res.status(501).json({ "message": error.message })
    }
})

//Delete User
router.delete('/', async(req,res) =>{
    try {
        
       
       
		const token = req.header("Authorization").replace("Bearer ", "");
const decodeToken = jwt.verify(token, process.env.TOKENKEY);
 const idUser = decodeToken.id
        const user = await User.findById(idUser)
        if(!user)
            return res.status(404).json({"message":"user does not exist"})
        await User.deleteOne(user)
        res.status(201).json({"message": "User deleted successfully"})
        
    } catch (error) {
        res.status(501).json({ "message": error.message })
    }
})

//Get user
async function getUser(req, res, next){
    let user
    try {
        user = await User.findById(req.params.id)
        if(!user)
            return res.status(404).json({"message":"user does not exist"})

    } catch (error) {
        res.status(501).json({ "message": error.message }) 
    }
    res.user = user
    next()
}
module.exports = router
