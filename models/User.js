const mongoose = require('mongoose')
const Movie = require("./Movie")

const userSchema = new mongoose.Schema(
  {
    first: { type: String, required: true },
    last: { type: String, required: true },
    email: { type: String, required: true , unique: true},
    password: { type: String, required: true },
    picture: { type: String },
    watched: [{type: mongoose.Schema.Types.ObjectId, ref: 'Movie'}],
    watching: [{type: mongoose.Schema.Types.ObjectId, ref: 'Movie'}],
    willWatch: [{type: mongoose.Schema.Types.ObjectId, ref: 'Movie'}]
    
  },
  { timestamps: true }
)


const User = mongoose.model('User', userSchema)
module.exports = User