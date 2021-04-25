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
  email: String,
  phone_number: String,
  address: {
    contact_address: String,
    zip: Number,
  },
  linkedin: String,
  twitter: String,
  github: String,
  guardian_name: String,
  guardian_contact_number: String,
  placement_status: Boolean,
  placed_company: String,
  projects: [
    {
      project_name: String,
      project_description: String,
      url: String,
    },
  ],
  programming_languages: [String],
});

module.exports = mongoose.model('student', studentSchema);
