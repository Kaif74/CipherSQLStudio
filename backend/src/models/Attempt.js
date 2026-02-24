import mongoose from 'mongoose';

const attemptSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        assignment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Assignment',
            required: true,
        },
        submittedQuery: {
            type: String,
            required: true,
        },
        isCorrect: {
            type: Boolean,
            required: true,
            default: false,
        },
        errorMessage: {
            type: String,
            default: null,
        },
        executionTimeMs: {
            type: Number,
            default: 0,
        }
    },
    {
        timestamps: true,
    }
);

const Attempt = mongoose.model('Attempt', attemptSchema);
export default Attempt;
