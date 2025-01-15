const Issue = require("../models/Issue.js");
const mongoose = require("mongoose");

const createIssue = async (req, res) => {
    const { equipment, description, createdBy, dateCreated } = req.body;

    try {
        if (equipment && description && createdBy && dateCreated) {
            let issue = new Issue({
                _id: new mongoose.Types.ObjectId(),
                equipment: equipment,
                status: "open",
                description: description,
                createdBy: createdBy,
                dateCreated: dateCreated,
                assignedTo: "",
            });
            await issue.save();
            return res.status(200).json(issue);
        } else {
            return res
                .status(400)
                .send({ message: "Missing Issue Information." });
        }
    } catch (err) {
        console.error(err.message);
        return res.status(500).send({ message: err.message });
    }
};

const deleteIssue = async (req, res) => {
    const id = req.params.id;

    try {
        if (id) {
            Issue.findByIdAndDelete(id)
                .then(function () {
                    return res
                        .status(200)
                        .json({ message: "Successfully deleted." });
                })
                .catch(function (error) {
                    return res.status(400).send({ message: error });
                });
        } else {
            return res.status(400).send({ message: "Missing Issue ID" });
        }
    } catch (err) {
        console.log(err.message);
        return res.status(500).send({ message: err.message });
    }
};

const editIssue = async (req, res) => {
    const id = req.params?.id;
    try {
        if (id) {
            const issue = Issue.findByIdAndUpdate(id, req.body)
                .then(function () {
                    res.status(200).json(issue);
                })
                .catch(function (error) {
                    console.log(error);
                    res.status(400).send({ message: error });
                });
        } else {
            res.status(400).send({ message: "Missing Issue ID" });
        }
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
};

const getIssue = async (req, res) => {
    const id = req.params.id;
    if (id) {
        try {
            const issue = await Issue.findById(issue);
            if (!issue) {
                return res.status(404).send("Issue not found");
            }
            return res.status(200).json(issue);
        } catch (error) {
            console.error("Error fetching issue:", error);
            return res.status(500).send("Internal server error");
        }
    }

    try {
        const issue = await Issue.find();
        return res.status(200).json(issue);
    } catch (err) {
        return res.status(500).send({ message: err.message });
    }
};

module.exports = {
    createIssue,
    deleteIssue,
    editIssue,
    getIssue,
};
