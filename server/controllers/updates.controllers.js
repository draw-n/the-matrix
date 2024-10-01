const Update = require("../models/Update.js");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

const createUpdate = async (req, res) => {
    try {
    } catch (err) {
        console.error(err.message);
        return res.status(500).send({ message: err.message });
    }
};
