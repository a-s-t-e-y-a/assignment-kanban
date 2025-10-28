import axios from 'axios'

const backendUrl = process.env.NODE_ENV === 'development' ? process.env.NEXT_PUBLIC_DEV_BACKEND_URL : process.env.NEXT_PUBLIC_PROD_BACKEND_URL

const api = axios.create({
  baseURL: backendUrl,
})

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

api.interceptors.request.use((config) => {
  let token = getCookie('token') || localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
