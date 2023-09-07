
import axios from '../utils/axios-customize'

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