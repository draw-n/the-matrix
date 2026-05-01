const express = require("express");

const router = express.Router();

const {
    createMaterial,
    deleteMaterialById,
    editMaterialById,
    getMaterialById,
    getAllMaterials,
} = require("../controllers/materials.controllers.js");
const { ensureAuthenticated, ensureAccess } = require("../middleware/auth.js");

router.post("/", ensureAuthenticated, ensureAccess(["admin", "moderator"]), createMaterial);
router.put("/:uuid", ensureAuthenticated, ensureAccess(["admin", "moderator"]), editMaterialById);
router.get("/:uuid", ensureAuthenticated, getMaterialById);
router.get("/", ensureAuthenticated, getAllMaterials);
router.delete("/:uuid", ensureAuthenticated, ensureAccess(["admin", "moderator"]), deleteMaterialById);
module.exports = router;
