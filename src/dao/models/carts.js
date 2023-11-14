const express = require('express');
const router = express.Router();

// Array para almacenar los carritos (simulación de base de datos)
const carts = [];

// Ruta para crear un nuevo carrito
router.post('/', (req, res) => {
    const newCart = {
        id: generateCartId(), // Generar un ID único para el carrito
        products: [],
    };
    carts.push(newCart);
    res.status(201).json(newCart);
});

// Ruta para listar los productos de un carrito por su ID (cid)
router.get('/:cid', (req, res) => {
    const cartId = req.params.cid;
    const cart = carts.find((cart) => cart.id === cartId);

    if (!cart) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    res.json(cart.products);
});

// Ruta para agregar un producto a un carrito por su ID de carrito (cid) y ID de producto (pid)
router.post('/:cid/product/:pid', async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    try {
        const cart = await Cart.findById(cartId);
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }
        const existingProduct = cart.products.find((product) => product.product === productId);
        if (existingProduct) {
            existingProduct.quantity++;
        } else {
            cart.products.push({ product: productId, quantity: 1 });
        }
        await cart.save();
        res.status(201).json(cart.products);
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar el producto al carrito' });
    }
});

    // Verificar si el producto ya existe en el carrito
    const existingProduct = cart.products.find((product) => product.product === productId);

    if (existingProduct) {
        // Si el producto ya existe, incrementar la cantidad
        existingProduct.quantity++;
    } else {
        // Si el producto no existe, agregarlo al carrito
        cart.products.push(productToAdd);
    }

res.status(201).json(cart.products);

// Función para generar un ID único para el carrito
function generateCartId() {
    // Puedes implementar lógica para generar un ID único aquí, por ejemplo, usando un paquete como `uuid`.
    // Por simplicidad, aquí generaremos un ID único basado en un timestamp.
    const timestamp = new Date().getTime();
    const uniqueId = `${timestamp}${Math.floor(Math.random() * 1000)}`;
    return uniqueId;
}


module.exports = router;
