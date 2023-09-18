

// File này để customize axios -> để can thiệp vào trước khi gọi API, hay là gán lại token (mã thông báo, mã nhận dạng)

import axios from "axios";

const baseURL = import.meta.env.VITE_BACKEND_URL

const instance = axios.create({
    baseURL: baseURL, // URL của phía Back-End
    withCredentials: true // Credentials: Thông tin xác thực, chứng chỉ
});

const hanldeRefreshToken = async () => {
    const res = await instance.get('/api/v1/auth/refresh')
    if (res && res.data) return res.data.access_token;
    else null;
}

instance.defaults.headers.common = { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` } // Gán token vào axios (mỗi request của axios sẽ gán thêm Bearer token)
// Vì mỗi lần re-load lại trang là mất dữ liệu ở redux (trừ access_token ở localStorage) nên phải gán token vào axios -> để gọi API từ BE và BE sẽ dựa vào token riêng để lấy dữ liệu



instance.interceptors.request.use(function (config) {
    return config;
}, function (error) {
    return Promise.reject(error);
});

const NO_RETRY_HEADER = 'x-no-retry' // Tương tự như NO_RETRY_HEADER = false

instance.interceptors.response.use(function (response) {
    return response && response.data ? response.data : response;
}, async function (error) {

    // Khi access token hết hạn
    if (error.config && error.response
        && +error.response.status === 401
        && !error.config.headers[NO_RETRY_HEADER]) {


        const access_token = await hanldeRefreshToken();
        error.config.headers[NO_RETRY_HEADER] = 'true'; // Giúp cho k bị loop vô hạn, chỉ gọi lại refresh token 1 lần khi hết hạn


        if (access_token) {
            error.config.headers['Authorization'] = `Bearer ${access_token}`
            localStorage.setItem('access_token', access_token)
            return instance.request(error.config)
        }

    }

    // Khi refresh token hết hạn
    if (
        error.config && error.response
        && +error.response.status === 400
        && error.config.url === '/api/v1/auth/refresh') {
        window.location.href = '/login';
    }
    return error?.response?.data ?? Promise.reject(error);
});

export default instance