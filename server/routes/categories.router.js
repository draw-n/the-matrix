const express = require("express");

const router = express.Router();

const {
    createCategory,
    deleteCategoryById,
    editCategoryById,
    getCategoryById,
    getAllCategories,
} = require("../controllers/categories.controllers.js");

const { ensureAuthenticated, ensureAccess } = require("../middleware/auth.js");

router.post("/", ensureAuthenticated, ensureAccess(["admin"]), createCategory);
router.put(
    "/:uuid",
    ensureAuthenticated,
    ensureAccess(["admin"]),
    editCategoryById,
);
router.get("/:uuid", ensureAuthenticated, getCategoryById);
router.get("/", ensureAuthenticated, getAllCategories);
router.delete(
    "/:uuid",
    ensureAuthenticated,
    ensureAccess(["admin"]),
    deleteCategoryById,
);
module.exports = router;
