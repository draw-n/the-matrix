const axios = require("axios");
const fs = require("fs");
const path = require("path");
const Job = require("../models/Job.js");

const validateUniqueField = async (value, fieldName, collection, excludeId) => {
    // Build query dynamically
    const query = { [fieldName]: value };

    if (excludeId) {
        query.uuid = { $ne: excludeId };
    }

    const existing = await collection.findOne(query);
    return !existing; // true if unique
};

const getCameraSnapshot = async (cameraUrl, jobId) => {
    try {
        const response = await axios.get(`${cameraUrl}/snapshot`, { responseType: "stream" });
        const job = await Job.findById(jobId);
        const contentType = response.headers["content-type"];
        const extension = mapImageExtension(contentType);

        const filePath = path.join(
            __dirname,
            "..",
            "files",
            "images",
            "jobs",
            `${jobId}.${extension}`,
        );
        const writer = fs.createWriteStream(filePath);
        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on("finish", () => resolve(filePath));
            writer.on("error", reject);
        });
    } catch (error) {
        console.error("Error fetching camera snapshot:", error);
        throw error;
    }
};

module.exports = {
    validateUniqueField,
    getCameraSnapshot,
};
