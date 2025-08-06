const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  selectedColor: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  itemName: {
    type: String,
    required: true
  }
});

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [orderItemSchema],
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  orderDate: {
    type: Date,
    default: Date.now
  },
  shippingAddress: {
    type: String,
    default: 'Not specified'
  },
  paymentMethod: {
    type: String,
    default: 'Not specified'
  }
});

orderSchema.index({ userId: 1, orderDate: -1 });
orderSchema.index({ status: 1 });

module.exports = mongoose.model('Order', orderSchema); 