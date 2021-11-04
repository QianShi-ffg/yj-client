import { axiosGet, axiosPost } from './axios'

export default {
  getLogin: (params = {}) => {
    return axiosPost('/login', params)
  },
  getChatList: (params = {}) => {
    console.log(11)
    return axiosGet('http://localhost:3000/chatList', params)
  }
}