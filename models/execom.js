import mongoose from 'mongoose';

const { Schema } = mongoose;

const execomSchema = new Schema({
  _id: Schema.Types.ObjectId,
  designation: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});
const execom = mongoose.model('execom', execomSchema);

export default execom;
