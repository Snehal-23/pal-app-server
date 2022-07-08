const express = require("express");

const router = express.Router();

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
router.get("/", productController.getProducts);

//products on sale - limit
router.get("/sale/:limit", productController.getProductOnSale);

//count product
router.post("/count", productController.countProduct);

//fetch single product
router.get("/:id", productController.getProduct);

//post products
router.post("/", uploadOptions.single("image"), productController.postProduct);

//post products
router.post(
  "/upload/imageGallery",
  uploadOptions.array("images", 10),
  productController.uploadImageGallery
);

//update product
router.post("/update/:id", productController.updateProduct);

//delete product
router.post("/delete/:id", productController.deleteProduct);

module.exports = router;
