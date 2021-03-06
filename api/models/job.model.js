const mongoose = require("mongoose");

const JobSchema = mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Client"
    },
    status: { type: String, required: true },
    lens: { type: String, required: true },
    frame: { type: String, required: true },
    dateIn: { type: Date, required: true },
    dateOut: { type: Date, required: true },
    optician: { type: String, required: true },
    doctor: { type: String, required: true },
    prescription: { type: Object, required: true },
    total: { type: String },
    deposit: { type: String },
    balance: { type: String },
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Branch"
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
    history: [{ status: String, name: String, date: Date }]
  },
  { toJSON: { virtuals: true }, timestamps: true }
);

module.exports = mongoose.model("Job", JobSchema);
