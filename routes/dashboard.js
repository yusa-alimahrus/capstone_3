const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  try {
    const [products] = await db.promise().query(
      'SELECT p.*, ' +
      '(SELECT SUM(quantity) FROM inbound WHERE product_id = p.id) as total_in, ' +
      '(SELECT SUM(quantity) FROM outbound WHERE product_id = p.id) as total_out ' +
      'FROM products p'
    );
    
    res.render('dashboard', { products });
  } catch (err) {
    res.status(500).send('Database error');
  }
});

module.exports = router;