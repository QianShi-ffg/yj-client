import { axiosGet, axiosPost } from './axios'

let baseURL = ''
if (process.env.NODE_ENV === 'development') {
  baseURL = 'api';
} else if (process.env.NODE_ENV === 'production') {
  baseURL = 'http://192.73.0.211:3000';
}
export default {
  login: (params = {}) => {
    console.log(11, params)
    return axiosPost(`${baseURL}/login`, params)
  },
  getChatList: (params = {}) => {

    return axiosGet(`${baseURL}/chatList`, params)
  }
}