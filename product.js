class Product {
    constructor(product_id, title, description, price, thumbnail, code, stock) {
      this.product_id = product_id;
      this.title = title;
      this.description = description;
      this.price = price;
      this.thumbnail = thumbnail;
      this.code = code;
      this.stock = stock;
    }
  
    toString() {
      return `Product ID: ${this.product_id}, Title: ${this.title}, Price: $${this.price.toFixed(2)}, Stock: ${this.stock}`;
    }
  }
  
  module.exports = Product;
  