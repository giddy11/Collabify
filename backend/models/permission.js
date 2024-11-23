const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const permissionSchema = new Schema(
  {
    permission_name: { type: String, required: true },
    is_default: {type: Number, default: 0 } //0 -> not default, 1 -> default
  },
  { timestamps: true }
);

module.exports = mongoose.model("Permission", permissionSchema);