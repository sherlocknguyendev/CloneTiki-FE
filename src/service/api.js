
import { Avatar } from 'antd'
import axios from '../utils/axios-customize'


// ------------------- Authenticated -------------------

export const callRegister = (fullName, email, password, phone) => {
    return axios.post('/api/v1/user/register', { fullName, email, password, phone })
}


export const callLogin = (username, password, delay = 1500) => {
    return axios.post('/api/v1/auth/login', { username, password, delay })
}


export const callFetchAccount = () => {
    return axios.get('/api/v1/auth/account')
}


export const callLogout = () => {
    return axios.post('/api/v1/auth/logout')
}


// ------------------- User -------------------


export const callFetchListUser = (query) => {
    return axios.get(`/api/v1/user?${query}`)
}

export const callCreateUser = (fullName, email, password, phone) => {
    return axios.post('/api/v1/user', { fullName, email, password, phone })
}

export const callCreateBulkUser = (listUser) => {
    return axios.post('/api/v1/user/bulk-create', listUser)
}

export const callEditUser = (_id, fullName, phone) => {
    return axios.put('/api/v1/user', { _id, fullName, phone })
}

export const callDeleteUser = (userId) => {
    return axios.delete(`/api/v1/user/${userId}`)
}

// ------------------- Book -------------------

export const callCreateBook = (mainText, category, author, price, quantity, sold, thumbnail, slider) => {
    return axios.post('/api/v1/book', { mainText, category, author, price, quantity, sold, thumbnail, slider })
}

export const callFetchListBook = (query) => {
    return axios.get(`api/v1/book?${query}`)
}


export const callFetchCategory = () => {
    return axios.get('/api/v1/database/category')
}

export const callUploadBookImg = (fileImg) => {
    const bodyFormData = new FormData();
    bodyFormData.append('fileImg', fileImg);
    return axios({
        method: 'post',
        url: '/api/v1/file/upload',
        data: bodyFormData,
        headers: {
            "Content-Type": "multipart/form-data",
            "upload-type": "book"
        },
    });
}


export const callEditBook = (_id, mainText, category, author, price, quantity, sold, thumbnail, slider) => {
    return axios.put(`/api/v1/book/${_id}`, { mainText, category, author, price, quantity, sold, thumbnail, slider })
}


export const callDeleteBook = (bookId) => {
    return axios.delete(`/api/v1/book/${bookId}`)
}

export const callFetchBookById = (id) => {
    return axios.get(`api/v1/book/${id}`)
}

export const callOrderBook = (data) => {
    return axios.post('/api/v1/order', { ...data })
}

export const callFetchOrderHistory = () => {
    return axios.get('/api/v1/history')
}

export const callUpdateAvatar = (fileImg) => {
    const bodyFormData = new FormData();
    bodyFormData.append('fileImg', fileImg);
    return axios({
        method: 'post',
        url: '/api/v1/file/upload',
        data: bodyFormData,
        headers: {
            "Content-Type": "multipart/form-data",
            "upload-type": "avatar"
        },
    });
}

export const callUpdateUserInfor = (_id, fullName, phone, avatar) => {
    return axios.put(`/api/v1/user`, { _id, fullName, phone, avatar })
}

export const callUpdatePassword = (email, oldpass, newpass) => {
    return axios.post(`/api/v1/user/change-password`, { email, oldpass, newpass })
}


export const callFetchDashboard = () => {
    return axios.get(`/api/v1/database/dashboard`)
}


export const callFetchListOrder = (query) => {
    return axios.get(`api/v1/order?${query}`)
}