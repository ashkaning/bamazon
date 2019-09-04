DROP DATABASE IF EXISTS bamazon; 
create database bamazon;
use bamazon;
create table products (
item_id int(10) auto_increment not null,
product_name varchar(60),
department_name varchar(60),
price DECIMAL(10,2),
stock_quantity int(10),
primary key(item_id)
);