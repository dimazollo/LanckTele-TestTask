import axios from 'axios';

export const httpClient = axios.create({
  baseURL: '/api/',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 1000,
});
