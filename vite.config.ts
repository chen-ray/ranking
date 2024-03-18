import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    build: {
        //assetsDir: 'https://ranking-cdn.chen-ray.cn/assets/',
        terserOptions: {
            compress: {
                drop_console: true,     // 关闭所有的 console.log 打印
                drop_debugger: true,    // 关闭所有的 console.log 打印
            },
        }
    }
})
