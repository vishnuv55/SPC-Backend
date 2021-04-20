const mongoose = require('mongoose');

const { Schema } = mongoose;

const billSchema = new Schema({
  _id: Schema.Types.ObjectId,
  bill_date: {
    type: Date,
    required: true,
  },
  bill_amount: {
    type: Number,
    required: true,
  },
  bill_description: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('bill', billSchema);
