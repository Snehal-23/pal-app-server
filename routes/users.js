const express = require("express");

const router = express.Router();
const userController = require("../controllers/user");

// const app = express();
const auth = require("../helpers/jwt");

//login
router.post("/login", auth.optional, userController.login);

//POST users
router.post("/register", auth.optional, userController.postUser);

//count product
router.post("/count", auth.required, userController.countUsers);

//delete product
router.post("/delete/:id", auth.required, userController.deleteUser);

//GET users
router.get("/", auth.required, userController.getUsers);

//fetch single user
router.post("/:id", auth.required, userController.getUser);

module.exports = router;
