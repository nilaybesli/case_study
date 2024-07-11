INSERT INTO customer (name) VALUES 
('John Smith'),
('Emily Johnson'),
('Michael Brown'),
('Jane Smith'),
('Alice Johnson');


INSERT INTO product (product_name, category, price) VALUES 
('Laptop', 'Electronics', 1500),
('Smartphone', 'Electronics', 800),
('Book', 'Stationery', 20),
('Tablet', 'Electronics', 299.99);


INSERT INTO duration (duration_name, month, year) VALUES 
('January 2023', 1, 2023),
('February 2023', 2, 2023),
('March 2023', 3, 2023);

INSERT INTO sales (customer_id, product_id, duration_id, amount) VALUES 
(1, 2, 3, 650),
(2, 3, 1, 200),
(3, 1, 2, 100);
