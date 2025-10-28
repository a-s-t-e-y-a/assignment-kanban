import { useEffect } from 'react'
import socketClient from '../lib/socket'
import toast from 'react-hot-toast'

const TASK_CREATED = 'task_created'
const TASK_UPDATED = 'task_updated'
const TASK_DELETED = 'task_deleted'

export const useTaskSocket = (projectId, queryClient) => {
  useEffect(() => {
    const socket = socketClient.getSocket()

    if (socket && projectId) {
      socket.emit('join-project', projectId)
      console.log(`User connected to project room: ${projectId}`)

      const handleTaskCreated = (task) => {
        queryClient.invalidateQueries(['tasks', projectId])
        toast.success('A new task was created')
      }

      const handleTaskUpdated = (task) => {
        queryClient.invalidateQueries(['tasks', projectId])
        toast.success('A task was updated')
      }

      const handleTaskDeleted = (task) => {
        queryClient.invalidateQueries(['tasks', projectId])
        toast.success('A task was deleted')
      }

      socket.on(TASK_CREATED, handleTaskCreated)
      socket.on(TASK_UPDATED, handleTaskUpdated)
      socket.on(TASK_DELETED, handleTaskDeleted)

      return () => {
        socket.emit('leave-project', projectId)
        socket.off(TASK_CREATED, handleTaskCreated)
        socket.off(TASK_UPDATED, handleTaskUpdated)
        socket.off(TASK_DELETED, handleTaskDeleted)
      }
    }
  }, [projectId, queryClient])
}
