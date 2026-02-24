import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Assignment from './src/models/Assignment.js';
import User from './src/models/User.js';

dotenv.config();

const sampleAssignments = [
    {
        title: '1. Basic SELECT Statements',
        description: 'Retrieve all columns from the `employees` table.',
        difficulty: 'Easy',
        estimatedTime: '10 mins',
        tableCount: 1,
        schemaDetails: [
            {
                tableName: 'employees',
                columns: [
                    { name: 'id', type: 'integer' },
                    { name: 'first_name', type: 'varchar' },
                    { name: 'last_name', type: 'varchar' },
                    { name: 'department', type: 'varchar' },
                    { name: 'salary', type: 'integer' }
                ],
                sampleData: [
                    { id: 1, first_name: 'John', last_name: 'Doe', department: 'Engineering', salary: 85000 },
                    { id: 2, first_name: 'Jane', last_name: 'Smith', department: 'Sales', salary: 75000 },
                ]
            }
        ],
        expectedOutputQuery: 'SELECT * FROM employees;'
    },
    {
        title: '2. Filtering & Sorting Data',
        description: 'Retrieve all `employees` in the "Engineering" department, sorted by salary descending.',
        difficulty: 'Easy',
        estimatedTime: '15 mins',
        tableCount: 1,
        schemaDetails: [
            {
                tableName: 'employees',
                columns: [
                    { name: 'id', type: 'integer' },
                    { name: 'first_name', type: 'varchar' },
                    { name: 'last_name', type: 'varchar' },
                    { name: 'department', type: 'varchar' },
                    { name: 'salary', type: 'integer' }
                ],
                sampleData: [
                    { id: 1, first_name: 'John', last_name: 'Doe', department: 'Engineering', salary: 85000 },
                    { id: 3, first_name: 'Bob', last_name: 'Johnson', department: 'Engineering', salary: 92000 },
                ]
            }
        ],
        expectedOutputQuery: "SELECT * FROM employees WHERE department = 'Engineering' ORDER BY salary DESC;"
    }
];

const importData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        await Assignment.deleteMany();
        await User.deleteMany();

        await Assignment.insertMany(sampleAssignments);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

importData();
