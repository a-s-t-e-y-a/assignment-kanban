'use client'

import { use, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import toast, { Toaster } from 'react-hot-toast'
import { Plus, Trash2, Pencil, Calendar } from 'lucide-react'
import { getProjectByIdQuery } from '../../../../lib/utils/projects/queries'
import { getTasksByProjectQuery } from '../../../../lib/utils/tasks/queries'
import { createTaskMutation, updateTaskMutation, deleteTaskMutation } from '../../../../lib/utils/tasks/mutations'
import { Button } from '../../../../components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../../../components/ui/dialog'
import { Input } from '../../../../components/ui/input'
import { Label } from '../../../../components/ui/label'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../../../components/ui/form'
import { Tooltip, TooltipContent, TooltipTrigger } from '../../../../components/ui/tooltip'
import { Badge } from '../../../../components/ui/badge'
import { Spinner } from '../../../../components/ui/spinner'

const COLUMN_CONFIGS = {
  todo: {
    title: 'To Do',
    bgColor: 'bg-[#2c2c2b]',
    borderColor: 'border-red-200',
  },
  inprogress: {
    title: 'In Progress',
    bgColor: 'bg-[#213041]',
    borderColor: 'border-yellow-200',
  },
  completed: {
    title: 'Completed',
    bgColor: 'bg-[#24342b]',
    borderColor: 'border-green-200',
  },
}

export default function ProjectPage({ params }) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { id } = use(params)
  const { data: project, isLoading: projectLoading, isError } = useQuery(getProjectByIdQuery(id))
  const { data: tasks = [], isLoading: tasksLoading } = useQuery(getTasksByProjectQuery(id))
  const createMutation = useMutation(createTaskMutation(queryClient))
  const updateMutation = useMutation(updateTaskMutation(queryClient))
  const deleteMutation = useMutation(deleteTaskMutation(queryClient))
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [taskToDelete, setTaskToDelete] = useState(null)
  const [isDragging, setIsDragging] = useState(false)

  const form = useForm({
    defaultValues: {
      title: '',
      description: '',
      assignedTo: '',
      dueDate: '',
      status: 'todo'
    }
  })

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result

    if (!destination) {
      return
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    const task = tasks.find((t) => t.id === draggableId)
    const statusLabels = {
      todo: 'To Do',
      inprogress: 'In Progress',
      completed: 'Completed',
    }

    setIsDragging(true)
    updateMutation.mutate(
      { id: task.id, data: { status: statusLabels[destination.droppableId] } },
      {
        onSuccess: () => {
          setIsDragging(false)
          toast.success(
            `Task "${task.title}" moved to ${statusLabels[destination.droppableId]}`,
            {
              duration: 3000,
              position: 'bottom-right',
            }
          )
        },
        onError: () => {
          setIsDragging(false)
        }
      }
    )
  }

  const getTasksByStatus = (status) => {
    return tasks.filter((task) => task.status === status)
  }

  const handleOpenDialog = (task = null) => {
    if (task) {
      setEditingTask(task)
      const taskStatus = task.status === 'todo' ? 'todo' : task.status === 'inprogress' ? 'inprogress' : 'completed'
      const assignedEmail = typeof task.assignedTo === 'object' ? task.assignedTo?.email : task.assignedTo
      form.reset({ 
        title: task.title, 
        description: task.description, 
        assignedTo: assignedEmail || '', 
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
        status: taskStatus
      })
    } else {
      setEditingTask(null)
      form.reset({ title: '', description: '', assignedTo: '', dueDate: '', status: 'todo' })
    }
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingTask(null)
    form.reset({ title: '', description: '', assignedTo: '', dueDate: '', status: 'todo' })
  }

  const onSubmit = (data) => {
    if (editingTask) {
      const statusLabels = {
        todo: 'To Do',
        inprogress: 'In Progress',
        completed: 'Completed',
      }
      updateMutation.mutate({ 
        id: editingTask.id, 
        data: { 
          title: data.title, 
          description: data.description,
          status: statusLabels[data.status],
          assignedTo: data.assignedTo,
          dueDate: data.dueDate
        } 
      }, {
        onSuccess: () => {
          handleCloseDialog()
        }
      })
    } else {
      createMutation.mutate({ projectId: id, data: { title: data.title, description: data.description, assignedTo: data.assignedTo, dueDate: data.dueDate } }, {
        onSuccess: () => {
          handleCloseDialog()
        }
      })
    }
  }

  const handleDeleteClick = (task) => {
    setTaskToDelete(task)
    setDeleteConfirmOpen(true)
  }

  const handleConfirmDelete = () => {
    if (taskToDelete) {
      deleteMutation.mutate(taskToDelete.id, {
        onSuccess: () => {
          setTaskToDelete(null)
          setDeleteConfirmOpen(false)
        }
      })
    }
  }

  const handleCancelDelete = () => {
    setTaskToDelete(null)
    setDeleteConfirmOpen(false)
  }

  if (projectLoading || tasksLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <p>Loading project...</p>
      </div>
    )
  }

  if (isError || !project) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <p>Project not found</p>
      </div>
    )
  }

  return (
    <div className="h-auto md:h-[calc(100vh-4rem)] overflow-y-auto md:overflow-hidden relative">
      <Toaster />
      
      {/* Loading Overlay */}
      {(isDragging || updateMutation.isPending || createMutation.isPending || deleteMutation.isPending) && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 flex flex-col items-center gap-4 shadow-xl">
            <Spinner size="lg" />
            <p className="text-sm font-medium text-gray-700">
              {isDragging ? 'Updating task status...' : 'Processing...'}
            </p>
          </div>
        </div>
      )}
      
      <div className="p-4 md:p-6 border-b">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <Button 
            onClick={() => router.push('/dashboard')} 
            variant="outline"
            className="w-full md:w-auto"
          >
            Back to Dashboard
          </Button>
          <div className="text-center w-full md:w-auto">
            <h1 className="text-lg md:text-xl font-medium mb-1">{project.title}</h1>
            <p className="text-muted-foreground text-xs md:text-sm mb-2">{project.description}</p>
            <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-2">
              <Badge variant="secondary">{project.membersCount} members</Badge>
              <Badge variant="outline">{project.completionRate}% complete</Badge>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-2 text-xs text-muted-foreground">
              <span>Owner:</span>
              <span className="font-medium">{project.owner?.name}</span>
              <span className="hidden sm:inline">({project.owner?.email})</span>
            </div>
          </div>
          <Button onClick={() => handleOpenDialog()} className="w-full md:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 md:p-6 h-auto md:h-[calc(100vh-12rem)] overflow-y-auto md:overflow-hidden">
          {Object.entries(COLUMN_CONFIGS).map(([status, config]) => (
            <Droppable key={status} droppableId={status}>
              {(provided, snapshot) => (
                <div
                  className={`flex flex-col rounded-lg border-2 ${config.borderColor} ${config.bgColor} p-4 min-h-[300px] md:min-h-0 ${
                    snapshot.isDraggingOver ? 'ring-2 ring-offset-2 ring-blue-400' : ''
                  }`}
                >
                  <h2 className="text-lg font-medium mb-4 text-white">
                    {config.title}
                    <span className=" text-white ml-2 text-sm font-normal">
                      ({getTasksByStatus(status).length})
                    </span>
                  </h2>
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200"
                    style={{
                      minHeight: '200px',
                      maxHeight: 'calc(100vh - 20rem)',
                    }}
                  >
                    {getTasksByStatus(status).map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow ${
                              snapshot.isDragging ? 'shadow-lg rotate-2' : ''
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-gray-900 mb-2">
                                  {task.title}
                                </h3>
                                <p className="text-sm text-gray-600 mb-2">
                                  {task.description}
                                </p>
                                {task.assignedTo && (
                                  <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                                    <span className="font-medium">Assigned to:</span>
                                    <span>{task.assignedTo.name} ({task.assignedTo.email})</span>
                                  </div>
                                )}
                                {task.dueDate && (
                                  <div className="flex items-center gap-1 text-xs text-gray-500">
                                    <Calendar className="h-3 w-3" />
                                    <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                                  </div>
                                )}
                              </div>
                              <div className="flex gap-1 flex-shrink-0">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleOpenDialog(task)
                                      }}
                                      className="p-1.5 rounded hover:bg-gray-100 transition-colors"
                                    >
                                      <Pencil className="h-4 w-4 text-blue-600" />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Edit task</p>
                                  </TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleDeleteClick(task)
                                      }}
                                      className="p-1.5 rounded hover:bg-gray-100 transition-colors"
                                    >
                                      <Trash2 className="h-4 w-4 text-red-600" />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Delete task</p>
                                  </TooltipContent>
                                </Tooltip>
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingTask ? 'Edit Task' : 'Create New Task'}</DialogTitle>
            <DialogDescription>
              {editingTask ? 'Update the task details below.' : 'Fill in the details for your new task.'}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
              <FormField
                control={form.control}
                name="title"
                rules={{ required: 'Task title is required' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Task Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter task title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                rules={{ required: 'Description is required' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter task description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="assignedTo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assigned To</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                      >
                        <option value="">Select member</option>
                        {project.owner && (
                          <option key={project.owner.email} value={project.owner.email}>
                            {project.owner.name} ({project.owner.email}) - Owner
                          </option>
                        )}
                        {project.members?.filter(member => member.email !== project.owner?.email).map((member) => (
                          <option key={member.email} value={member.email}>
                            {member.name} ({member.email})
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {editingTask && (
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                        >
                          <option value="todo">To Do</option>
                          <option value="inprogress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleCloseDialog}
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {createMutation.isPending || updateMutation.isPending ? (
                    <>
                      <Spinner className="mr-2 h-4 w-4" />
                      {editingTask ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    editingTask ? 'Update Task' : 'Create Task'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Task</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{taskToDelete?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={handleCancelDelete}
              disabled={deleteMutation.isPending}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleConfirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
