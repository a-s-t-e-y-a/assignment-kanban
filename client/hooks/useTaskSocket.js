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
      const joinProject = () => {
        if (socket.connected) {
          socket.emit('join-project', projectId)
          console.log(`User joined project room: ${projectId}`)
        }
      }

      if (socket.connected) {
        joinProject()
      } else {
        socket.once('connect', joinProject)
      }

      const handleTaskCreated = (task) => {
        queryClient.invalidateQueries(['tasks', projectId])
        queryClient.refetchQueries(['tasks', projectId])
        toast('New task created by the user', {
          icon: '✨',
          duration: 2000,
        })
      }

      const handleTaskUpdated = (task) => {
        queryClient.invalidateQueries(['tasks', projectId])
        queryClient.refetchQueries(['tasks', projectId])
        toast('Task updated by the user', {
          icon: '🔄',
          duration: 2000,
        })
      }

      const handleTaskDeleted = (task) => {
        queryClient.invalidateQueries(['tasks', projectId])
        queryClient.refetchQueries(['tasks', projectId])
        toast('Task deleted by the user', {
          icon: '🗑️',
          duration: 2000,
        })
      }

      const handleReconnect = () => {
        console.log('Reconnected, rejoining project room')
        joinProject()
      }

      socket.on(TASK_CREATED, handleTaskCreated)
      socket.on(TASK_UPDATED, handleTaskUpdated)
      socket.on(TASK_DELETED, handleTaskDeleted)
      socket.on('reconnect', handleReconnect)

      return () => {
        socket.emit('leave-project', projectId)
        socket.off(TASK_CREATED, handleTaskCreated)
        socket.off(TASK_UPDATED, handleTaskUpdated)
        socket.off(TASK_DELETED, handleTaskDeleted)
        socket.off('reconnect', handleReconnect)
      }
    }
  }, [projectId, queryClient])
}
