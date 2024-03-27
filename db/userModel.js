const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Please provide an Email"],
        unique: [true, "Email already exist"]
    },

    password: {
        type: String,
        required: [true, "Please provide a Password"],
        unique: false
    }
});

// Create a collection named "users" if it doesn't already exist
module.exports = mongoose.model.Users || mongoose.model("Users", UserSchema);