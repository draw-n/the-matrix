const express = require("express");
const passport = require("passport");
const {
    createUser,
    getUser,
    getUsers,
    updateUser,
    deleteUser,
} = require("../controllers/users.controllers.js");

const router = express.Router();

router.post("/", createUser);
router.put("/:id", updateUser);
router.get("/", getUsers);
router.get("/:id", getUser);
router.delete("/:id", deleteUser);
router.post("/register", createUser);
router.post(
    "/login",
    passport.authenticate("local", { session: true }),
    (req, res) => {
        let user = req.user;

        if (user && user.toObject) {
            user = user.toObject(); // Convert to plain object if it's a Mongoose document
        }

        // Remove the property (replace 'propertyName' with the actual property to remove)
        delete user.password;
        return res.status(200).json({ message: "Login successful.", user: user });
    }
);

module.exports = router;
