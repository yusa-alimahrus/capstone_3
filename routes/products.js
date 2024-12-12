const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  try {
    const [products] = await db.promise().query('SELECT * FROM products');
    res.render('products/index', { products });
  } catch (err) {
    res.status(500).send('Database error');
  }
});

router.post('/', async (req, res) => {
  const { name, sku } = req.body;
  try {
    await db.promise().query('INSERT INTO products (name, sku) VALUES (?, ?)', [name, sku]);
    res.redirect('/products');
  } catch (err) {
    res.status(500).send('Database error');
  }
});

module.exports = router;