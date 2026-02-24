import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        difficulty: {
            type: String,
            enum: ['Easy', 'Medium', 'Hard'],
            required: true,
        },
        estimatedTime: {
            type: String,
            required: true,
        },
        tableCount: {
            type: Number,
            required: true,
            default: 1,
        },
        schemaDetails: [
            {
                tableName: String,
                columns: [
                    {
                        name: String,
                        type: { type: String },
                    }
                ],
                sampleData: [mongoose.Schema.Types.Mixed]
            }
        ],
        expectedOutputQuery: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true,
    }
);

const Assignment = mongoose.model('Assignment', assignmentSchema);
export default Assignment;
