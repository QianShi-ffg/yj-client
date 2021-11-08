import { axiosGet, axiosPost } from './axios'

export default {
  login: (params = {}) => {
    console.log(11, params)
    return axiosPost('/login', params)
  },
  getChatList: (params = {}) => {

    return axiosGet('/chatList', params)
  }
}