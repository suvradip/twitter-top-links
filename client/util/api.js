import axios from 'axios';

const isProd = process.env.NODE_ENV === 'production';
const port = process.env.PORT || '8080';
console.log(process.env);

const API_ROOT = isProd ? '/api/v1' : `http://localhost:${port}/api/v1`;

const instance = axios.create({
   baseURL: API_ROOT,
});

instance.interceptors.request.use((config) => {
   const token = localStorage.getItem('twitterUserName');
   // eslint-disable-next-line no-param-reassign
   config.headers.Authorization = token ? `Bearer ${token}` : '';
   return config;
});

const limitOffset = (count, p) => `limit=${count}&offset=${p ? p * count : 0}`;
const responseBody = (res) => res.data;

const tweets = {
   getAll: ({ page, limit = 10, query = '' }) =>
      instance.get(`/tweets/?${limitOffset(limit, page)}&query=${encodeURIComponent(query)}`).then(responseBody),
};

const users = {
   getAll: () => instance.get(`/users/`).then(responseBody),
   logout: () => instance.get(`/auth/logout`).then(responseBody),
};

const domains = {
   getAll: (page) => instance.get(`/users/?${limitOffset(10, page)}`).then(responseBody),
};

export default {
   tweets,
   users,
   domains,
};
