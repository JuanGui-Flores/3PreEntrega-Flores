
// Crear una instancia de ProductManager
const ProductManager = new ProductManager();

// Llamar al método addProduct con los campos especificados
const newProduct = ProductManager.addProduct(
  "Producto Prueba",
  "Este es un producto prueba",
  200,
  "Sin imagen",
  "abc123",
  25
);

// Obtener la lista de productos (incluyendo el producto recién agregado)
const productsList = ProductManager.getProducts();

// Ver la lista de productos
console.log("Lista de productos:");
productsList.forEach((product) => {
  console.log(product.toString());
});
