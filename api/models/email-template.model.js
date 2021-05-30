const mongoose = require("mongoose");
const validator = require("validator");

const EmailTemplateSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true
    },
    description: { type: String, required: true },
    html: {
      type: String,
      required: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User"
    },
    lastModifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User"
    },
    active: { type: Boolean, required: true, default: true }
  },
  { toJSON: { virtuals: true }, timestamps: true }
);
module.exports = mongoose.model("EmailTemplate", EmailTemplateSchema);
