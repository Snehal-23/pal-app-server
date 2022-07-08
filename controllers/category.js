const express = require("express");
const app = express();

const Category = require("../models/category");
const { options } = require("../routes/products");

exports.getCategories = async (req, res) => {
  const categoryList = await Category.find();
  if (!categoryList) {
    res.status(404).json({ message: "No data found", status: 0 });
  } else {
    res.status(200).json({ data: categoryList, message: "Success", status: 1 });
  }
};

exports.getCategory = (req, res) => {
  const id = req.params.id;
  Category.findById(id)
    .then((category) => {
      if (!category) {
        res.status(404).json({ message: "No data found", status: 0 });
      } else {
        res.status(200).json({
          message: "success",
          status: 1,
          data: category,
        });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: err, status: 0 });
    });
};
exports.postCategory = async (req, res) => {
  let category = new Category({
    name: req.body.name,
    icon: req.body.icon,
    color: req.body.color,
  });
  const createdCat = await category.save();
  if (!createdCat) {
    return res.status(500).json({
      message: "The category can not be created",
      status: 0,
    });
  }
  res.status(201).json({ data: createdCat, message: "success", status: 1 });
};

exports.deleteCategory = (req, res) => {
  let id = req.params.id;
  Category.findByIdAndRemove(id)
    .then((deletedCat) => {
      if (deletedCat) {
        return res.status(200).json({
          status: 1,
          message: "Category successfully deleted",
        });
      } else {
        return res.status(404).json({
          status: 0,
          message: "Category not found",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: err, status: 0 });
    });
};

exports.updateCategory = (req, res) => {
  let id = req.params.id;
  Category.findByIdAndUpdate(
    id,
    { name: req.body.name, icon: req.body.icon, color: req.body.color },
    {
      new: true, //to get updated object
    }
  )
    .then((updatedCat) => {
      if (!updatedCat) {
        res.status(404).json({ message: "No data found", status: 0 });
      } else {
        res.status(200).json({
          message: "success",
          status: 1,
          data: updatedCat,
        });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: err, status: 0 });
    });
};
