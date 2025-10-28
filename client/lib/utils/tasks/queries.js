import  api  from '../../api'

export const getTasksByProjectQuery = (projectId) => ({
  queryKey: ['tasks', projectId],
  queryFn: async () => {
    const res = await api.get(`/api/projects/${projectId}/tasks`)
    return res.data.map(task => ({
      ...task,
      id: task._id,
      status: task.status.toLowerCase().replace(' ', '')
    }))
  }
})
