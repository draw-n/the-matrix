const Update = require("../models/Update.js");

const createUpdate = async (req, res) => {
    const { type, description, createdBy, dateCreated } = req.body;

    try {
        if (type && description && createdBy && dateCreated) {
            let update = new Update({
                id: 0,
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
                .send({ message: "Missing Update Information." });
        }
    } catch (err) {
        console.error(err.message);
        return res.status(500).send({ message: err.message });
    }
};

const deleteUpdate = async (req, res) => {
    const id = req.params.id;

    try {
        if (id) {
            Update.findByIdAndDelete(id)
                .then(function () {
                    return res
                        .status(200)
                        .json({ message: "Successfully deleted." });
                })
                .catch(function (error) {
                    return res.status(400).send({ message: error });
                });
        } else {
            return res.status(400).send({ message: "Missing Update ID" });
        }
    } catch (err) {
        console.log(err.message);
        return res.status(500).send({ message: err.message });
    }
};

const editUpdate = async (req, res) => {
    const id = req.params?.id;
    try {
        if (id) {
            const update = Update.findByIdAndUpdate(id, req.body)
                .then(function () {
                    console.log(update);
                    res.status(200).json(update);
                })
                .catch(function (error) {
                    console.log(error);
                    res.status(400).send({ message: error });
                });
        } else {
            res.status(400).send({ message: "Missing Update ID" });
        }
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
};

const getUpdate = async (req, res) => {
    const id = req.params.id;
    if (id) {
        try {
            const update = await Update.findById(update);
            if (!update) {
                return res.status(404).send("Update not found");
            }
            return res.status(200).json(update);
        } catch (error) {
            console.error("Error fetching issue:", error);
            return res.status(500).send("Internal server error");
        }
    }
    console.log("no id detected");

    try {
        const update = await Update.find();
        return res.status(200).json(update);
    } catch (err) {
        return res.status(500).send({ message: err.message });
    }
};

module.exports = {
    createUpdate,
    deleteUpdate,
    editUpdate,
    getUpdate,
};
