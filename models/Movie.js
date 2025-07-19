const mongoose = require('mongoose')

const movieSchema = new mongoose.Schema({
    title: { type: String, required: true },
    picture: { type: String },
    type: {
        type: String,
        enum: ["movie", "series"], 
        required: true
    },
    description : {type : String}
})

const Movie = mongoose.model('Movie', movieSchema)
module.exports = Movie