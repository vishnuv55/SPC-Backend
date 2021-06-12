const mongoose = require('mongoose');

const { Schema } = mongoose;

const querySchema = new Schema({
  _id: Schema.Types.ObjectId,
  created_date: Date,
  question: {
    question: String,
    student_name: String,
    student_id: String,
  },
  answer: {
    answer: String,
    designation: String,
  },
});

module.exports = mongoose.model('Query', querySchema);
