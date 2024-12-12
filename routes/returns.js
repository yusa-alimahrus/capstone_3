const express = require('express');
const router = express.Router();
const db = require('../db');

// Customer Returns
router.get('/customer', async (req, res) => {
  try {
    const [returns] = await db.promise().query(
      'SELECT r.*, p.name as product_name FROM customer_returns r ' +
      'JOIN products p ON r.product_id = p.id ORDER BY date DESC'
    );
    const [products] = await db.promise().query('SELECT * FROM products');
    res.render('returns/customer', { returns, products });
  } catch (err) {
    res.status(500).send('Database error');
  }
});

router.post('/customer', async (req, res) => {
  const { product_id, quantity, customer, reason } = req.body;
  const conn = await db.promise().getConnection();
  
  try {
    await conn.beginTransaction();
    await conn.query(
      'INSERT INTO customer_returns (product_id, quantity, customer, reason) VALUES (?, ?, ?, ?)', 
      [product_id, quantity, customer, reason]
    );
    await conn.query('UPDATE products SET stock = stock + ? WHERE id = ?', 
      [quantity, product_id]);
    await conn.commit();
    res.redirect('/returns/customer');
  } catch (err) {
    await conn.rollback();
    res.status(500).send('Database error');
  } finally {
    conn.release();
  }
});

// Supplier Returns
router.get('/supplier', async (req, res) => {
  try {
    const [returns] = await db.promise().query(
      'SELECT r.*, p.name as product_name FROM supplier_returns r ' +
      'JOIN products p ON r.product_id = p.id ORDER BY date DESC'
    );
    const [products] = await db.promise().query('SELECT * FROM products');
    res.render('returns/supplier', { returns, products });
  } catch (err) {
    res.status(500).send('Database error');
  }
});

router.post('/supplier', async (req, res) => {
  const { product_id, quantity, supplier, reason } = req.body;
  const conn = await db.promise().getConnection();
  
  try {
    await conn.beginTransaction();
    await conn.query(
      'INSERT INTO supplier_returns (product_id, quantity, supplier, reason) VALUES (?, ?, ?, ?)', 
      [product_id, quantity, supplier, reason]
    );
    await conn.query('UPDATE products SET stock = stock - ? WHERE id = ?', 
      [quantity, product_id]);
    await conn.commit();
    res.redirect('/returns/supplier');
  } catch (err) {
    await conn.rollback();
    res.status(500).send('Database error');
  } finally {
    conn.release();
  }
});

module.exports = router;