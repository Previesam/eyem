const mongoose = require("mongoose");

const roleSchema = mongoose.Schema(
  {
    name: { type: String, unique: true, required: true },
    roleDescription: { type: String, required: true },
    permissions: { type: Object, required: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User"
    },
    lastModifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User"
    }
  },
  { timestamps: true }
);

roleSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Role", roleSchema);
