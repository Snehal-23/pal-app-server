const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const authJwt = require("./helpers/authMiddleware");
const errorHandler = require("./helpers/error-handler");

require("dotenv/config");

app.use(cors());
// app.options("*", cors());

// parse requests of content-type - application/json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(authJwt());
// app.use(errorHandler);
app.use("/public/uploads", express.static(__dirname + "/public/uploads"));

//env variable
const api = process.env.API_URL;

//Routers
const productRoutes = require("./routes/products");
const orderRoutes = require("./routes/orders");
const userRoutes = require("./routes/users");
const categoryRoutes = require("./routes/categories");
const req = require("express/lib/request");

//Routes
app.use(`${api}/products`, productRoutes);
app.use(`${api}/orders`, orderRoutes);
app.use(`${api}/users`, userRoutes);
app.use(`${api}/categories`, categoryRoutes);

app.get(`/`, (req, res) => {
  res.send("Welcome to application.");
});

//development
mongoose
  .connect(process.env.CONN_STRING)
  .then(() => {
    app.listen(3000, () => {
      console.log(`Server is running on port 3000.`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

//prduction
// var server = app.listen(process.env.PORT || 3000, function () {
//   console.log(
//     "Express server listening on port %d in %s mode",
//     this.address().port,
//     app.settings.env
//   );
// });
