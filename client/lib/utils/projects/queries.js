import api from '../../api'

export const getProjectsQuery = () => ({
  queryKey: ['projects'],
  queryFn: async () => {
    const response = await api.get('/api/projects')
    return response.data
  },
  staleTime: 0,
})

export const getProjectByIdQuery = (id) => ({
  queryKey: ['project', id],
  queryFn: async () => {
    const response = await api.get(`/api/projects/${id}`)
    return response.data
  },
  enabled: !!id,
  retry: (failureCount, error) => {
    if (error?.response?.status === 403 || error?.response?.status === 401) {
      return false;
    }
    return failureCount < 3;
  }
})

export const getEmailsQuery = () => ({
  queryKey: ['emails'],
  queryFn: async () => {
    const response = await api.get('/auth/emails')
    return response.data.emails
  },
  staleTime: 0,
})
