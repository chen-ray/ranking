/*
 * @Author: Chen Ray
 * @Date: 2024-03-11 16:24:03
 * @LastEditTime: 2024-03-11 16:38:09
 * @FilePath: \ranking\src\api\ranking.ts
 * @Description: Do not edit
 */
import axios from 'axios';
const URL = import.meta.env.VITE_API_URL

export function index(param: object) {
    return axios.get(URL + "index", { params: param || {} }).then(function (res) {
        return res.data;
    });
}

export function getPublicationIds() {
    return axios.get(URL + 'publication-ids').then(function (res) {
        return res.data;
    });
}

export function getBreakdowns(id: number | string) {
    return axios.get(URL + 'breakdowns/' +id).then(function (res) {
        return res.data;
    });
}

export function getWeeks() {
    return axios.get(URL + 'weeks').then(function (res) {
        return res.data;
    });
}