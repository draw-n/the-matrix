const express = require("express");

const {
    createUser,
    getUserById,
    getUsers,
    updateUser,
    deleteUser,
} = require("../controllers/users.controllers.js");

const router = express.Router();

router.post("/", createUser);
router.put("/", updateUser);
router.get("/users", getUsers);
router.get("/:userId", getUserById);
router.delete("/:userId", deleteUser);
