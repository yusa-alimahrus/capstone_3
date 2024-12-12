CREATE DATABASE IF NOT EXISTS warehouse_db;
USE warehouse_db;

CREATE TABLE products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  sku VARCHAR(50) UNIQUE NOT NULL,
  stock INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE inbound (
  id INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT,
  quantity INT NOT NULL,
  supplier VARCHAR(255),
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE outbound (
  id INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT,
  quantity INT NOT NULL,
  customer VARCHAR(255),
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE customer_returns (
  id INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT,
  quantity INT NOT NULL,
  customer VARCHAR(255),
  reason TEXT,
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE supplier_returns (
  id INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT,
  quantity INT NOT NULL,
  supplier VARCHAR(255),
  reason TEXT,
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id)
);