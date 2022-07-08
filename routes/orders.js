const express = require("express");

const router = express.Router();

const orderController = require("../controllers/order");

//GET orders
router.get("/:id", orderController.getOrder);

router.post("/update/OrderStatus", orderController.updateOrderStatus);

router.post("/totalSale", orderController.getTotalSales);

router.post("/count", orderController.orderCount);

router.post("/userOrders", orderController.getUserOrders);

router.post("/delete/:id", orderController.deleteOrder);

router.post("/sales", orderController.deleteOrder);

router.get("/", orderController.getOrders);

router.post("/", orderController.postOrder);

module.exports = router;
