const Equipment = require("../models/Equipment.js");
var mongoose = require("mongoose");

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
    try {
        if (id) {
            const equipment = Equipment.findByIdAndUpdate(id, req.body)
                .then(function () {
                    console.log(equipment);
                    res.status(200).json(equipment);
                })
                .catch(function (error) {
                    console.log(error);
                    res.status(400).send({ message: error });
                });
        } else {
            res.status(400).send({ message: "Missing Equipment ID" });
        }
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
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
