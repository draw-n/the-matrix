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

const findPrinter = async (equipmentIds) => {
    const allPrinters = await Equipment.find({ uuid: { $in: equipmentIds } });
    const jobCountsByPrinter = {};
    allPrinters.forEach(async (printer) => {
        jobCountsByPrinter[printer.uuid] = await Job.countDocuments({
            equipmentId: printer.uuid,
            status: { $in: ["queued", "ready", "printing"] },
        }); // Initialize count
    });
    allPrinters.sort((a, b) => {
        const countA = jobCountsByPrinter[a.uuid] || 0;
        const countB = jobCountsByPrinter[b.uuid] || 0;
        return countA - countB; // Ascending order
    });
    return allPrinters[0] || null; // Return printer with fewest active jobs
};

const getCameraSnapshot = async (cameraUrl, jobId) => {
    try {
        const response = await axios.get(`${cameraUrl}/snapshot`, {
            responseType: "stream",
        });
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
