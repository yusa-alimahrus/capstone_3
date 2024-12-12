const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  try {
    const [outbounds] = await db.promise().query(
      'SELECT o.*, p.name as product_name FROM outbound o ' +
      'JOIN products p ON o.product_id = p.id ORDER BY date DESC'
    );
    const [products] = await db.promise().query('SELECT * FROM products');
    res.render('outbound/index', { outbounds, products });
  } catch (err) {
    res.status(500).send('Database error');
  }
});

router.post('/', async (req, res) => {
  const { product_id, quantity, customer } = req.body;
  const conn = await db.promise().getConnection();
  
  try {
    await conn.beginTransaction();
    await conn.query('INSERT INTO outbound (product_id, quantity, customer) VALUES (?, ?, ?)', 
      [product_id, quantity, customer]);
    await conn.query('UPDATE products SET stock = stock - ? WHERE id = ?', 
      [quantity, product_id]);
    await conn.commit();
    res.redirect('/outbound');
  } catch (err) {
    await conn.rollback();
    res.status(500).send('Database error');
  } finally {
    conn.release();
  }
});

module.exports = router;