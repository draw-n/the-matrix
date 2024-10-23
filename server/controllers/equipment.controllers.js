const Equipment = require("../models/Equipment.js");
var mongoose = require("mongoose");
const { ObjectId } = mongoose.Types; // Import ObjectId

const createEquipment = async (req, res) => {
    const { name, type, description } = req.body;

    try {
        if (name && type && description) {
            let equipment = new Equipment({
                _id: new mongoose.Types.ObjectId(),
                name: name,
                type: type,
                description: description,
                status: "working",
            });
            console.log(equipment);
            await equipment.save();
            return res.status(200).json(equipment);
        } else {
            return res
                .status(400)
                .send({ message: "Missing Equipment Information." });
        }
    } catch (err) {
        console.error(err.message);
        return res.status(500).send({ message: err.message });
    }
};

const deleteEquipment = async (req, res) => {
    const id = req.params.id;

    try {
        if (id) {
            Equipment.findByIdAndDelete(id)
                .then(function () {
                    return res
                        .status(200)
                        .json({ message: "Successfully deleted." });
                })
                .catch(function (error) {
                    return res.status(400).send({ message: error });
                });
        } else {
            return res.status(400).send({ message: "Missing Equipment ID" });
        }
    } catch (err) {
        console.log(err.message);
        return res.status(500).send({ message: err.message });
    }
};

const editEquipment = async (req, res) => {
    const id = req.params?.id;
    const {
        name,
        routePath,
        type,
        properties,
        status,
        description,
        imageSrc,
        issues,
    } = req.body;

    // Prepare update object
    const updateData = {};

    // Populate update object with fields to update
    if (name) updateData.name = name;
    if (routePath) updateData.routePath = routePath;
    if (type) updateData.type = type;
    if (properties) updateData.properties = properties;
    if (status) updateData.status = status;
    if (description) updateData.description = description;
    if (imageSrc) updateData.imageSrc = imageSrc;

    // Push new issues if provided
    if (issues && issues.length) {
        updateData.$addToSet = { issues: { $each: issues } }; // Use $addToSet to avoid duplicates
    }

    try {
        if (id) {
            const updatedEquipment = await Equipment.findByIdAndUpdate(
                id,
                updateData,
                { new: true, runValidators: true }
            );

            if (!updatedEquipment) {
                return res.status(404).json({ message: "Equipment not found" });
            }

            return res.status(200).json(updatedEquipment);
        } else {
            return res.status(400).send({ message: "Missing Equipment ID" });
        }
    } catch (err) {
        console.log(err.message);
        return res.status(500).send({ message: err.message });
    }
};

const getEquipment = async (req, res) => {
    const id = req.query?.id;
    if (id) {
        try {
            const equipment = await Equipment.findById(id);
            if (!equipment) {
                return res.status(404).send("Equipment not found");
            }
            return res.status(200).json(equipment);
        } catch (error) {
            console.error("Error fetching issue:", error);
            return res.status(500).send("Internal server error");
        }
    }

    try {
        const equipment = await Equipment.find();
        return res.status(200).json(equipment);
    } catch (err) {
        return res.status(500).send({ message: err.message });
    }
};

module.exports = {
    createEquipment,
    deleteEquipment,
    editEquipment,
    getEquipment,
};
