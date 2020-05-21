import axios from 'axios'
// import request from '@/utils/request'
var base = ''
export const getEqu = params => { return axios.get(`${base}/api/equ/ShowEqu`, { params: params }) }
export const batchRemove = params => { return axios.get(`${base}/api/equ/DelEqu`, { params: params }) }
export const getLoan = params => { return axios.get(`${base}/api/equ/LoanMsg`, { params: params }) }
