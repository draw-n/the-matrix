const express = require("express");

const router = express.Router();

const {
    createEquipment,
    deleteEquipment,
    editEquipment,
    getEquipment,
} = require("../controllers/equipment.controllers.js");

router.post("/", createEquipment);
router.put("/:id", editEquipment);
router.get("/", getEquipment);
router.delete("/:id", deleteEquipment);

module.exports = router;
