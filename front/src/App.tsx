import { useEffect, useState } from "react";
import api from "./api";

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
}

function App() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");

  const cargarProductos = () => {
    api.get("/productos").then((res) => setProductos(res.data));
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const crearProducto = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post("/productos", {
      nombre,
      precio: parseFloat(precio),
      stock: parseInt(stock),
    });
    setNombre("");
    setPrecio("");
    setStock("");
    cargarProductos();
  };

  const eliminarProducto = async (id: number) => {
    await api.delete(`/productos/${id}`);
    cargarProductos();
  };

  return (
    <div style={{ padding: "40px", maxWidth: "600px", margin: "auto" }}>
      <h1>CRUD de Productos</h1>

      <form onSubmit={crearProducto} style={{ marginBottom: "20px" }}>
        <input
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
        <input
          placeholder="Precio"
          type="number"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
          required
        />
        <input
          placeholder="Stock"
          type="number"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          required
        />
        <button type="submit">Agregar</button>
      </form>

      <table border={1} style={{ width: "100%", textAlign: "left" }}>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((p) => (
            <tr key={p.id}>
              <td>{p.nombre}</td>
              <td>${p.precio}</td>
              <td>{p.stock}</td>
              <td>
                <button onClick={() => eliminarProducto(p.id)}>Borrar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
