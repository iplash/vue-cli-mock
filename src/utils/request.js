import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import router from '@/router/router';

const service = axios.create({
  baseURL: process.env.serverUrl,
  timeout: 5000
})

service.interceptors.request.use(
  config => {
    if (store.getters.accessToken) {
      config.headers['accessToken'] = store.getters.accessToken
    }
    return config
  },
  error => {
    console.log(error)
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    const res = response.data

    if (res.code !== 200) {
      Message({
        message: res.msg || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      if(res.code === 401){
        sessionStorage.clear()
        router.replace({ path: '/login' })
      }

      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        MessageBox.confirm('请重新登陆', 'Confirm logout', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          // store.dispatch('user/resetToken').then(() => {
          //   location.reload()
          // })
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error)
    router.replace({ path: '/login' })
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service