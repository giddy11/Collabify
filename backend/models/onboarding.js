const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const onboardingSchema = new Schema({
    email: {type: String, required: true, unique:true},
    name: {type: String, required: true},
    department: {type: String, required: true},
    topic: {type: String, required: true},
    noOfAcceptance: Number,
    link: String,
    Description: String,
}, {timestamps: true});

module.exports = mongoose.model("Onboarding", onboardingSchema);