import api from './api';

export const executeQuery = async (assignmentId, query) => {
    const response = await api.post('/query/execute', { assignmentId, query });
    return response.data;
};
