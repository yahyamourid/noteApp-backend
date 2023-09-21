const expres = require('express')
const router = expres.Router()
const Note = require('../models/note')
const mongoose = require('mongoose')

//Get all notes
router.get('/', async(req, res) => {
    
        res.status(201).json(res.note)
    
})

//Get note by id
router.get('/:id',getNote, (req, res) => {
    try {
        const note = res.note
        res.status(201).json(note)
        
    } catch (error) {
        res.status(501).json({ "message": error.message })
    }
})
//Get notes by userId
router.get('/user/:id', async(req, res) => {
    try {
        const objectId = new mongoose.Types.ObjectId(req.params.id)
        const notes = await Note.find({ idUser: objectId });
        if (!notes) {
            return res.status(404).json({ "message": "Note not found" });
        }
        res.status(200).json(notes); // Utilisez toObject() pour extraire les données de l'objet Mongoose
    } catch (error) {
        res.status(501).json({ "message": error.message });
    }
})

//Add notes
router.post('/' , async(req,res) => {
    try {
        const id = new mongoose.Types.ObjectId(req.body.idUser)
        const note = new Note({
            title: req.body.title,
            content: req.body.content,
            idUser: id
        })
        const newNote = await note.save()
        res.status(201).json(newNote)
    } catch (error) {
        res.status(501).json({ "message": error.message })
    }
})

//update note
router.put('/:id', getNote, async(req,res) => {
    res.note.title = req.body.title
    res.note.content = req.body.content
    try {
        const updatedNote = await res.note.save()
        res.status(201).json(updatedNote)
    } catch (error) {
        res.status(501).json({ "message": error.message })
    }
})

//Delete note
router.delete('/:id',getNote, async(req,res) => {
    try {
        await res.note.deleteOne()
        res.status(201).json({"message" : "note removed successfully"})
    } catch (error) {
        res.status(501).json({ "message": error.message })
    }
})

//Get note function
async function getNote (req, res, next) {
    let note
    try {
        note = await Note.findById(req.params.id)
    if(!note)
       return res.status(404).json({"message":"note does not exist"})
    } catch (error) {
        res.status(501).json({"message":error.message})
    }
    res.note = note
    next()
    
}

module.exports = router