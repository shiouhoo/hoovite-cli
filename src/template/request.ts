import axios, { type InternalAxiosRequestConfig } from 'axios';

// 创建axios实例
const service = axios.create({
    // 这里可以放一下公用属性等。
    baseURL: import.meta.env.MODE == 'development' ? '/api' : import.meta.env.VITE_API, // 用于配置请求接口公用部分，请求时会自动拼接在你定义的url前面。
    withCredentials: false, // 跨域请求时是否需要访问凭证
    // 请求头
    headers: {},
    timeout: 10000, // 请求超时时间
});

// 请求拦截器
service.interceptors.request.use((config: InternalAxiosRequestConfig<any>) => {
    // 这里可以进行请求加密等操作。如添加token,cookie，修改数据传输格式等。
    if (!config || !config.headers) {
        return config;
    }
    config.headers['Content-type'] = 'application/json';
    return config;
});

service.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
    // 请求失败进行的操作
        alert('服务器开小差了，稍后再试试吧');
        switch (error.response.status) {
        case 302:
            break;
        default:
            break;
        }
        return Promise.reject(error);
    }
);

export default service;
