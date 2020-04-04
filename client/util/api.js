import axios from 'axios';

const isProd = process.env.NODE_ENV === 'production';
const port = process.env.PORT || '8080';

const API_ROOT = isProd ? '/' : `http://localhost:${port}/api/v1`;

const limitOffset = (count, p) => `limit=${count}&offset=${p ? p * count : 0}`;
const responseBody = (res) => res.data;

const tweets = {
   getAll: ({ page, limit = 10, query = '' }) =>
      axios
         .get(`${API_ROOT}/tweets/?${limitOffset(limit, page)}&query=${encodeURIComponent(query)}`)
         .then(responseBody),
};

const users = {
   getAll: () => axios.get(`${API_ROOT}/users/`).then(responseBody),
};

const domains = {
   getAll: (page) => axios.get(`${API_ROOT}/users/?${limitOffset(10, page)}`).then(responseBody),
};

export default {
   tweets,
   users,
   domains,
};
