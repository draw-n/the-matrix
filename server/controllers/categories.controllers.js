const Category = require("../models/Category.js");
var mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

/**
 * Creates new category and saves to MongoDB.
 * @param {*} req - request details
 * @param {*} res - response details
 * @returns - response details (with status)
 */
const createCategory = async (req, res) => {
    const { name, defaultIssues, properties } = req.body;

    try {
        if (name) {
            let category = new Category({
                _id: new ObjectId(),
                name,
                defaultIssues,
                properties,
            });
            await category.save();
            return res.status(200).json(category);
        } else {
            return res
                .status(400)
                .send({ message: "Missing at least one required field." });
        }
    } catch (err) {
        console.error(err.message);
        return res.status(500).send({
            message: "Error when creating new category.",
            error: err.message,
        });
    }
};

/**
 * Deletes a dategory from MongoDB
 * @param {*} req - request details
 * @param {*} res - response details
 * @returns - response details (with status)
 */
const deleteCategory = async (req, res) => {
    const id = req.params?.id;

    try {
        if (id) {
            const category = await Category.findByIdAndDelete(id);
            if (!category) {
                return res.status(404).send({ message: "Category not found." });
            }
            return res
                .status(200)
                .json({ message: "Successfully deleted category." });
        } else {
            return res.status(400).send({ message: "Missing Category ID." });
        }
    } catch (err) {
        console.error(err.message);
        return res.status(500).send({
            message: "Error with deleting category.",
            error: err.message,
        });
    }
};

/**
 * Updates a category from MongoDB
 * @param {*} req - request details
 * @param {*} res - response details
 * @returns - response details (with status)
 */
const editCategory = async (req, res) => {
    const id = req.params?.id;

    try {
        if (id) {
            const category = await Category.findByIdAndUpdate(id, req.body);

            if (!category) {
                return res.status(404).send({ message: "Category not found." });
            }

            return res.status(200).json(category);
        } else {
            return res.status(400).send({ message: "Missing Category ID." });
        }
    } catch (err) {
        console.error(err.message);
        return res.status(500).send({
            message: "Error when updating category.",
            error: err.message,
        });
    }
};

/**
 * Retrieves a category from MongoDB based on id.
 * @param {*} req - request details
 * @param {*} res - response details
 * @returns - response details (with status)
 */
const getCategory = async (req, res) => {
    const id = req.params?.id;

    try {
        if (id) {
            const category = await Category.findById(id);
            if (!category) {
                return res.status(404).send({ message: "Category not found" });
            }
            return res.status(200).json(category);
        } else {
            return res.status(400).send({ message: "Missing Category ID." });
        }
    } catch (err) {
        console.error(err.message);
        return res
            .status(500)
            .send({ message: "Error retrieving category", error: err.message });
    }
};

/**
 * Gets all categories from MongoDB based on filters.
 * @param {*} req - request details
 * @param {*} res - response details
 * @returns - response details (with status)
 */
const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        return res.status(200).json(categories);
    } catch (err) {
        console.error(err.message);
        return res
            .status(500)
            .send({
                message: "Error with retrieving categories.",
                error: err.message,
            });
    }
};

module.exports = {
    createCategory,
    deleteCategory,
    editCategory,
    getCategory,
    getAllCategories,
};
