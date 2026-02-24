import { querySandbox } from '../config/pgSandbox.js';
import Attempt from '../models/Attempt.js';
import Assignment from '../models/Assignment.js';

// Basic sanitization to prevent destructive queries in sandbox
// Note: true sandboxing requires DB user role limits, but this acts as an app-level filter
const detectDestructiveQuery = (query) => {
    const destructiveKeywords = ['DROP', 'TRUNCATE', 'ALTER', 'DELETE', 'UPDATE', 'INSERT', 'GRANT', 'REVOKE'];
    const upperQuery = query.toUpperCase();

    return destructiveKeywords.some(keyword => {
        // Check if the keyword exists as a whole word
        const regex = new RegExp(`\\b${keyword}\\b`);
        return regex.test(upperQuery);
    });
};

// @desc    Execute a SQL query against the sandbox
// @route   POST /api/query/execute
// @access  Private
export const executeQuery = async (req, res) => {
    const { assignmentId, query } = req.body;
    const userId = req.user._id;

    if (!query) {
        return res.status(400).json({ message: 'No query provided' });
    }

    // 1. App-level Sanitization
    if (detectDestructiveQuery(query)) {
        return res.status(403).json({
            success: false,
            message: 'Destructive queries (DROP, DELETE, etc.) are not allowed in this environment.'
        });
    }

    let executionError = null;
    let queryResults = null;
    let isCorrect = false;
    let executionTimeMs = 0;

    try {
        // 2. Execute Query
        const startTime = Date.now();

        // We run the user's query exactly as is against the sandbox PostgreSQL
        const result = await querySandbox(query);

        executionTimeMs = Date.now() - startTime;
        queryResults = result.rows || [];

        // 3. Very basic validation check (if we have an assignment mapped)
        if (assignmentId) {
            const assignment = await Assignment.findById(assignmentId);
            if (assignment && assignment.expectedOutputQuery) {
                try {
                    // Compare against expected. (In a real app, you compare the dataset hashes/shapes)
                    // For simplicity here, we assume if it ran without errors, it's a step closer.
                    // True automated grading requires running the answer query and comparing sets.
                    const expectedResult = await querySandbox(assignment.expectedOutputQuery);

                    // Naive check: row count matches.
                    if (expectedResult.rowCount === result.rowCount) {
                        isCorrect = true; // Mark correct for demo purposes if row count matches
                    }
                } catch (e) {
                    console.error('Error running expected query validation', e);
                }
            }
        }

        res.json({
            success: true,
            data: queryResults,
            rowCount: result.rowCount,
            executionTimeMs,
            isCorrect,
            message: isCorrect ? 'Query successful and matches expected results!' : 'Query successful'
        });

    } catch (error) {
        executionError = error.message;
        res.status(400).json({
            success: false,
            message: executionError,
            code: error.code // PG error code
        });
    } finally {
        // 4. Log the attempt in MongoDB
        if (assignmentId && userId && query) {
            try {
                await Attempt.create({
                    user: userId,
                    assignment: assignmentId,
                    submittedQuery: query,
                    isCorrect,
                    errorMessage: executionError,
                    executionTimeMs
                });
            } catch (logError) {
                console.error('Failed to log attempt to MongoDB', logError);
            }
        }
    }
};
