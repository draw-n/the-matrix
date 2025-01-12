const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const MaterialSchema = new Schema({
    _id: {
        type: ObjectId,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    shortName: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    properties: {
        type: [{ type: String }],
    },
    description: {
        type: String,
    },
    remotePrintAvailable: {
        type: Boolean,
        required: true,
    },
    //image: {
    //TODO: revisit adding an image feature to mongodb
    //}
});

module.exports = Material = mongoose.model("material", MaterialSchema);
