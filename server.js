const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 80;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Initialize MySQL database connection
const db = mysql.createPool({
  host: 'database-1-labs-despliegue.c5wi6w2qyi6s.us-east-1.rds.amazonaws.com',
  user: 'admin',
  port: 3306,
  password: 'uK0hdGhPV69YsTXPLPGe',
  database: 'Labs_AWS'
});

// Crear tabla y datos de ejemplo si no existen
db.query(`
  CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )
`, (err) => {
  if (err) {
    console.error('Error creando la tabla:', err.message);
    return;
  }
  // Verificar si hay productos, si no, insertar datos de ejemplo
  db.query('SELECT COUNT(*) as count FROM products', (err, results) => {
    if (err) {
      console.error('Error verificando productos:', err.message);
      return;
    }
    if (results[0].count === 0) {
      const sampleProducts = [
        ['Laptop Pro', 'Electronics', 15, 1299.99, 'High-performance laptop'],
        ['Wireless Mouse', 'Electronics', 45, 29.99, 'Ergonomic wireless mouse'],
        ['Office Chair', 'Furniture', 8, 199.99, 'Comfortable office chair'],
        ['Coffee Beans', 'Food', 120, 12.99, 'Premium coffee beans'],
        ['Notebook Set', 'Office Supplies', 200, 8.99, 'Pack of 3 notebooks']
      ];
      db.query(
        'INSERT INTO products (name, category, quantity, price, description) VALUES (?, ?, ?, ?, ?), (?, ?, ?, ?, ?), (?, ?, ?, ?, ?), (?, ?, ?, ?, ?), (?, ?, ?, ?, ?)',
        sampleProducts.flat(),
        (err) => {
          if (err) {
            console.error('Error insertando productos de ejemplo:', err.message);
          }
        }
      );
    }
  });
});

// API Routes
app.get('/api/products', (req, res) => {
  db.query('SELECT * FROM products ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.get('/api/products/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM products WHERE id = ?', [id], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!rows.length) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    res.json(rows[0]);
  });
});

app.post('/api/products', (req, res) => {
  const { name, category, quantity, price, description } = req.body;
  
  if (!name || !category || quantity === undefined || price === undefined) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  db.query(
    'INSERT INTO products (name, category, quantity, price, description) VALUES (?, ?, ?, ?, ?)',
    [name, category, quantity, price, description],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: result.insertId, message: 'Product created successfully' });
    }
  );
});

app.put('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const { name, category, quantity, price, description } = req.body;
  
  db.query(
    'UPDATE products SET name = ?, category = ?, quantity = ?, price = ?, description = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [name, category, quantity, price, description, id],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (result.affectedRows === 0) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }
      res.json({ message: 'Product updated successfully' });
    }
  );
});

app.delete('/api/products/:id', (req, res) => {
  const { id } = req.params;
  
  db.query('DELETE FROM products WHERE id = ?', [id], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    res.json({ message: 'Product deleted successfully' });
  });
});

// Dashboard stats
app.get('/api/stats', (req, res) => {
  db.query(`
    SELECT 
      COUNT(*) as total_products,
      SUM(quantity) as total_items,
      COUNT(DISTINCT category) as categories,
      SUM(quantity * price) as total_value
    FROM products
  `, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows[0]);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});