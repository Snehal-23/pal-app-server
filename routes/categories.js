const express = require("express");

const router = express.Router();

const auth = require("../helpers/jwt");

const categoryController = require("../controllers/category");

//GET categories
router.get("/", auth.optional, categoryController.getCategories);
//GET category
router.get("/:id", auth.optional, categoryController.getCategory);
//Add category
router.post("/", auth.required, categoryController.postCategory);
//delete category
router.post("/delete/:id", auth.required, categoryController.deleteCategory);
//update category
router.post("/update/:id", auth.required, categoryController.updateCategory);

module.exports = router;
