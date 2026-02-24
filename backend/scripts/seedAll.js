import mongoose from 'mongoose';
import pg from 'pg';
import dotenv from 'dotenv';
import Assignment from '../src/models/Assignment.js';

dotenv.config({ path: '../.env' }); // Assuming this is run from the scripts directory or root

// If running from root, dotenv.config() is sufficient if .env is in root.
// Adjust path if necessary. We'll just run it from root.
dotenv.config();

const { Pool } = pg;

const pgPool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const executePgQuery = async (query) => {
    try {
        await pgPool.query(query);
    } catch (err) {
        console.error('Error executing query:', err.message);
        throw err;
    }
};

const pgInitSQL = `
-- Drop existing tables
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS employees CASCADE;
DROP TABLE IF EXISTS departments CASCADE;

-- Create Tables
CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(100)
);

CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE,
    department_id INTEGER REFERENCES departments(id),
    salary INTEGER,
    hire_date DATE
);

CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE,
    country VARCHAR(50)
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    price DECIMAL(10, 2),
    stock INTEGER
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id),
    order_date DATE,
    total_amount DECIMAL(10, 2),
    status VARCHAR(20)
);

CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER,
    unit_price DECIMAL(10, 2)
);

-- Insert Mock Data
INSERT INTO departments (name, location) VALUES
('Engineering', 'New York'),
('Sales', 'London'),
('Marketing', 'Paris'),
('HR', 'Berlin');

INSERT INTO employees (first_name, last_name, email, department_id, salary, hire_date) VALUES
('John', 'Doe', 'j.doe@example.com', 1, 85000, '2020-01-15'),
('Jane', 'Smith', 'j.smith@example.com', 2, 75000, '2021-03-22'),
('Michael', 'Johnson', 'm.johnson@example.com', 1, 95000, '2019-11-05'),
('Emily', 'Williams', 'e.williams@example.com', 3, 68000, '2022-07-01'),
('Robert', 'Brown', 'r.brown@example.com', 2, 82000, '2020-09-10'),
('David', 'Miller', 'd.miller@example.com', 4, 60000, '2023-01-12');

INSERT INTO customers (first_name, last_name, email, country) VALUES
('Alice', 'Johnson', 'alice@customer.com', 'USA'),
('Bob', 'Smith', 'bob@customer.com', 'UK'),
('Charlie', 'Brown', 'charlie@customer.com', 'Canada'),
('Diana', 'Prince', 'diana@customer.com', 'USA'),
('Evan', 'Wright', 'evan@customer.com', 'Australia');

INSERT INTO products (name, category, price, stock) VALUES
('Laptop', 'Electronics', 1200.00, 50),
('Smartphone', 'Electronics', 800.00, 150),
('Desk Chair', 'Furniture', 150.00, 0),
('Monitor', 'Electronics', 300.00, 80),
('Notebook', 'Office', 5.00, 500);

INSERT INTO orders (customer_id, order_date, total_amount, status) VALUES
(1, '2023-10-01', 1200.00, 'Completed'),
(2, '2023-10-05', 800.00, 'Completed'),
(1, '2023-10-15', 305.00, 'Shipped'),
(4, '2023-11-02', 150.00, 'Pending');

INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES
(1, 1, 1, 1200.00),
(2, 2, 1, 800.00),
(3, 4, 1, 300.00),
(3, 5, 1, 5.00),
(4, 3, 1, 150.00);
`;


// --- Helper constants for Schema Contexts in Mongo ---
const employeesSchema = {
    tableName: 'employees',
    columns: [
        { name: 'id', type: 'integer' },
        { name: 'first_name', type: 'varchar' },
        { name: 'last_name', type: 'varchar' },
        { name: 'email', type: 'varchar' },
        { name: 'department_id', type: 'integer' },
        { name: 'salary', type: 'integer' },
        { name: 'hire_date', type: 'date' }
    ],
    sampleData: [
        { id: 1, first_name: 'John', last_name: 'Doe', email: 'j.doe@example.com', department_id: 1, salary: 85000, hire_date: '2020-01-15' },
    ]
};

const departmentsSchema = {
    tableName: 'departments',
    columns: [
        { name: 'id', type: 'integer' },
        { name: 'name', type: 'varchar' },
        { name: 'location', type: 'varchar' }
    ],
    sampleData: [
        { id: 1, name: 'Engineering', location: 'New York' }
    ]
};

const productsSchema = {
    tableName: 'products',
    columns: [
        { name: 'id', type: 'integer' },
        { name: 'name', type: 'varchar' },
        { name: 'category', type: 'varchar' },
        { name: 'price', type: 'decimal' },
        { name: 'stock', type: 'integer' }
    ],
    sampleData: [
        { id: 1, name: 'Laptop', category: 'Electronics', price: 1200.00, stock: 50 }
    ]
};

