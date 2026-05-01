const express = require("express");
const multer = require("multer");
const router = express.Router();

const {
    createEquipment,
    deleteEquipmentById,
    editEquipmentById,
    getEquipmentById,
    getAllEquipment,
    updateStatusById,
    pausePrinterById,
} = require("../controllers/equipment.controllers.js");

const { ensureAuthenticated, ensureAccess } = require("../middleware/auth.js");

router.post("/", ensureAuthenticated, ensureAccess(["admin", "moderator"]), createEquipment);
router.put("/:uuid", ensureAuthenticated, ensureAccess(["admin", "moderator"]), editEquipmentById);
router.get("/status/:uuid", ensureAuthenticated, updateStatusById);
router.get(
    "/pause/:uuid",
    ensureAuthenticated,
    ensureAccess(["admin", "moderator"]),
    pausePrinterById,
);
router.get("/:uuid", ensureAuthenticated, getEquipmentById);
router.get("/", ensureAuthenticated, getAllEquipment);
router.delete("/:uuid", ensureAuthenticated, ensureAccess(["admin", "moderator"]), deleteEquipmentById);

module.exports = router;
