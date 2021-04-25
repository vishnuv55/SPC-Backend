const mongoose = require('mongoose');

const { Schema } = mongoose;

const AlumniSchema = new Schema({
  _id: Schema.Types.ObjectId,
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Alumni', AlumniSchema);
