import Layout from '@/layout'
const tasksRouter = {
  path: '/tasks',
  component: Layout,
  name: 'tasks',
  meta: { title: '任务管理', icon: 'example' },
  children: [
    {
      path: 'task-index',
      name: 'index',
      component: () => import('@/views/task/index'),
      meta: { title: '测试首页', icon: 'table' }
    },
    {
      path: 'performance',
      name: 'performance',
      component: () => import('@/views/task/performance'),
      meta: { title: '员工绩效统计', icon: 'table' }
    },
    {
      path: 'test3',
      name: 'test3',
      component: () => import('@/views/task/test3'),
      meta: { title: '测试页3', icon: 'tree' }
    }
  ]
}

export default tasksRouter
