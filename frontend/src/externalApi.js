import axios from 'axios';


const externalApi = axios.create({
  baseURL: 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1',
});

export default externalApi;
