
// Crear una instancia de ProductManager
const productManager = new productManager();

// Llamar al método addProduct con los campos especificados
const newProduct = productManager.addProduct(
  "Producto Prueba",
  "Este es un producto prueba",
  200,
  "Sin imagen",
  "abc123",
  25
);

// Obtener la lista de productos (incluyendo el producto recién agregado)
const productsList = productManager.getProducts();

// Ver la lista de productos
console.log("Lista de productos:");
productsList.forEach((product) => {
  console.log(product.toString());
});
