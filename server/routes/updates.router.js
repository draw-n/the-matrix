const express = require("express");

const router = express.Router();

const {
    createUpdate,
    deleteUpdate,
    editUpdate,
    getUpdate,
} = require("../controllers/updates.controllers.js");

router.post("/", createUpdate);
router.put("/", editUpdate);
router.get("/:updateId", getUpdate);
router.delete("/", deleteUpdate);

module.exports = router;
