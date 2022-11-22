import { createRouter, createWebHashHistory } from 'vue-router'

import { constantRouterMap } from './router.config'

const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRouterMap
})

// 给router.push函数添加回调
const originalPush = router.push
router.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}

export default router
