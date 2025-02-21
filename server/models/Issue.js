const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const IssueSchema = new Schema({
    _id: {
        type: ObjectId,
        required: true,
    },
    equipment: {
        type: ObjectId,
        required: true,
    },
    status: {
        type: String,
        enum: ["open", "in-progress", "completed", "archived"],
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    createdBy: {
        type: String,
        required: true,
    },
    dateCreated: {
        type: Date,
        required: true,
    },
    assignedTo: {
        type: String,
    },
});

module.exports = Issue = mongoose.model("issue", IssueSchema);
