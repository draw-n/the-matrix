const Material = require("../models/Material.js");
var mongoose = require("mongoose");
const { ObjectId } = mongoose.Types; // Import ObjectId

const createMaterial = async (req, res) => {
    const {
        name,
        shortName,
        type,
        properties,
        description,
        remotePrintAvailable,
    } = req.body;

    try {
        if (
            name &&
            shortName &&
            type &&
            properties &&
            description &&
            remotePrintAvailable
        ) {
            let material = new Material({
                _id: new mongoose.Types.ObjectId(),

                name,
                shortName,
                type,
                description,
                properties,
                remotePrintAvailable,
            });
            await material.save();
            return res.status(200).json(material);
        } else {
            return res
                .status(400)
                .send({ message: "Missing Material Information." });
        }
    } catch (err) {
        console.error(err.message);
        return res.status(500).send({ message: err.message });
    }
};

const deleteMaterial = async (req, res) => {
    const id = req.params.id;

    try {
        if (id) {
            Material.findByIdAndDelete(id)
                .then(function () {
                    return res
                        .status(200)
                        .json({ message: "Successfully deleted." });
                })
                .catch(function (error) {
                    return res.status(400).send({ message: error });
                });
        } else {
            return res.status(400).send({ message: "Missing Material ID" });
        }
    } catch (err) {
        console.log(err.message);
        return res.status(500).send({ message: err.message });
    }
};

const editMaterial = async (req, res) => {
    const id = req.params?.id;
    const {
        name,
        shortName,
        type,
        properties,
        description,
        remotePrintAvailable,
    } = req.body;

    // Prepare update object
    const updateData = {};

    // Populate update object with fields to update
    if (name) updateData.name = name;
    if (routePath) updateData.routePath = routePath;
    if (type) updateData.type = type;
    if (description) updateData.description = description;
    if (remotePrintAvailable)
        updateData.remotePrintAvailable = remotePrintAvailable;
    // Push new issues if provided
    if (properties && properties.length) {
        updateData.$addToSet = { properties: { $each: properties } }; // Use $addToSet to avoid duplicates
    }

    try {
        if (id) {
            const updatedMaterial = await Material.findByIdAndUpdate(
                id,
                updateData,
                { new: true, runValidators: true }
            );

            if (!updatedMaterial) {
                return res.status(404).json({ message: "Material not found" });
            }

            return res.status(200).json(updatedMaterial);
        } else {
            return res.status(400).send({ message: "Missing Material ID" });
        }
    } catch (err) {
        console.log(err.message);
        return res.status(500).send({ message: err.message });
    }
};

const getMaterial = async (req, res) => {
    const id = req.query?.id;
    if (id) {
        try {
            const material = await Material.findById(id);
            if (!material) {
                return res.status(404).send("Material not found");
            }
            return res.status(200).json(material);
        } catch (error) {
            console.error("Error fetching issue:", error);
            return res.status(500).send("Internal server error");
        }
    }

    try {
        const material = await Material.find();
        return res.status(200).json(material);
    } catch (err) {
        return res.status(500).send({ message: err.message });
    }
};

module.exports = {
    createMaterial,
    deleteMaterial,
    editMaterial,
    getMaterial,
};
