import api from '../../api'
import toast from 'react-hot-toast'

export const createProjectMutation = (queryClient) => ({
  mutationFn: async (data) => {
    const response = await api.post('/api/projects', data)
    return response.data
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['projects'] })
    toast.success('Project created successfully')
  },
  onError: (error) => {
    const errorMessage = error?.response?.data?.error || error?.response?.data?.message || 'Failed to create project'
    toast.error(errorMessage)
  },
})

export const updateProjectMutation = (queryClient) => ({
  mutationFn: async ({ id, data }) => {
    const response = await api.patch(`/api/projects/${id}`, data)
    return response.data
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['projects'] })
    toast.success('Project updated successfully')
  },
  onError: (error) => {
    const errorMessage = error?.response?.data?.error || error?.response?.data?.message || 'Failed to update project'
    toast.error(errorMessage)
  },
})

export const deleteProjectMutation = (queryClient) => ({
  mutationFn: async (id) => {
    const response = await api.delete(`/api/projects/${id}`)
    return response.data
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['projects'] })
    toast.success('Project deleted successfully')
  },
  onError: (error) => {
    const errorMessage = error?.response?.data?.error || error?.response?.data?.message || 'Failed to delete project'
    toast.error(errorMessage)
  },
})
