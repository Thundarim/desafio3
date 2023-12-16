const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs").promises;
const app = express();
const port = 8080;
app.use(bodyParser.json());
app.get("/products", async (req, res) => {
    try {
        const products = await getProducts();
        const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
        if (limit) {
            res.json(products.slice(0, limit));
        } else {
            res.json(products);
        }
    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});
app.get("/products/:id", async (req, res) => {
    try {
        const productId = parseInt(req.params.id);
        const product = await getProductById(productId);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: "Producto no encontrado" });
        }
    } catch (error) {
        console.error("Error al obtener producto por ID:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});
//iniciar servidor
app.listen(port, async () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
    try {
        const products = await getProducts();
        if (products.length < 10) {
            console.log("Agregando productos de ejemplo...");
            await addExampleProducts();
        }
    } catch (error) {
        console.error("Error al verificar productos:", error);
    }
});
// Función para obtener todos los productos
async function getProducts() {
    const respuesta = await fs.readFile("./productos.json", "utf-8");
    const arrayProductos = JSON.parse(respuesta);
    return arrayProductos;
}
// Función para obtener un producto por ID
async function getProductById(id) {
    const arrayProductos = await getProducts();
    const buscado = arrayProductos.find(item => item.id === id);
    return buscado;
}