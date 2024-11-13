const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const learnerSchema = new Schema({
    fullName: {type: String, required: true},
    email: {type: String, required: true},
    number: String,
    fieldOfStudy: { type: String },
    noOfDocumentation: Number,
    noOfResolvedIssues: Number,
    rating: Number,
}, {timestamps: true});

module.exports = mongoose.model("Learner", learnerSchema);