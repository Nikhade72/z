const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    userId: {
        type: String,
    },
    Name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    bookedMovies: [
        {
            movieName: String,
        },
    ],
    password: {
        type: String,
        required: true,
        minLength: 6,
    },
    
});

const userModel = mongoose.model("user", userSchema);
module.exports = userModel;