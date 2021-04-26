const mongoose = require('mongoose');

const { Schema } = mongoose;

const execomSchema = new Schema({
  _id: Schema.Types.ObjectId,
  designation: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Execom', execomSchema);
