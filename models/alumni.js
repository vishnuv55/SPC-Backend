import mongoose from 'mongoose';

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
  password: {
    type: String,
    required: true,
  },
});

const alumni = mongoose.model('alumni', alumniSchema);

export default alumni;
