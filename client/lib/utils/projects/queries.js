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
})

export const getEmailsQuery = () => ({
  queryKey: ['emails'],
  queryFn: async () => {
    const response = await api.get('/auth/emails')
    return response.data.emails
  },
  staleTime: 5 * 60 * 1000, // 5 minutes
})
