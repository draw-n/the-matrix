const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const {
    createEvent,
    deleteEventById,
    editEventById,
    getEventById,
    getAllEvents,
} = require("../controllers/event.controllers.js");

const { ensureAuthenticated, ensureAccess } = require("../middleware/auth.js");

router.post(
    "/",
    ensureAuthenticated,
    ensureAccess(["admin", "moderator"]),
    createEvent,
);
router.put(
    "/:uuid",
    ensureAuthenticated,
    ensureAccess(["admin", "moderator"]),

    editEventById,
);
router.get("/:uuid", ensureAuthenticated, getEventById);
router.get("/", getAllEvents);
router.delete("/:uuid", ensureAuthenticated, ensureAccess(["admin", "moderator"]), deleteEventById);
module.exports = router;
