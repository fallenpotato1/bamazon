DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon; 
USE bamazon;

CREATE TABLE products(
	item_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(45) NOT NULL,
    department_name VARCHAR(45) NOT NULL,
    price DECIMAL(6,2) NOT NULL,
    stock_quantity INT NOT NULL
);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("playstation 4", "video games", 199.00, 40),
	   ("xbox one", "video games", 199.00, 50),
       ("pokemon booster pack", "card games", 3.99, 100),
       ("acer laptop", "electronics", 450.50, 20),
       ("valentina", "food", 2.09, 300),
       ("sony xperia xz2", "electronics", 499.00, 30),
       ("gaming chair", "gaming accessories", 57.00, 40),
       ("55' samsung tv", "electronics", 499.00, 55),
       ("light bulb", "home", 3.99, 2),
       ("water pipe", "recreation", 40.20, 400);
       
SELECT item_id, product_name, department_name, price
FROM products;       