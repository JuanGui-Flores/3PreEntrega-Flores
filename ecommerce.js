/*base de datos */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Esquema para la colección "carts"
const cartSchema = new Schema({
  userId: { type: String, required: true },
  items: [{ productId: String, quantity: Number }],
});

// Esquema para la colección "messages"
const messageSchema = new Schema({
  sender: { type: String, required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

// Esquema para la colección "products"
const productSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
});

const Cart = mongoose.model('Cart', cartSchema);
const Message = mongoose.model('Message', messageSchema);
const Product = mongoose.model('Product', productSchema);
