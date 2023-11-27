import axios from 'axios';
import { fflapi } from './ffl';

let refreshPromise = null;
const clearPromise = () => refreshPromise = null;

async function renewToken() {
    const accessToken = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await fflapi.post('/authenticate/refreshToken', { accessToken, refreshToken });
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;
    return [newAccessToken, newRefreshToken];
}

const fflInterceptors = (navigate) => {
    // Add a request interceptor
    fflapi.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    // Add a response interceptor
    fflapi.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;

            // If the error status is 401 and there is no originalRequest._retry flag,
            // it means the token has expired and we need to refresh it
            if ((error?.response?.status === 401 || error?.response?.status === 403) && !originalRequest._retry) {
                originalRequest._retry = true;

                try {
                    if (!refreshPromise) {
                        refreshPromise = renewToken().finally(clearPromise);
                    }
                    const [newAccessToken, newRefreshToken] = await refreshPromise;

                    localStorage.setItem('token', newAccessToken);
                    localStorage.setItem('refreshToken', newRefreshToken);

                    // Retry the original request with the new token
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return axios(originalRequest);
                } catch (error) {
                    // Handle refresh token error or redirect to login
                    console.log("request failed", error);
                    navigate(`/Login?error=${error?.code}`);
                }
            }
            console.log(error);
            return Promise.reject(error);
        }
    );
};

export default fflInterceptors;