const express = require("express");

const router = express.Router();

const {
    createAnnouncement,
    deleteAnnouncement,
    editAnnouncement,
    getAnnouncement,
} = require("../controllers/announcements.controllers.js");

router.post("/", createAnnouncement);
router.put("/:id", editAnnouncement);
router.get("/", getAnnouncement);
router.delete("/:id", deleteAnnouncement);

module.exports = router;
