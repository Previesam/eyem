const mongoose = require("mongoose");
const validator = require("validator");

const ClientSchema = mongoose.Schema({
  Name: {
    type: String
  },
  BillingAddress: { type: String },
  Code: { type: String },
  Email: { type: String },
  Key: { type: String },
  Branch: { type: String },
  CustomFields: { type: Object },
  Address: { type: String },
  Code: { type: String },
  Gender: { type: String }
});

ClientSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Client", ClientSchema);
