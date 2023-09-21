const mongoose = require('mongoose')
const joi = require('joi')

const noteSchema = new mongoose.Schema({
    title: {
        type:String,
        required:true
    },
    content: {
        type:String,
        required:true
    },
    idUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:true
    },
    
},{
    timestamps: true, // Cette option active les champs createdAt et updatedAt
  });

const Note = mongoose.model('note',noteSchema)
module.exports = Note