/*
 * @Author: Chen Ray
 * @Date: 2024-03-10 18:47:20
 * @LastEditTime: 2024-03-11 18:12:35
 * @FilePath: \ranking-front-end\src\router\index.ts
 * @Description: Do not edit
 */
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    }
  ]
})

export default router
