axios.defaults.baseURL = 'http://localhost:4000/api';

// 请求拦截器
axios.interceptors.request.use(config => {
    // 在发送请求前执行
    config.headers.common["token"] = "sdfi(^*&)";
    config.timeout = 5000;
    return config;
}, err => {
    return Promise.reject(err);
});

// 响应拦截器
axios.interceptors.response.use(res => {
    // 对响应数据进行处理，对错误状态码进行统一处理
    let status = res.status;
    if (status >= 200 && status < 300 || status === 304) {
        let { message, code } = res.data;
        code && console.log(message);
        return res.data;
    } else {
        return Promise.reject(res)
    }
}, err => {
    if (!err.response) {
        console.log('请求失败或超时，请稍后重试');
        return { message: '请求失败或超时，请稍后重试' };
    }
    let status = err.response.status;
    let msg;
    switch (status) {
        case 401:
            msg = '401 没有权限，打回登录页面';
            break;
        case 403:
            msg = '403 拒绝访问';
            break;
        case 404:
            msg = '404 not found，打回首页';
            break;
        case 500:
            msg = '500 服务器繁忙';
            break;
        default:
            msg = '其他错误';
            break;
    }
    return msg;
});