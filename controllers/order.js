const express = require("express");
const app = express();
const mongoose = require("mongoose");

const Order = require("../models/order");
const OrderItem = require("../models/orderItem");

exports.getOrders = async (req, res) => {
  const orderList = await Order.find()
    .populate("user", "user name")
    .sort({ dateOrdered: -1 }); //to sort by desc add -1
  if (!orderList) {
    res.json({ status: 0, message: "No data found" });
  } else {
    res.json({ message: "success", status: 1, data: orderList });
  }
};

exports.getOrder = (req, res) => {
  const id = req.params.id;
  Order.findById(id)
    .populate("user", "user name")
    .populate({
      path: "orderItems",
      populate: { path: "product", populate: "category" },
    })
    .then((order) => {
      if (!order) {
        res.status(404).json({ message: "No data found", status: 0 });
      } else {
        res.status(200).json({
          message: "success",
          status: 1,
          data: order,
        });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: err, status: 0 });
    });
};

exports.postOrder = async (req, res) => {
  // console.log(req.body.orderItems);
  const orderItemsIds = Promise.all(
    req.body.orderItems.map(async (orderItem) => {
      let newOrderItem = new OrderItem({
        quantity: orderItem.quantity,
        product: orderItem.product,
      });
      newOrderItem = await newOrderItem.save();
      return newOrderItem._id;
    })
  );
  const orderItemsIdsResolved = await orderItemsIds;
  // console.log(orderItemsIdsResolved);
  const totalPrices = await Promise.all(
    orderItemsIdsResolved.map(async (orderItemId) => {
      const orderItem = await OrderItem.findById(orderItemId).populate(
        "product",
        "price"
      );
      const totalPrice = orderItem.product.price * orderItem.quantity;
      return totalPrice;
    })
  );

  const totalPrice = totalPrices.reduce((a, b) => a + b, 0);

  let order = new Order({
    orderItems: orderItemsIdsResolved,
    shippingAddress1: req.body.shippingAddress1,
    shippingAddress2: req.body.shippingAddress2,
    city: req.body.city,
    zip: req.body.zip,
    state: req.body.state,
    country: req.body.country,
    phone: req.body.phone,
    status: req.body.status,
    totalPrice: totalPrice,
    user: req.body.user,
  });
  const created_order = await order.save();
  if (!created_order) {
    return res.status(500).json({
      message: "The order can not be created",
      status: 0,
    });
  }
  res.status(201).json({ data: created_order, message: "success", status: 1 });
};

exports.updateOrderStatus = async (req, res) => {
  let order_id = req.body.order_id;
  if (!mongoose.isValidObjectId(order_id)) {
    return res.status(400).send({ message: "Invalid Product Id", status: 0 });
  }
  Order.findByIdAndUpdate(
    order_id,
    {
      status: req.body.status,
    },
    {
      new: true, //to get updated object
    }
  )
    .then((updatedOrder) => {
      if (!updatedOrder) {
        res.status(404).json({ message: "No data found", status: 0 });
      } else {
        res.status(200).json({
          message: "success",
          status: 1,
          data: updatedOrder,
        });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: err, status: 0 });
    });
};

exports.deleteOrder = (req, res) => {
  let id = req.params.id;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).send({ message: "Invalid product id", status: 0 });
  }
  Order.findByIdAndRemove(id)
    .then(async (order) => {
      if (order) {
        await order.orderItems.map(async (orderItem) => {
          await OrderItem.findByIdAndRemove(orderItem);
        });
        return res
          .status(200)
          .json({ status: 1, success: true, message: "the order is deleted!" });
      } else {
        return res
          .status(404)
          .json({ status: 0, success: false, message: "order not found!" });
      }
    })
    .catch((err) => {
      return res.status(500).json({ status: 0, success: false, error: err });
    });
};

exports.getTotalSales = async (req, res) => {
  const totalSales = await Order.aggregate([
    { $group: { _id: null, totalsales: { $sum: "$totalPrice" } } },
  ]);

  if (!totalSales) {
    return res.status(400).send("The order sales cannot be generated");
  }

  res.send({ totalsales: totalSales.pop().totalsales });
};

exports.orderCount = async (req, res) => {
  Order.countDocuments()
    .then((count) => {
      res.status(200).json({ data: count, message: "success", status: 1 });
    })
    .catch((err) => {
      res.status(500).send({ message: err, status: 0 });
    });
};

exports.getUserOrders = async (req, res) => {
  const user_id = req.body.user_id;
  if (!mongoose.isValidObjectId(user_id)) {
    return res.status(400).send({ message: "Invalid user id", status: 0 });
  }
  const userOrderList = await Order.find({ user: user_id })
    .populate({
      path: "orderItems",
      populate: {
        path: "product",
        populate: "category",
      },
    })
    .sort({ dateOrdered: -1 });

  if (!userOrderList) {
    res.status(500).json({ status: 0, message: "No orders found" });
  }
  res.send({ data: userOrderList, status: 1, message: "success" });
};
