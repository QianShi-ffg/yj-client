import axios from 'axios';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import router from '../router';

if (process.env.NODE_ENV === 'development') {
  axios.defaults.baseURL = 'api';
} else if (process.env.NODE_ENV === 'production') {
  axios.defaults.baseURL = 'http://188.131.164.41:3010';
}


//请求拦截器 区分了一下正常请求时与发送formdata时的请求头
axios.interceptors.request.use((config) => {
  config.headers['Content-Type'] = 'application/json';
  if (config.method === 'post') {
    //FormData时的请求头
    if (Object.prototype.toString.call(config.data) === '[object FormData]') {
      // 请求拦截器处理
      config.headers['Content-Type'] = 'multipart/form-data';
    } else if (Object.prototype.toString.call(config.data) === '[object String]') {
      config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    }
  } else {
    config.headers['Content-Type'] = 'application/json';
  }
  return config;
});

//响应拦截器
axios.interceptors.response.use(
  (config) => {
    let value = config.data;
    console.log(config)
    if (config.status && config.status === 200) {
      if (typeof value === 'string') {
        if (value === 'timeout') {
          ElementUI.MessageBox.confirm('太长时间没有操作或操作没有权限，请进入登录页面重新登录?', '提示', {
            confirmButtonText: '确定',
            type: 'warning'
          }).then(() => {
            router.push({ name: 'login' });
          });
        } else {
          ElementUI.Message.info(value);
        }
      }
    }
    return config;
  },
  (err) => {
    let value = err.response.statusText;
    switch (err.response.status) {
      case 400:
        ElementUI.Message.error('语法格式有误，服务器无法理解此请求')
        break;
      case 401:
      case 403:
      case 404:
      case 405:
        ElementUI.Message.warning(value);
        break;
      default:
        ElementUI.Message.error('操作过程出错，此次操作无效！' + value);
        break;
    }
    return err.response
  }
);


export async function axiosGet (url, params = {}) {
  let res = await axios.get(url, { params: params });
  if (res.status === 200) {
    return res.data
  } else {
    throw res.statusText
  }
}

export async function axiosPost (url, params = {}) {
  let res = await axios.post(url, params);
  if (res.status === 200) {
    return res.data
  } else {
    throw res.statusText
  }
}
