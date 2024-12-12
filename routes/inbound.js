const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  try {
    const [inbounds] = await db.promise().query(
      'SELECT i.*, p.name as product_name FROM inbound i ' +
      'JOIN products p ON i.product_id = p.id ORDER BY date DESC'
    );
    const [products] = await db.promise().query('SELECT * FROM products');
    res.render('inbound/index', { inbounds, products });
  } catch (err) {
    res.status(500).send('Database error');
  }
});

router.post('/', async (req, res) => {
  const { product_id, quantity, supplier } = req.body;
  const conn = await db.promise().getConnection();
  
  try {
    await conn.beginTransaction();
    await conn.query('INSERT INTO inbound (product_id, quantity, supplier) VALUES (?, ?, ?)', 
      [product_id, quantity, supplier]);
    await conn.query('UPDATE products SET stock = stock + ? WHERE id = ?', 
      [quantity, product_id]);
    await conn.commit();
    res.redirect('/inbound');
  } catch (err) {
    await conn.rollback();
    res.status(500).send('Database error');
  } finally {
    conn.release();
  }
});

module.exports = router;