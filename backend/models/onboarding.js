const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const onboardingSchema = new Schema({
    name: {type: String, required: true},
    department: {type: String, required: true},
    topic: {type: String, required: true},
    noOfAcceptance: Number,
    link: String,
}, {timestamps: true});

module.exports = mongoose.model("Onboarding", onboardingSchema);