const express = require("express");
const multer = require("multer");
const router = express.Router();
const path = require("path");
const fs = require("fs");

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

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        const dir = path.join(__dirname, "../files/images/equipment/");
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true }); // Create directory if it doesn't exist
        }
        callback(null, dir);
    },
    limits: { fileSize: 250 * 1024 * 1024 }, // 250 MB limit
    filename: (req, file, callback) => {
        let filename = file.originalname;
        callback(null, filename);
    },
});

const upload = multer({ storage: storage });


router.post("/", ensureAuthenticated, ensureAccess(["admin", "moderator"]), upload.single("file"), createEquipment);
router.put("/:uuid", ensureAuthenticated, ensureAccess(["admin", "moderator"]), upload.single("file"), editEquipmentById);
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
