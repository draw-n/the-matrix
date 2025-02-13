const Category = require("../models/Category.js");
var mongoose = require("mongoose");
const { ObjectId } = mongoose.Types; // Import ObjectId

const createCategory = async (req, res) => {
    const { name, defaultIssues, properties } = req.body;

    try {
        if (name) {
            let category = new Category({
                _id: new mongoose.Types.ObjectId(),
                name,
                defaultIssues,
                properties,
            });
            await category.save();
            return res.status(200).send({
                message: "Successfully created new category.",
                category: category,
            });
        } else {
            return res
                .status(400)
                .send({ message: "Missing Category Information." });
        }
    } catch (err) {
        console.error(err.message);
        return res
            .status(500)
            .send({ message: "Error with creating new category." });
    }
};

const deleteCategory = async (req, res) => {
    const id = req.params?.id;

    try {
        if (id) {
            const deletedCategory = await Category.findByIdAndDelete(id);
            return res
                .status(200)
                .json({ message: "Successfully deleted category." });
        } else {
            return res.status(400).send({ message: "Missing Category ID" });
        }
    } catch (err) {
        console.log(err.message);
        return res
            .status(500)
            .send({ message: "Error with deleting category." });
    }
};

const editCategory = async (req, res) => {
    const id = req.params?.id;
    const { name, defaultIssues, properties } = req.body;

    // Prepare update object
    const updateData = {};

    // Populate update object with fields to update
    if (name) updateData.name = name;
    if (defaultIssues) updateData.defaultIssues = defaultIssues;
    if (properties) updateData.properties = properties;

    try {
        if (id) {
            const updatedCategory = await Category.findByIdAndUpdate(
                id,
                updateData,
                { new: true, runValidators: true }
            );

            if (!updatedCategory) {
                return res.status(404).json({ message: "Category not found" });
            }

            return res.status(200).send({
                message: "Successfully updated category.",
                category: updatedCategory,
            });
        } else {
            return res.status(400).send({ message: "Missing Category ID" });
        }
    } catch (err) {
        console.error(err.message);
        return res
            .status(500)
            .send({ message: "Error with updating category." });
    }
};

const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        return res.status(200).json(categories);
    } catch (err) {
        console.error(err.message);
        return res.status(500).send({ message: "Error with retrieving categories." });
    }
};

const getCategory = async (req, res) => {
    const id = req.params?.id;
    if (id) {
        try {
            const category = await Category.findById(id);
            if (!category) {
                return res.status(404).send("Category not found");
            }
            return res.status(200).json(category);
        } catch (err) {
            console.error(err.message);
            return res.status(500).send({message: "Error retrieving category"});
        }
    } else {
        return res.status(400).send({message: "Missing Category ID."})
    }
};

module.exports = {
    createCategory,
    deleteCategory,
    editCategory,
    getCategory,
    getAllCategories
};
