const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const roleSchema = new Schema({
  role_name: { type: String, required: true },
  value : { type: Number, required: true },
}, {
    versionKey: false
});

module.exports = mongoose.model("Role", roleSchema);