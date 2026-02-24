import api from './api';

export const getAssignments = async () => {
    const response = await api.get('/assignments');
    return response.data;
};

export const getAssignmentById = async (id) => {
    const response = await api.get(`/assignments/${id}`);
    return response.data;
};
