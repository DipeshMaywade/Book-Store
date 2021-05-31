const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    author: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      unique: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    isAddedToBag: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const book = mongoose.model('Book', bookSchema);
module.exports = { book };
