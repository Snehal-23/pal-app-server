const express = require("express");

const router = express.Router();

const auth = require("../helpers/jwt");

const orderController = require("../controllers/order");

//GET orders
router.get("/:id", auth.required, orderController.getOrder);

router.post(
  "/update/OrderStatus",
  auth.required,
  orderController.updateOrderStatus
);

router.post("/totalSale", auth.required, orderController.getTotalSales);

router.post("/count", auth.required, orderController.orderCount);

router.post("/userOrders", auth.required, orderController.getUserOrders);

router.post("/delete/:id", auth.required, orderController.deleteOrder);

router.post("/sales", auth.required, orderController.deleteOrder);

router.get("/", auth.required, orderController.getOrders);

router.post("/", auth.required, orderController.postOrder);

module.exports = router;
