import axios from 'axios';

/**
 * 发送请求
 */
function baseRequest(url: string, data: any) {
    return new Promise((reslove, reject) => {
        const _data = data || {}
        axios.get(import.meta.env.VITE_API_URL + '/api/' + url, _data).then(function (response: any) {
            console.log('response=>', response);
            reslove(response.data);
        }).catch(function (error: any) {
            // 处理错误情况
            console.log(error);
            const data = {
                mag: '请求失败',
                status: 1 //1没网
            }
            reject(data);
        }).finally(function () {
            // 总是会执行
        });
    });
}

const request = {};

/* ['options', 'get', 'post', 'put', 'head', 'delete', 'trace', 'connect'].forEach(
    (method) => {
        request[method] = (api: string, data: any) => baseRequest(api, data)
    }); */


export default request;
