/*
 * @Author: Chen Ray
 * @Date: 2024-03-10 18:47:20
 * @LastEditTime: 2024-03-11 15:01:08
 * @FilePath: \ranking-front-end\src\main.ts
 * @Description: Do not edit
 * import './assets/main.css'
 */

import "@popperjs/core";
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-icons/font/bootstrap-icons.css";
import 'bootstrap';

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import i18n from './locals'

const app = createApp(App)

app.use(createPinia())

app.use(router)
app.use(i18n)

app.mount('#app')
