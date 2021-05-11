const mongoose = require("mongoose");
const validator = require("validator");

const EmailTemplateSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  data: { type: String, required: true }
});

EmailTemplateSchema.set({ toJSON: { virtuals: true }, timestamps: true });

module.exports = mongoose.model("EmailTemplate", EmailTemplateSchema);
