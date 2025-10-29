import api from '../api'
import toast from 'react-hot-toast'
import socketClient from '../socket'

export const getLoginMutation = (router) => ({
  mutationFn: (data) => api.post('/auth/login', data),
  onSuccess: (response) => {
    toast.success('Logged in successfully!')
    const token = response.data.token
    document.cookie = `token=${token}; path=/`
    localStorage.setItem('token', token)
    socketClient.initSocket(token)
    router.push('/dashboard')
  },
  onError: (error) => {
    if (!error.response) {
      toast.error('Network error: Unable to connect to server')
      return
    }
    const errorMessage = error?.response?.data?.message || error?.response?.data?.error || 'Login failed'
    toast.error(errorMessage)
  }
})

export const getSignupMutation = (router) => ({
  mutationFn: (data) => api.post('/auth/signup', data),
  onSuccess: (response, variables, context) => {
    toast.success('Account created successfully!')
    if (context?.queryClient) {
      context.queryClient.invalidateQueries({ queryKey: ['emails'] })
    }
    router.push('/')
  },
  onError: (error) => {
    if (!error.response) {
      toast.error('Network error: Unable to connect to server')
      return
    }
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
