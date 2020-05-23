import Layout from '@/layout'
const equipmentsRouter = {
  path: '/equipment',
  component: Layout,
  // redirect: '/equipments/table',
  name: 'Equipment',
  meta: { title: '设备管理', icon: 'example' },
  children: [
    {
      path: 'equ-table',
      name: 'Table',
      component: () => import('@/views/table/equ-table/index'),
      meta: { title: '设备名单', icon: 'table' }
    },
    {
      path: 'loan_Msg',
      name: 'Loan',
      component: () => import('@/views/table/equ-table/loan_msg'),
      meta: { title: '出借信息', icon: 'table' }
    },
    {
      path: 'tree',
      name: 'Tree',
      component: () => import('@/views/tree/index'),
      meta: { title: 'Tree', icon: 'tree' }
    }
  ]
}

export default equipmentsRouter
