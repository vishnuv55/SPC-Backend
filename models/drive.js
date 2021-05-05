const mongoose = require('mongoose');

const { Schema } = mongoose;

const driveSchema = new Schema({
  _id: Schema.Types.ObjectId,
  company_name: {
    type: String,
    required: true,
  },
  contact_email: {
    type: String,
    required: true,
  },
  drive_date: {
    type: Date,
    required: true,
  },
  location: String,
  url: String,
  requirements: {
    gender: [String],
    tenth_mark: {
      percentage: Number,
      cgpa: Number,
    },
    plus_two_mark: {
      percentage: Number,
      cgpa: Number,
    },
    btech_min_cgpa: Number,
    number_of_backlogs: Number,
  },
  registered_students: [String],
});

module.exports = mongoose.model('Drive', driveSchema);
