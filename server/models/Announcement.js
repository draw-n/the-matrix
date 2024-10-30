const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const AnnouncementSchema = new Schema({
    _id: {
        type: ObjectId,
        required: true,
    },
    title: {
        type: String,
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
    lastUpdatedBy: {
        type: String,
        required: true,
    },
    dateLastUpdated: {
        type: Date,
        required: true,
    },
});

module.exports = Announcement = mongoose.model(
    "announcement",
    AnnouncementSchema
);
