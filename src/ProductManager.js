const fs = require('fs');

const filePath = 'products.json';

class ProductManager {
constructor() {
  this.products = [];
  this.nextProductId = 1;

  try {
    const data = fs.readFileSync(filePath, 'utf8');
    this.products = JSON.parse(data);
    if (Array.isArray(this.products)) {
      const lastProduct = this.products[this.products.length - 1];
      if (lastProduct) {
        this.nextProductId = lastProduct.id + 1;
      }
    }
  } catch (error) {
    console.error('Error al cargar productos desde el archivo:', error.message);
  }
}

addProduct(title, description, price, thumbnail, code, stock) {
  if (!title || !description || !price || !thumbnail || !code || !stock) {
    console.error('Todos los campos son obligatorios');
    return;
  }

  const codeExists = this.products.some((product) => product.code === code);
  if (codeExists) {
    throw new Error(`El código "${code}" ya existe en otro producto.`);
  }

  const product = {
    id: this.nextProductId,
    title,
    description,
    price,
    thumbnail,
    code,
    stock,
  };
  this.products.push(product);
  console.log('Producto agregado correctamente');
  this.nextProductId++;

  try {
    this.saveProductsToFile();
  } catch (error) {
    console.error('Error al guardar el producto en el archivo:', error.message);
  }

  return product;
}

getProductById(productId) {
  const product = this.products.find((product) => product.id === productId);
  if (!product) {
    throw new Error(`Producto con ID ${productId} no encontrado.`);
  }
  return product;
}

getProducts() {
  return this.products;
}

updateProduct(productId, newData) {
  const productIndex = this.products.findIndex((product) => product.id === productId);
  if (productIndex === -1) {
    throw new Error(`Producto con ID ${productId} no encontrado.`);
  }

  this.products[productIndex] = { ...this.products[productIndex], ...newData };

  try {
    this.saveProductsToFile();
  } catch (error) {
    console.error('Error al guardar el producto en el archivo:', error.message);
  }

  return this.products[productIndex];
}

deleteProduct(productId) {
  const productIndex = this.products.findIndex((product) => product.id === productId);
  if (productIndex === -1) {
    throw new Error(`Producto con ID ${productId} no encontrado.`);
  }

  const deletedProduct = this.products.splice(productIndex, 1)[0];

  try {
    this.saveProductsToFile();
  } catch (error) {
    console.error('Error al guardar el producto en el archivo:', error.message);
  }

  return deletedProduct;
}

saveProductsToFile() {
  fs.writeFileSync(filePath, JSON.stringify(this.products, null, 2), 'utf8');
}
}

module.exports = ProductManager;