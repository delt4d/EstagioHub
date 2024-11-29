import axios from 'axios';
const axiosRequest = axios.create ({
    baseURL : 'http://localhost:8000',
    withCredentials: true
})

axiosRequest.defaults.headers.post['Content-Type'] = 'application/json';

export default axiosRequest;