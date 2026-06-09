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
  const [editandoId, setEditandoId] = useState<number | null>(null);

  const cargarProductos = () => {
    api.get("/productos").then((res) => setProductos(res.data));
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const guardarProducto = async (e: React.FormEvent) => {
    e.preventDefault();
    const productoData = {
      nombre,
      precio: parseFloat(precio),
      stock: parseInt(stock),
    };

    if (editandoId) {
      // Editar (enviamos el ID junto con los datos)
      await api.post("/productos", { ...productoData, id: editandoId });
    } else {
      // Crear
      await api.post("/productos", productoData);
    }

    setNombre("");
    setPrecio("");
    setStock("");
    setEditandoId(null);
    cargarProductos();
  };

  const prepararEdicion = (p: Producto) => {
    setEditandoId(p.id);
    setNombre(p.nombre);
    setPrecio(p.precio.toString());
    setStock(p.stock.toString());
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
    setNombre("");
    setPrecio("");
    setStock("");
  };

  const eliminarProducto = async (id: number) => {
    await api.delete(`/productos/${id}`);
    cargarProductos();
  };

  return (
    <div style={{ padding: "40px", maxWidth: "600px", margin: "auto" }}>
      <h1>{editandoId ? "Editar Producto" : "CRUD de Productos"}</h1>

      <form onSubmit={guardarProducto} style={{ marginBottom: "20px" }}>
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
        <button type="submit">{editandoId ? "Actualizar" : "Agregar"}</button>
        {editandoId && (
          <button
            type="button"
            onClick={cancelarEdicion}
            style={{ marginLeft: "10px" }}
          >
            Cancelar
          </button>
        )}
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
                <button onClick={() => prepararEdicion(p)}>Editar</button>
                <button
                  onClick={() => eliminarProducto(p.id)}
                  style={{ marginLeft: "5px" }}
                >
                  Borrar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
