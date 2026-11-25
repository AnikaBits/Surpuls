const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "donor", "ngo"],
      default: "donor",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "blocked"],
      default: "pending",
    },
    donorType: {
      type: String,
    },
    image: {
      type: String,
    },
    totalDonations: {
      type: Number,
      default: 0,
    },
    totalMealsDonated: {
      type: Number,
      default: 0,
    },
    totalFoodReceived: {
      type: Number,
      default: 0,
    },
    totalPeopleHelped: {
      type: Number,
      default: 0,
    },
    phone: {
      type: String,
    },
    address: {
      type: String,
    },
    restaurant: {
      name: String,
      address: String,
      osmId: String,
      lat: Number,
      lng: Number,
      placeVerified: {
        type: Boolean,
        default: false,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
