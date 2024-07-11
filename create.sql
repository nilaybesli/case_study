
CREATE TABLE customer (
    customer_id SERIAL PRIMARY KEY,
    name VARCHAR(50)
);

CREATE TABLE product (
    product_id SERIAL PRIMARY KEY,
    product_name VARCHAR(50),
    category VARCHAR(50),
    price NUMERIC
);

CREATE TABLE duration (
    duration_id SERIAL PRIMARY KEY,
    duration_name VARCHAR(50),
    month INT,
    year INT
);

CREATE TABLE sales (
   sales_id SERIAL PRIMARY KEY,
   customer_id INT,
   product_id INT,
   duration_id INT,
   amount NUMERIC,
   FOREIGN KEY (customer_id) REFERENCES customer(customer_id),
   FOREIGN KEY (product_id) REFERENCES product(product_id),
   FOREIGN KEY (duration_id) REFERENCES duration(duration_id)
);
ALTER DATABASE test_db SET client_encoding TO 'UTF8';
