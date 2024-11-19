const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const followUpSchema = new Schema({
    strugglingLearnerId: { type: Schema.Types.ObjectId, ref: 'User' },
    tutorId: { type: Schema.Types.ObjectId, ref: 'User' },
    startDate: Date,
    deadline: Date,
    Description: String,
    status: { type: String, enum: ['Pending', 'Done'], default: "Pending" },
}, {timestamps: true});

module.exports = mongoose.model("FollowUp", followUpSchema);