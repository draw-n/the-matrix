const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const UpdateSchema = new Schema({
    _id: {
        type: String,
        required: true,
    },

    type: {
        type: String,
        required: true,
        enum: ["issue", "general", "students", "other"],
    },
    issueEquipment: {
        name: { type: String },
        type: { type: String },
    },
    status: {
        type: String,
        enum: ["open", "in progress", "resolved"],
    },
    description: {
        type: String,
        required: true
    },
    createdBy: {
        type: ObjectId,
        required: true,
    },
    dateCreated: {
        type: Date,
        required: true,
    },
    lastUpdatedBy: {
        type: ObjectId,
        required: true,
    },
    dateLastUpdated: {
        type: Date,
        required: true,
    },
});

module.exports = Update = mongoose.model("update", UpdateSchema);
