import  api  from '../../api'
import toast from 'react-hot-toast'

export const createTaskMutation = (queryClient) => ({
  mutationFn: async ({ projectId, data }) => {
    const res = await api.post(`/api/projects/${projectId}/tasks`, data)
    return res.data
  },
  onSuccess: (data, variables) => {
    queryClient.invalidateQueries({ queryKey: ['tasks', variables.projectId] })
    queryClient.invalidateQueries({ queryKey: ['project', variables.projectId] })
    queryClient.refetchQueries({ queryKey: ['tasks', variables.projectId] })
    queryClient.refetchQueries({ queryKey: ['project', variables.projectId] })
    toast.success('Task created successfully')
  },
  onError: (error) => {
    const errorMessage = error?.response?.data?.error || error?.response?.data?.message || 'Failed to create task'
    toast.error(errorMessage)
  }
})

export const updateTaskMutation = (queryClient) => ({
  mutationFn: async ({ id, data }) => {
    const taskId = id || data._id
    const res = await api.patch(`/api/tasks/${taskId}`, data)
    return res.data
  },
  onSuccess: (data, variables) => {
    queryClient.invalidateQueries({ queryKey: ['tasks'] })
    queryClient.invalidateQueries({ queryKey: ['project'] })
    queryClient.refetchQueries({ queryKey: ['tasks'] })
    queryClient.refetchQueries({ queryKey: ['project'] })
  },
  onError: (error) => {
    if (error?.response?.status === 409) {
      toast.error('This task was modified by another user. Please refresh and try again.')
    } else {
      const errorMessage = error?.response?.data?.error || error?.response?.data?.message || 'Failed to update task'
      toast.error(errorMessage)
    }
  }
})

export const deleteTaskMutation = (queryClient) => ({
  mutationFn: async (id) => {
    const taskId = typeof id === 'object' ? (id._id || id.id) : id
    await api.delete(`/api/tasks/${taskId}`)
    return taskId
  },
  onSuccess: (taskId) => {
    queryClient.invalidateQueries({ queryKey: ['tasks'] })
    queryClient.invalidateQueries({ queryKey: ['project'] })
    queryClient.refetchQueries({ queryKey: ['tasks'] })
    queryClient.refetchQueries({ queryKey: ['project'] })
    toast.success('Task deleted successfully')
  },
  onError: (error) => {
    const errorMessage = error?.response?.data?.error || error?.response?.data?.message || 'Failed to delete task'
    toast.error(errorMessage)
  }
})
