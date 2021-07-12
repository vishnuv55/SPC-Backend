const mongoose = require('mongoose');

const { Schema } = mongoose;

const studentSchema = new Schema({
  _id: Schema.Types.ObjectId,
  register_number: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: String,
  branch: String,
  date_of_birth: Date,
  gender: String,
  tenth_mark: {
    percentage: Number,
    cgpa: Number,
  },
  plus_two_mark: {
    percentage: Number,
    cgpa: Number,
  },
  btech_cgpa: Number,
  number_of_backlogs: Number,
  email: {
    type: String,
    required: true,
  },
  phone_number: String,
  address: {
    line_one: String,
    line_two: String,
    state: String,
    zip: Number,
  },
  guardian_name: String,
  guardian_contact_number: String,
  pass_out_year: {
    type: String,
    required: true,
  },
  registered_drives: [String],
});

module.exports = mongoose.model('Student', studentSchema);
