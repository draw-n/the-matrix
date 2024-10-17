const express = require("express");

const router = express.Router();

const {
    createUpdate,
    deleteUpdate,
    editUpdate,
    getUpdate,
} = require("../controllers/updates.controllers.js");

router.post("/", createUpdate);
router.put("/:id", editUpdate);
router.get("/", getUpdate);
router.delete("/:id", deleteUpdate);

module.exports = router;
