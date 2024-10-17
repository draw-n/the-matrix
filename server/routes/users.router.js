const express = require("express");

const {
    createUser,
    getUser,
    updateUser,
    deleteUser,
} = require("../controllers/users.controllers.js");

const router = express.Router();

router.post("/", createUser);
router.put("/:id", updateUser);
router.get("/", getUser);
router.delete("/:id", deleteUser);

module.exports = router;