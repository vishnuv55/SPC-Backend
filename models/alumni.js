const mongoose = require('mongoose');

const { Schema } = mongoose;

const alumniSchema = new Schema({
  _id: Schema.Types.ObjectId,
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone_number: String,
  placement_status: Boolean,
  placed_company: String,
  ctc: Number,
});

module.exports = mongoose.model('Alumni', alumniSchema);
