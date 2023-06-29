import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    products: [
      {
        type: mongoose.ObjectId,
        ref: 'Products',
      },
    ],
    payment: {},
    buyer: {
      type: mongoose.ObjectId,
      ref: 'users',
    },
    status: {
      type: String,
      default: 'Not Process',
      enum: ['Not Process', 'Processing', 'Shipped', 'deliverd', 'cancel'],
    },
  },
  { timestamps: true }
);

export default mongoose.model('Order', orderSchema);
