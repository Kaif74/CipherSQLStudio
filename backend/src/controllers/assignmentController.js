import Assignment from '../models/Assignment.js';

// @desc    Fetch all assignments
// @route   GET /api/assignments
// @access  Public (or Private depending on requirements, assuming public for listing)
export const getAssignments = async (req, res) => {
    try {
        const assignments = await Assignment.find({});
        res.json(assignments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Fetch single assignment by ID
// @route   GET /api/assignments/:id
// @access  Public
export const getAssignmentById = async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.id);

        if (assignment) {
            res.json(assignment);
        } else {
            res.status(404).json({ message: 'Assignment not found' });
        }
    } catch (error) {
        if (error.kind === 'ObjectId') {
            res.status(404).json({ message: 'Assignment not found' });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
};
