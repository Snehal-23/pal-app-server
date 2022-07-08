const express = require("express");

const router = express.Router();

const categoryController = require("../controllers/category");

//GET categories
router.get("/", categoryController.getCategories);
//GET category
router.get("/:id", categoryController.getCategory);
//Add category
router.post("/", categoryController.postCategory);
//delete category
router.post("/delete/:id", categoryController.deleteCategory);
//update category
router.post("/update/:id", categoryController.updateCategory);

module.exports = router;
