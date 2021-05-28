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
  address: {
    line_one: {
      type: String,
      required: true,
    },
    line_two: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    zip: {
      type: Number,
      required: true,
    },
  },
  phone_number: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Alumni', alumniSchema);
