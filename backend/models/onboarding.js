const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const onboardingSchema = new Schema({
    name: { type: String, required: true },
    department: { type: String, required: true },
    topic: { type: String, required: true },
    noOfAcceptance: Number,
    link: String,
    // userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  }, { timestamps: true });
  
  module.exports = mongoose.model("Onboarding", onboardingSchema);  