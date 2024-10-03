const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
    _id: {
        type: String, //id will come from Google access token result
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    access: {
        type: String,
        require: true,
        enum: ["view", "edit", "admin"],
    }
});

module.exports = User = mongoose.model("user", UserSchema);
