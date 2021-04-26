-- CREATE DATABASE 
CREATE DATABASE Books_DB;
USE Books_DB;

-- CREATE BOOKS
CREATE TABLE books (
	ISBN VARCHAR(255) PRIMARY KEY, 
    title VARCHAR(255), 
    Author VARCHAR(255), 
    description VARCHAR(255), 
    genre VARCHAR(255), 
    price DECIMAL(7,2), 
    quantity INT
);

INSERT INTO books (ISBN, title, Author, description, genre, price, quantity)
VALUES ("182798094894127", "A Great Title", "Randy Pasch", "A book for alll CMU Freshmen", "Comedy", 19.99, 7);

SELECT * FROM books LIMIT 10;

-- UPDATE books SET ISBN = "2", title = "Book w/id =2" WHERE ISBN = "3";
-- SELECT * FROM books WHERE ISBN = "2" LIMIT 1;

-- CREATE CUSTOMERS
CREATE TABLE customers (
	id INT AUTO_INCREMENT PRIMARY KEY,
    userId VARCHAR(255) UNIQUE, 
    name VARCHAR(255), 
    phone VARCHAR(255), 
    address VARCHAR(255), 
    address2 VARCHAR(255), 
    city VARCHAR(255), 
    state VARCHAR(2), 
    zipcode VARCHAR(5)
);

INSERT INTO customers (userId, name, phone, address, address2, city, state, zipcode)
VALUES ("mk@gmail.com", "Max", "1231231234", "219A Manorhaven Blvd", "Floor 1", "Port Wash", "NY", "11050");

INSERT INTO customers (userId, name, phone, address, city, state, zipcode)
VALUES ("bj@gmail.com", "Bob Jones", "1231231234", "800 Albany Post Road", "New Paltz", "NY", "18261");

SELECT * FROM customers LIMIT 10;
-- SELECT * FROM customers WHERE id = 7 LIMIT 10;

-- DROPs 
DELETE FROM customers; 
DELETE FROM books;