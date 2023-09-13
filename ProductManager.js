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
      return `Product ID: ${this.product_id}, Title: ${this.title}, Price: $${this.price.toFixed(2)}, Stock: ${this.stock}`;
    }
  }
  
  // Definición de la clase ProductManager
  class ProductManager {
    constructor() {
      this.products = [];
      this.nextProductId = 1; // Inicializa el contador de IDs
    }
  
    addProduct(title, description, price, thumbnail, code, stock) {
      // Verificar si el código ya existe en la lista de productos
      const codeExists = this.products.some((product) => product.code === code);
      if (codeExists) {
        throw new Error(`El código "${code}" ya existe en otro producto.`);
      }
  
      const product = new Product(this.nextProductId, title, description, price, thumbnail, code, stock);
      this.products.push(product);
      this.nextProductId++; // Incrementa el contador de IDs
      return product;
    }
  
    removeProduct(product_id) {
      const index = this.products.findIndex((product) => product.product_id === product_id);
      if (index !== -1) {
        this.products.splice(index, 1);
        return true;
      }
      return false;
    }
  
    getProductById(product_id) {
      const product = this.products.find((product) => product.product_id === product_id);
      if (!product) {
        throw new Error(`Producto con ID ${product_id} no encontrado.`);
      }
      return product;
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
  
  // Llamar al método getProductById con un ID válido
  try {
    const product = productManager.getProductById(1);
    console.log("Producto encontrado:");
    console.log(product.toString());
  } catch (error) {
    console.error(error.message);
  }
  
  // Llamar al método getProductById con un ID inválido (debe arrojar un error)
  try {
    const product = productManager.getProductById(999);
    console.log("Producto encontrado:");
    console.log(product.toString());
  } catch (error) {
    console.error(error.message);
  }
  