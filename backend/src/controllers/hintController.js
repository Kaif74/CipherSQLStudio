import { GoogleGenAI } from '@google/genai';
import Assignment from '../models/Assignment.js';


const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const generateHint = async (req, res) => {
    const { assignmentId, currentQuery } = req.body;

    if (!assignmentId) {
        return res.status(400).json({ message: 'Assignment ID is required' });
    }

    try {
        const assignment = await Assignment.findById(assignmentId);

        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        const schemaDetailsString = JSON.stringify(assignment.schemaDetails, null, 2);

        const prompt = `
      You are an expert AI SQL tutor. You are helping a student with the following SQL assignment:
      
      TITLE: ${assignment.title}
      DESCRIPTION: ${assignment.description}
      
      DATABASE SCHEMA CONTEXT (Tables & Columns):
      ${schemaDetailsString}
      
      The student's current query is:
      \`\`\`sql
      ${currentQuery || '-- No query written yet'}
      \`\`\`
      
      YOUR TASK:
      Provide a helpful, educational hint to guide the student towards the correct answer. 
      CRITICAL INSTRUCTIONS:
      1. DO NOT provide the fully correct SQL query in your response.
      2. Keep it concise (1-3 sentences).
      3. If their current query has a syntax error or logical flaw, point it out gently without fixing it completely for them.
      4. If they have no query yet, give them a hint on which tables they need to look at and what clauses (e.g., SELECT, WHERE, JOIN) they should start with.
    `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        const hintText = response.text || 'I could not generate a hint at this time, try again.';

        res.json({
            success: true,
            hint: hintText
        });

    } catch (error) {
        console.error('LLM API Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate hint',
            error: error.message
        });
    }
};
