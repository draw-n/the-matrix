const Announcement = require("../models/Announcement.js");
const mongoose = require('mongoose');

const createAnnouncement= async (req, res) => {
    const { type, description, createdBy, dateCreated } = req.body;

    try {
        if (type && description && createdBy && dateCreated) {
            let update = new Announcement({
                _id: new mongoose.Types.ObjectId(),
                type: type,
                status: "posted",
                description: description,
                createdBy: createdBy,
                dateCreated: dateCreated,
                lastUpdatedBy: createdBy,
                dateLastUpdated: dateCreated,
            });
            await update.save();
            return res.status(200).json(update);
        } else {
            return res
                .status(400)
                .send({ message: "Missing Announcement Information." });
        }
    } catch (err) {
        console.error(err.message);
        return res.status(500).send({ message: err.message });
    }
};

const deleteAnnouncement = async (req, res) => {
    const id = req.params.id;

    try {
        if (id) {
            Announcement.findByIdAndDelete(id)
                .then(function () {
                    return res
                        .status(200)
                        .json({ message: "Successfully deleted." });
                })
                .catch(function (error) {
                    return res.status(400).send({ message: error });
                });
        } else {
            return res.status(400).send({ message: "Missing Announcement ID" });
        }
    } catch (err) {
        console.log(err.message);
        return res.status(500).send({ message: err.message });
    }
};

const editAnnouncement = async (req, res) => {
    const id = req.params?.id;
    try {
        if (id) {
            const update = Announcement.findByIdAndUpdate(id, req.body)
                .then(function () {
                    console.log(update);
                    res.status(200).json(update);
                })
                .catch(function (error) {
                    console.log(error);
                    res.status(400).send({ message: error });
                });
        } else {
            res.status(400).send({ message: "MissingAnnouncement ID" });
        }
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
};

const getAnnouncement = async (req, res) => {
    const id = req.query?.id;
    if (id) {
        try {
            const announcement = await Announcement.findById(id);
            if (!announcement) {
                return res.status(404).send("Announcement not found");
            }
            return res.status(200).json(announcement);
        } catch (error) {
            console.error("Error fetching issue:", error);
            return res.status(500).send("Internal server error");
        }
    }

    try {
        const announcement = await Announcement.find();
        return res.status(200).json(announcement);
    } catch (err) {
        return res.status(500).send({ message: err.message });
    }
};

module.exports = {
    createAnnouncement,
    deleteAnnouncement,
    editAnnouncement,
    getAnnouncement,
};
