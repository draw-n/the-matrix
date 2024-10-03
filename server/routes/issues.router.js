const express = require("express");

const router = express.Router();

const {
    createIssue,
    deleteIssue,
    editIssue,
    getIssue
} = require("../controllers/issues.controllers.js");

router.post("/", createIssue);
router.put("/:id", editIssue);
router.get("/:id", getUpdate);
router.delete("/:id", deleteUpdate);

module.exports = router;