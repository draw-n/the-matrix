const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const UpdateSchema = new Schema({
    _id: {
        type: ObjectId,
        required: true,
    },
    type: {
        type: String,
        required: true,
        enum: ["issue", "event", "classes", "other"],
    },
    status: {
        type: String,
        enum: ["posted", "archived"],
    },
    description: {
        type: String,
        required: true
    },
    createdBy: {
        type: String,
        required: true,
    },
    dateCreated: {
        type: Date,
        required: true,
    },
    lastUpdatedBy: {
        type: String,
        required: true,
    },
    dateLastUpdated: {
        type: Date,
        required: true,
    },
});

module.exports = Update = mongoose.model("update", UpdateSchema);
