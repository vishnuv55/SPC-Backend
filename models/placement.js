const mongoose = require('mongoose');

const { Schema } = mongoose;

const placementSchema = new Schema({
  _id: Schema.Types.ObjectId,
  name: {
    type: String,
    required: true,
  },
  register_number: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone_number: {
    type: String,
    required: true,
  },
  pass_out_year: {
    type: String,
    required: true,
  },
  placed_company: {
    type: String,
    required: true,
  },
  ctc: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('Placement', placementSchema);
