const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const routerPermissionSchema = new Schema(
  {
    router_endpoint: { type: String, required: true },
    role: {type: Number, required: true }, // 0, 1
    permission: {type: Array, required: true } // 0,1,2,3
  },
  { timestamps: true }
);

module.exports = mongoose.model("RouterPermission", routerPermissionSchema);