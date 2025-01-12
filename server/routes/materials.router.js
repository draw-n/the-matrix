const express = require("express");

const router = express.Router();

const {
    createMaterial,
    deleteMaterial,
    editMaterial,
    getMaterial,
} = require("../controllers/materials.controllers.js");

router.post("/", createMaterial);
router.put("/:id", editMaterial);
router.get("/", getMaterial);
router.delete("/:id", deleteMaterial);

module.exports = router;
