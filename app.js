const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'warehouse_db'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/', require('./routes/dashboard'));
app.use('/products', require('./routes/products'));
app.use('/inbound', require('./routes/inbound'));
app.use('/outbound', require('./routes/outbound'));
app.use('/returns', require('./routes/returns'));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});