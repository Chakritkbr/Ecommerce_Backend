import mongoose from 'mongoose';

const schema = mongoose.Schema;

const categorySchema = new schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  slug: {
    type: String,
    lowercase: true,
  },
});

export default mongoose.model('Category', categorySchema);
