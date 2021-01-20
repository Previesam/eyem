const mongoose = require('mongoose');
const validator = require('validator');

const JobSchema = mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId, required: true
  },
  lens: { type: mongoose.Schema.Types.ObjectId, required: true },
  frame: { type: String, required: true },
  due: { type: Date, required: true },
  staffAssigned: { type: mongoose.Schema.Types.ObjectId, required: true },
  messages: [{ type: mongoose.Schema.ObjectId }],
  amount: { type: String },
  deposit: { type: String },
}, { timestamps: true });

UserSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Job', JobSchema);