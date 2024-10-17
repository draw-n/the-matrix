const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const EquipmentSchema = new Schema({
    _id: {
        type: ObjectId,
        required: true,
    },
    name: { type: String, required: true },
    type: {
        type: String,
        required: true,
        enum: [
            "filament",
            "resin",
            "powder",
            "subtractive",
            "computer",
            "wiring",
            "other",
        ],
    },
    status: {
        type: String,
        enum: ["working", "jammed", "fixing", "updating"],
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    issues: {
        type: [{ type: ObjectId }],
    },
    imageSrc: {
        type: String,
    },
});

module.exports = Equipment = mongoose.model("equipment", EquipmentSchema);
