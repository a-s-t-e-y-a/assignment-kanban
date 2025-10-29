import  api  from '../../api'

export const getTasksByProjectQuery = (projectId) => ({
  queryKey: ['tasks', projectId],
  queryFn: async () => {
    const res = await api.get(`/api/projects/${projectId}/tasks`)
    return {
      tasks: res.data.tasks.map(task => ({
        ...task,
        id: task._id,
        status: task.status.toLowerCase().replace(' ', '')
      })),
      hasNoTasks: res.data.hasNoTasks
    }
  },
  retry: (failureCount, error) => {
    if (error?.response?.status === 403 || error?.response?.status === 401) {
      return false;
    }
    return failureCount < 3;
  }
})
