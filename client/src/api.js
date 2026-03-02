import axios from 'axios';

const API_BASE = '/api/todos';

export const getTodos = () => axios.get(API_BASE);
export const createTodo = (title) => axios.post(API_BASE, { title });
export const updateTodo = (id, data) => axios.put(`${API_BASE}/${id}`, data);
export const deleteTodo = (id) => axios.delete(`${API_BASE}/${id}`);
