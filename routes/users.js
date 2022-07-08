const express = require("express");

const router = express.Router();
const userController = require("../controllers/user");

//login
router.post("/login", userController.login);

//POST users
router.post("/register", userController.postUser);

//count product
router.post("/count", userController.countUsers);

//delete product
router.post("/delete/:id", userController.deleteUser);

//GET users
router.get("/", userController.getUsers);

//fetch single user
router.post("/:id", userController.getUser);

module.exports = router;
