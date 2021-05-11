const mongoose = require("mongoose");
const validator = require("validator");

const EmailSchema = mongoose.Schema({
  title: { type: String, required: true },
  message: {
    type: String,
    required: true
  },
  recipients: { type: Array, required: true },
  template: { type: mongoose.Schema.Types.ObjectId, required: true }
});

EmailSchema.set({ toJSON: { virtuals: true }, timestamps: true });

module.exports = mongoose.model("Email", EmailSchema);