const customersSchema = {
    tableName: 'customers',
    columns: [
        { name: 'id', type: 'integer' },
        { name: 'first_name', type: 'varchar' },
        { name: 'last_name', type: 'varchar' },
        { name: 'email', type: 'varchar' },
        { name: 'country', type: 'varchar' }
    ],
    sampleData: [
        { id: 1, first_name: 'Alice', last_name: 'Johnson', email: 'alice@customer.com', country: 'USA' }
    ]
};

const ordersSchema = {
    tableName: 'orders',
    columns: [
        { name: 'id', type: 'integer' },
        { name: 'customer_id', type: 'integer' },
        { name: 'order_date', type: 'date' },
        { name: 'total_amount', type: 'decimal' },
        { name: 'status', type: 'varchar' }
    ],
    sampleData: [
        { id: 1, customer_id: 1, order_date: '2023-10-01', total_amount: 1200.00, status: 'Completed' }
    ]
};


// 20 Assignments
const assignmentsData = [
    {
        title: '1. Basic SELECT: All Employees',
        description: 'Retrieve all columns from the `employees` table.',
        difficulty: 'Easy',
        estimatedTime: '5 mins',
        tableCount: 1,
        schemaDetails: [employeesSchema],
        expectedOutputQuery: 'SELECT * FROM employees;'
    },
    {
        title: '2. Select Specific Columns',
        description: 'Retrieve only the `first_name`, `last_name`, and `email` of all employees.',
        difficulty: 'Easy',
        estimatedTime: '5 mins',
        tableCount: 1,
        schemaDetails: [employeesSchema],
        expectedOutputQuery: 'SELECT first_name, last_name, email FROM employees;'
    },
    {
        title: '3. Filtering with WHERE',
        description: 'Find all employees who work in `department_id` 1.',
        difficulty: 'Easy',
        estimatedTime: '5 mins',
        tableCount: 1,
        schemaDetails: [employeesSchema],
        expectedOutputQuery: 'SELECT * FROM employees WHERE department_id = 1;'
    },
    {
        title: '4. Mathematical Operators',
        description: 'Find all products with a price greater than $500.',
        difficulty: 'Easy',
        estimatedTime: '5 mins',
        tableCount: 1,
        schemaDetails: [productsSchema],
        expectedOutputQuery: 'SELECT * FROM products WHERE price > 500;'
    },
    {
        title: '5. Using AND / OR',
        description: 'Find all employees who earn more than 70,000 AND work in department 2.',
        difficulty: 'Easy',
        estimatedTime: '10 mins',
        tableCount: 1,
        schemaDetails: [employeesSchema],
        expectedOutputQuery: 'SELECT * FROM employees WHERE salary > 70000 AND department_id = 2;'
    },
    {
        title: '6. The IN Operator',
        description: 'Find customers located in either the USA or Canada.',
        difficulty: 'Easy',
        estimatedTime: '5 mins',
        tableCount: 1,
        schemaDetails: [customersSchema],
        expectedOutputQuery: "SELECT * FROM customers WHERE country IN ('USA', 'Canada');"
    },
    {
        title: '7. Pattern Matching with LIKE',
        description: 'Find all products where the category starts with "E".',
        difficulty: 'Easy',
        estimatedTime: '10 mins',
        tableCount: 1,
        schemaDetails: [productsSchema],
        expectedOutputQuery: "SELECT * FROM products WHERE category LIKE 'E%';"
    },
    {
        title: '8. Sorting Results',
        description: 'Retrieve all employees, sorted by their salary from highest to lowest (descending).',
        difficulty: 'Easy',
        estimatedTime: '5 mins',
        tableCount: 1,
        schemaDetails: [employeesSchema],
        expectedOutputQuery: 'SELECT * FROM employees ORDER BY salary DESC;'
    },
    {
        title: '9. Limiting Results',
        description: 'Find the top 3 most expensive products.',
        difficulty: 'Easy',
        estimatedTime: '5 mins',
        tableCount: 1,
        schemaDetails: [productsSchema],
        expectedOutputQuery: 'SELECT * FROM products ORDER BY price DESC LIMIT 3;'
    },
    {
        title: '10. Aggregate: COUNT',
        description: 'Calculate the total number of orders placed.',
        difficulty: 'Easy',
        estimatedTime: '5 mins',
        tableCount: 1,
        schemaDetails: [ordersSchema],
        expectedOutputQuery: 'SELECT COUNT(*) FROM orders;'
    },
    {
        title: '11. Aggregate: AVG & SUM',
        description: 'Calculate the average price of all products and name the column "avg_price".',
        difficulty: 'Medium',
        estimatedTime: '10 mins',
        tableCount: 1,
        schemaDetails: [productsSchema],
        expectedOutputQuery: 'SELECT AVG(price) as avg_price FROM products;'
    },
    {
        title: '12. GROUP BY',
        description: 'Find the total number of products in each category.',
        difficulty: 'Medium',
        estimatedTime: '15 mins',
        tableCount: 1,
        schemaDetails: [productsSchema],
        expectedOutputQuery: 'SELECT category, COUNT(*) FROM products GROUP BY category;'
    },
    {
        title: '13. Filtering Groups with HAVING',
        description: 'Find categories that have more than 1 product.',
        difficulty: 'Medium',
        estimatedTime: '15 mins',
        tableCount: 1,
        schemaDetails: [productsSchema],
        expectedOutputQuery: 'SELECT category, COUNT(*) FROM products GROUP BY category HAVING COUNT(*) > 1;'
    },
    {
        title: '14. INNER JOIN Basics',
        description: 'Retrieve a list of all employees and the name of the department they work in.',
        difficulty: 'Medium',
        estimatedTime: '15 mins',
        tableCount: 2,
        schemaDetails: [employeesSchema, departmentsSchema],
        expectedOutputQuery: 'SELECT e.first_name, e.last_name, d.name AS department_name FROM employees e INNER JOIN departments d ON e.department_id = d.id;'
    },
    {
        title: '15. LEFT JOIN',
        description: 'Retrieve all products and any order quantities. If a product hasn\'t been ordered, it should still appear with a NULL quantity.',
        difficulty: 'Medium',
        estimatedTime: '20 mins',
        tableCount: 2,
        schemaDetails: [productsSchema, { tableName: 'order_items', columns: [{ name: 'product_id', type: 'integer' }, { name: 'quantity', type: 'integer' }] }],
        expectedOutputQuery: 'SELECT p.name, oi.quantity FROM products p LEFT JOIN order_items oi ON p.id = oi.product_id;'
    },
    {
        title: '16. Null Checking',
        description: 'Find all products that have exactly Zero stock (stock = 0).',
        difficulty: 'Easy',
        estimatedTime: '5 mins',
        tableCount: 1,
        schemaDetails: [productsSchema],
        expectedOutputQuery: 'SELECT * FROM products WHERE stock = 0;'
    },
    {
        title: '17. Multi-table JOINS',
        description: 'Retrieve the first name of the customer, the order date, and the total amount for all orders.',
        difficulty: 'Hard',
        estimatedTime: '25 mins',
        tableCount: 2,
        schemaDetails: [customersSchema, ordersSchema],
        expectedOutputQuery: 'SELECT c.first_name, o.order_date, o.total_amount FROM customers c JOIN orders o ON c.id = o.customer_id;'
    },
    {
        title: '18. Subqueries in WHERE',
        description: 'Find the names of employees who earn more than the average salary of all employees.',
        difficulty: 'Hard',
        estimatedTime: '25 mins',
        tableCount: 1,
        schemaDetails: [employeesSchema],
        expectedOutputQuery: 'SELECT first_name, last_name, salary FROM employees WHERE salary > (SELECT AVG(salary) FROM employees);'
    },
    {
        title: '19. String Functions: CONCAT',
        description: 'Combine the first name and last name of customers into a single column called "full_name".',
        difficulty: 'Medium',
        estimatedTime: '10 mins',
        tableCount: 1,
        schemaDetails: [customersSchema],
        expectedOutputQuery: "SELECT CONCAT(first_name, ' ', last_name) AS full_name FROM customers;"
    },
    {
        title: '20. DISTINCT values',
        description: 'Retrieve a list of all unique countries our customers are located in.',
        difficulty: 'Easy',
        estimatedTime: '5 mins',
        tableCount: 1,
        schemaDetails: [customersSchema],
        expectedOutputQuery: 'SELECT DISTINCT country FROM customers;'
    }
];

const runSeed = async () => {
    try {
        console.log('--- Starting comprehensive DB seeding ---');

        // 1. PostgreSQL specific tables
        console.log('1. Recreating PostgreSQL Schema and Mock Data...');
        await executePgQuery(pgInitSQL);
        console.log('   -> Postgres Seeded Successfully.');

        // 2. MongoDB Specific mappings
        console.log('2. Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);

        console.log('   -> Clearing MongoDB Assignment Collection...');
        await Assignment.deleteMany();

        console.log('   -> Inserting 20 Assignments...');
        await Assignment.insertMany(assignmentsData);
        console.log('   -> MongoDB Seeded Successfully.');

        console.log('--- Seeding Complete! ---');
        process.exit(0);

    } catch (err) {
        console.error('Migration failed:', err.message);
        process.exit(1);
    }
};

runSeed();
