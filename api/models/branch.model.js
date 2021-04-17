const mongoose = require("mongoose");
const validator = require("validator");

const BranchSchema = mongoose.Schema({
  Name: {
    type: String
  },
  Key: { type: String },
});

BranchSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Branch", BranchSchema);
