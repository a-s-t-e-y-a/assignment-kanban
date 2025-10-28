import api from '../api'
import toast from 'react-hot-toast'

export const getLoginMutation = (router) => ({
  mutationFn: (data) => api.post('/auth/login', data),
  onSuccess: (response) => {
    toast.success('Logged in successfully!')
    const token = response.data.token
    document.cookie = `token=${token}; path=/`
    localStorage.setItem('token', token)
    router.push('/dashboard')
  },
  onError: (error) => {
    const errorMessage = error?.response?.data?.message || error?.response?.data?.error || 'Login failed'
    toast.error(errorMessage)
  }
})

export const getSignupMutation = (router) => ({
  mutationFn: (data) => api.post('/auth/signup', data),
  onSuccess: () => {
    toast.success('Account created successfully!')
    router.push('/')
  },
  onError: (error) => {
    const errorMessage = error?.response?.data?.message || error?.response?.data?.error || 'Signup failed'
    toast.error(errorMessage)
  }
})

export const getUserQuery = () => ({
  queryKey: ['user'],
  queryFn: async () => {
    const response = await api.get('/auth/exists')
    return response.data
  },
  staleTime: 5 * 60 * 1000,
  retry: false
})
