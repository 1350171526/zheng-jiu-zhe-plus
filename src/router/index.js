import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/views/Layout/index.vue'
import Main from '@/views/Main/index.vue'
import Recommend from '@/views/Recommend/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: Layout,
      children: [
        {
          path: 'main',
          component: Main
        },
        {
          path: 'recommend',
          component: Recommend
        }
      ]
    },
    
  ]
})

export default router
