import axios from "axios";
import { BASE_BACK_END_URL, DEFAULT_TIMEOUT, RESPONSE_DELAY } from "../constants";

const apiFile = axios.create({
    baseURL: BASE_BACK_END_URL,
    headers: {
        "Content-Type": "multipart/form-data"
    },
})
apiFile.defaults.timeout = DEFAULT_TIMEOUT;
apiFile.interceptors.request.use(config => {
    const token = localStorage.getItem("access_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`API request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
},
    error => {
        console.error(`Request error: ${error}`)
        return Promise.reject(error);
    }
);

apiFile.interceptors.response.use(
    async (response) => {
        await new Promise(resolve => setTimeout(resolve, RESPONSE_DELAY));
        console.log(`API response: ${response.status} ${response.config.url}`);
        return response;
    },
    error => {
        if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
            console.log('Request timed out');
        }
        return Promise.reject(error);
    }
);

export default apiFile;