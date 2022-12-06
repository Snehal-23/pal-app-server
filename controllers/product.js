const express = require("express");
const app = express();
const mongoose = require("mongoose");

const Product = require("../models/product");
const Category = require("../models/category");

exports.getProducts = async (req, res) => {
  let filter = {};
  // const cat_id = req.query.categories;
  // const cat_id = req.body.category ? req.body.category : null;
  // //ways to filter acc to category : http://localhost:3000/api/v1/products/categories=
  // if (cat_id) {
  //   filter = { category: cat_id };
  // }

  const productList = await Product.find(filter).populate("category");
  if (!productList) {
    res.json({ status: 0, message: "No data found" });
  } else {
    res.json({ data: productList, status: 1, message: "success" });
  }
};

exports.postProduct = (req, res) => {
  const category = Category.findById(req.body.category);
  if (!category) {
    res.status(400).send({ message: "Invalid category", status: 0 });
  }
  const file = req.file;
  if (!file) return res.status(400).send("No image in the request");

  const fileName = file.filename;
  const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

  const product = new Product({
    title: req.body.title,
    image: `${basePath}${fileName}`, // "http://localhost:3000/public/upload/image-2323232"
    images: req.body.images,
    description: req.body.description,
    richDescription: req.body.richDescription,
    price: req.body.price,
    countInStock: req.body.countInStock,
    height: req.body.height,
    category: req.body.category,
    rating: req.body.rating,
    numReviews: req.body.numReviews,
    onSale: req.body.onSale,
  });
  product
    .save()
    .then((createdProduct) => {
      res
        .status(201)
        .json({ data: createdProduct, message: "Success", status: 1 });
    })
    .catch((err) => {
      res.status(500).json({
        message: err,
        status: 0,
      });
    });
};

exports.getProduct = (req, res) => {
  const id = req.params.id;
  Product.findById(id)
    .select("title price -_id")
    .populate("category")
    .then((product) => {
      res.status(200).json({ data: product, message: "success", status: 1 });
    })
    .catch((err) => {
      res.json({ status: 0, message: err });
    });
};

exports.updateProduct = async (req, res) => {
  let id = req.params.id;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).send({ message: "Invalid Product Id", status: 0 });
  }
  const category = await Category.findById(req.body.category);
  if (!category) {
    return res.status(400).send({ message: "Invalid category", status: 0 });
  }
  Product.findByIdAndUpdate(
    id,
    {
      title: req.body.title,
      image: req.body.image,
      images: req.body.images,
      description: req.body.description,
      richDescription: req.body.richDescription,
      price: req.body.price,
      countInStock: req.body.countInStock,
      height: req.body.height,
      category: req.body.category,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
      onSale: req.body.onSale,
    },
    {
      new: true, //to get updated object
    }
  )
    .then((updatedProduct) => {
      if (!updatedProduct) {
        res.status(404).json({ message: "No data found", status: 0 });
      } else {
        res.status(200).json({
          message: "success",
          status: 1,
          data: updatedProduct,
        });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: err, status: 0 });
    });
};

exports.deleteProduct = (req, res) => {
  let id = req.params.id;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).send({ message: "Invalid product id", status: 0 });
  }
  Product.findByIdAndRemove(id)
    .then((deletedProduct) => {
      res
        .status(200)
        .send({ message: "Product deleted successfully", status: 1 });
    })
    .catch((err) => {
      res.status(500).send({ message: err, status: 0 });
    });
};

exports.countProduct = (req, res) => {
  Product.countDocuments()
    .then((count) => {
      res.status(200).json({ data: count, message: "success", status: 1 });
    })
    .catch((err) => {
      res.status(500).send({ message: err, status: 0 });
    });
};

exports.getProductOnSale = (req, res) => {
  let count = req.params.count ? req.params.count : 5;

  Product.find({ onSale: true })
    .limit(+count) //to convert into integer type
    .then((productsOnSale) => {
      res
        .status(200)
        .json({ data: productsOnSale, message: "success", status: 1 });
    })
    .catch((err) => {
      res.status(500).send({ message: err, status: 0 });
    });
};

exports.uploadImageGallery = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send("Invalid Product Id");
  }
  const files = req.files;
  let imagesPaths = [];
  const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

  if (files) {
    files.map((file) => {
      imagesPaths.push(`${basePath}${file.filename}`);
    });
  }

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      images: imagesPaths,
    },
    { new: true }
  );

  if (!product) return res.status(500).send("the gallery cannot be updated!");
  res.send(product);
};

exports.getCategoryProducts = async (req, res) => {
  let filter = {};
  let cat_id = req.params.catId;
  //ways to filter acc to category : http://localhost:3000/api/v1/products/categories=
  if (cat_id) {
    filter = { category: cat_id };
  }
  const productList = await Product.find(filter).populate("category");
  if (!productList) {
    res.json({ status: 0, message: "No data found" });
  } else {
    res.json({ data: productList, status: 1, message: "success" });
  }
};
