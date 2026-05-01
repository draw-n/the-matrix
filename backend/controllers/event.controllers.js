const Event = require("../models/Event.js");
const mongoose = require("mongoose");
const crypto = require("crypto");

/**
 * Creates new event and saves to MongoDB.
 * @param {*} req - event details
 * @param {*} res - response details
 * @returns - response details (with status)
 */
const createEvent = async (req, res) => {
    const {
        type,
        description,
        isRecurring,
        date,
        dayOfWeek,
        startTime,
        endTime,
        announcementId,
        createdBy,
        status,
        dateCreated,
        title,
    } = req.body;
    const file = req.file;
    try {
        if (type && createdBy && dateCreated && title && status && startTime && endTime) {
            let event = new Event({
                _id: new mongoose.Types.ObjectId(),
                uuid: crypto.randomUUID(),
                type,
                announcementId: announcementId || null,
                status,
                title,
                date: date || null,
                dayOfWeek: dayOfWeek || null,
                isRecurring: isRecurring !== undefined ? isRecurring : true,
                description,
                endTime,
                startTime,
                createdBy,
                dateCreated,
                lastUpdatedBy: createdBy,
                dateLastUpdated: dateCreated,
            });

            await event.save();

            const eventObj = event.toObject();

            delete eventObj._id;

            return res.status(200).json(eventObj);
        } else {
            return res
                .status(400)
                .send({ message: "Missing at least one required field." });
        }
    } catch (err) {
        console.error(err.message);
        return res.status(500).send({
            message: "Error when creating new event.",
            error: err.message,
        });
    }
};

/**
 * Deletes an event from MongoDB
 * @param {*} req - event details
 * @param {*} res - response details
 * @returns - response details (with status)
 */
const deleteEventById = async (req, res) => {
    const uuid = req.params?.uuid;

    try {
        if (uuid) {
            const event = await Event.findOneAndDelete(
                { uuid },
                { projection: { _id: 0 } },
            );
            if (!event) {
                return res.status(404).send({ message: "Event not found." });
            }

            return res
                .status(200)
                .send({ message: "Successfully deleted event." });
        } else {
            return res.status(400).send({ message: "Missing Event UUID." });
        }
    } catch (err) {
        console.error(err.message);
        return res.status(500).send({
            message: "Error when deleting event.",
            error: err.message,
        });
    }
};

/**
 * Updates an event from MongoDB
 * @param {*} req - request details
 * @param {*} res - response details
 * @returns - response details (with status)
 */
const editEventById = async (req, res) => {
    const uuid = req.params?.uuid;
    const file = req.file;
    try {
        if (uuid) {
            const event = await Event.findOneAndUpdate(
                { uuid },
                { ...req.body, imageName: file ? file.filename : null },
                { new: true, projection: { _id: 0 } },
            );

            if (!event) {
                return res.status(404).send({ message: "Event not found." });
            }

            return res.status(200).json(event);
        } else {
            return res.status(400).send({ message: "Missing Event UUID." });
        }
    } catch (err) {
        console.error(err.message);
        return res.status(500).send({
            message: "Error when updating event.",
            error: err.message,
        });
    }
};

/**
 * Retrieves an event from MongoDB based on id.
 * @param {*} req - request details
 * @param {*} res - response details
 * @returns - response details (with status)
 */
const getEventById = async (req, res) => {
    const uuid = req.params?.uuid;
    try {
        if (uuid) {
            const event = await Event.findOne(
                { uuid },
                { projection: { _id: 0 } },
            );
            if (!event) {
                return res.status(404).send({ message: "Event not found." });
            }
            return res.status(200).json(event);
        } else {
            return res.status(400).send({ message: "Missing Event UUID." });
        }
    } catch (err) {
        console.error(err.message);
        return res.status(500).send({
            message: "Error when retrieving event.",
            error: err.message,
        });
    }
};

/**
 * Gets all events based off a filter
 * @param {*} req - request details
 * @param {*} res - response details
 * @returns - response details (with status)
 */
const getAllEvents = async (req, res) => {
    const {
        type,
        status,
        createdBy,
        dateCreated,
        lastUpdatedBy,
        dateLastUpdated,
    } = req.query;
    try {
        let filter = {};

        if (type) {
            filter.type = new RegExp(type, "i"); // 'i' makes the search case-insensitive
        }

        if (status) {
            filter.status = new RegExp(status, "i");
        }

        if (createdBy) {
            filter.createdBy = new RegExp(createdBy, "i");
        }

        const events = await Event.find(filter, {
            projection: { _id: 0 },
        });
        return res.status(200).json(events);
    } catch (err) {
        console.error(err.message);
        return res.status(500).send({
            message: "Error when retrieving all events.",
            error: err.message,
        });
    }
};

module.exports = {
    createEvent,
    deleteEventById,
    editEventById,
    getEventById,
    getAllEvents,
};
