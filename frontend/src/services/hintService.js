import api from './api';

export const generateHint = async (assignmentId, currentQuery) => {
    const response = await api.post('/hints/generate', { assignmentId, currentQuery });
    return response.data;
};
