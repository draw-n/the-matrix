const express = require("express");
const multer = require("multer");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const {
    createMaterial,
    deleteMaterialById,
    editMaterialById,
    getMaterialById,
    getAllMaterials,
} = require("../controllers/materials.controllers.js");
const { ensureAuthenticated, ensureAccess } = require("../middleware/auth.js");

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        const dir = path.join(__dirname, "../files/configs/");
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

router.post("/", ensureAuthenticated, ensureAccess(["admin", "moderator"]), upload.single("file"), createMaterial);
router.put("/:uuid", ensureAuthenticated, ensureAccess(["admin", "moderator"]), upload.single("file"), editMaterialById);
router.get("/:uuid", ensureAuthenticated, getMaterialById);
router.get("/", ensureAuthenticated, getAllMaterials);
router.delete("/:uuid", ensureAuthenticated, ensureAccess(["admin", "moderator"]), deleteMaterialById);
module.exports = router;
