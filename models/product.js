const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const prodSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
      default:
        "https://i.pinimg.com/originals/e8/88/d4/e888d4feff8fd5ff63a965471a94b874.gif",
    },
    images: [
      {
        type: String,
        default: "",
      },
    ],
    description: {
      type: String,
      required: true,
    },
    richDescription: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      required: true,
    },
    countInStock: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      min: 0,
      max: 255,
    },
    rating: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    onSale: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

prodSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

prodSchema.set("toJSON", {
  virtuals: true,
});
module.exports = mongoose.model("Product", prodSchema);
