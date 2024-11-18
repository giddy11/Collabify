const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fullName: { type: String, required: true },
    googleId: { type: String },
    phone: String,
    noOfDocumentation: Number,
    noOfResolvedIssues: Number,
    rating: Number,
    dob: Date,
    field: String,
    country: String,
    city: String,
    address: String,
    refreshToken: {
      type: String,
    },
    role: {
      type: String,
      enum: ["user", "admin"], // Allowed values
      default: "admin", // Default role
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);