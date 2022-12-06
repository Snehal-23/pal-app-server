const express = require("express");

const router = express.Router();

const auth = require("../helpers/jwt");

const productController = require("../controllers/product");

const multer = require("multer");

const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error("invalid image type");

    if (isValid) {
      uploadError = null;
    }
    cb(uploadError, "public/uploads");
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split(" ").join("-");
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  },
});

const uploadOptions = multer({ storage: storage });

//GET products
router.get("/", auth.optional, productController.getProducts);

//category specific products
router.get(
  "/catgeory/:catId",
  auth.optional,
  productController.getCategoryProducts
);

//products on sale - limit
router.get("/sale/:limit", auth.optional, productController.getProductOnSale);

//count product
router.post("/count", auth.required, productController.countProduct);

//fetch single product
router.get("/:id", auth.optional, productController.getProduct);

//post products
router.post(
  "/",
  auth.required,
  uploadOptions.single("image"),
  productController.postProduct
);

//post products
router.post(
  "/upload/imageGallery",
  auth.required,
  uploadOptions.array("images", 10),
  productController.uploadImageGallery
);

//update product
router.post("/update/:id", auth.required, productController.updateProduct);

//delete product
router.post("/delete/:id", auth.required, productController.deleteProduct);

module.exports = router;
