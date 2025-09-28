# Inventory Manager

Inventory Manager es una aplicación web para la gestión de inventario, construida con React (CDN), Express y MySQL. Permite agregar, editar, eliminar y buscar productos, mostrando estadísticas en tiempo real.

## Características

- CRUD de productos (nombre, categoría, cantidad, precio, descripción)
- Filtros por búsqueda y categoría
- Estadísticas de dashboard: total de productos, ítems, categorías y valor total
- Interfaz moderna con TailwindCSS y FontAwesome
- Backend con Express y MySQL

## Estructura del Proyecto

```
.
├── LICENSE.txt
├── package-lock.json
├── package.json
├── server.js
├── public/
│   ├── app.js
│   ├── index.html
│   ├── manifest.json
│   └── sw.js
```

## Instalación

1. **Clona el repositorio**
2. **Instala dependencias**
   ```
   npm install
   ```
3. **Configura la base de datos**
   - El proyecto usa MySQL. Por defecto, conecta a una instancia remota (ver credenciales en [`server.js`](server.js)).
   - Al iniciar, crea la tabla `products` y agrega datos de ejemplo si está vacía.

4. **Inicia el servidor**
   ```
   npm start
   ```
   El servidor corre en el puerto 80 por defecto.

## Uso

- Accede a `http://localhost:80/` en tu navegador.
- Agrega, edita, elimina y busca productos.
- El dashboard muestra estadísticas en tiempo real.

## Detalles Técnicos

- **Frontend:** [`public/app.js`](public/app.js) (React via CDN, Babel in-browser)
- **Backend:** [`server.js`](server.js) (Express, MySQL)
- **Estilos:** TailwindCSS y FontAwesome vía CDN
- **API REST:**
  - `GET /api/products` — Lista productos
  - `GET /api/products/:id` — Producto por ID
  - `POST /api/products` — Crear producto
  - `PUT /api/products/:id` — Editar producto
  - `DELETE /api/products/:id` — Eliminar producto
  - `GET /api/stats` — Estadísticas de dashboard

## Scripts

- `npm start` — Inicia el servidor Express

## Licencia

Este proyecto está bajo la licencia MIT. Consulta el archivo [`LICENSE.txt`](LICENSE.txt) para más detalles.

---

**Autor:**  
(uade - Ingeniería de Software)