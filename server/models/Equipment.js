const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const EquipmentSchema = new Schema({
    _id: {
        type: ObjectId,
        required: true,
    },
    name: { type: String, required: true },
    routePath: { type: String, required: true },
    headline: { type: String },
    category: {
        type: ObjectId,
        required: true,
        ref: "Category"
    },
    properties: {
        nozzle: { type: Number },
        materials: [{ type: String }],
    },
    status: {
        type: String,
        enum: ["available", "paused", "busy", "error", "offline"],
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
});

module.exports = Equipment = mongoose.model("equipment", EquipmentSchema);
