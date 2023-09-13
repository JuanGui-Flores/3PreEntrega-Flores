// Definición de la clase Product
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
    return `Product ID: ${this.product_id}, Title: ${
      this.title
    }, Price: $${this.price.toFixed(2)}, Stock: ${this.stock}`;
  }
}

// Definición de la clase ProductManager
class ProductManager {
  constructor() {
    this.products = [];
    this.nextProductId = 1; // Inicializa el contador de IDs
  }

  addProduct(title, description, price, thumbnail, code, stock) {
    const product = new Product(
      this.nextProductId,
      title,
      description,
      price,
      thumbnail,
      code,
      stock
    );
    this.products.push(product);
    this.nextProductId++; // Incrementa el contador de IDs
    return product;
  }

  removeProduct(product_id) {
    const index = this.products.findIndex(
      (product) => product.product_id === product_id
    );
    if (index !== -1) {
      this.products.splice(index, 1);
      return true;
    }
    return false;
  }

  findProduct(product_id) {
    return this.products.find((product) => product.product_id === product_id);
  }

  listProducts() {
    return this.products;
  }

  getProducts() {
    return this.products;
  }
}

// Crear una instancia de ProductManager
const productManager = new ProductManager();

// Llamar al método addProduct con los campos especificados
productManager.addProduct(
  "Producto Prueba",
  "Este es un producto prueba",
  200,
  "Sin imagen",
  "abc123",
  25
);

// Ver la lista de productos
console.log("Lista de productos:");
productManager.listProducts().forEach((product) => {
  console.log(product.toString());
});
