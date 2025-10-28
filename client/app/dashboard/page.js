'use client'

import { useState, useEffect } from 'react'
import { Pencil, Trash2, Eye, UserPlus } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast'
import { Button } from '../../components/ui/button'
import { Spinner } from '../../components/ui/spinner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table'
import { Input } from '../../components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form'
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from '../../components/ui/multi-select'
import { getProjectsQuery, getEmailsQuery } from '../../lib/utils/projects/queries'
import { createProjectMutation, updateProjectMutation, deleteProjectMutation } from '../../lib/utils/projects/mutations'

export default function DashboardPage() {
  const queryClient = useQueryClient()
  const router = useRouter()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [selectedMembers, setSelectedMembers] = useState([])
  const [isCreateUserDialogOpen, setIsCreateUserDialogOpen] = useState(false)

  const form = useForm({
    defaultValues: {
      title: '',
      description: ''
    }
  })

  const { data: projects = [], isLoading } = useQuery(getProjectsQuery())
  const { data: emails = [] } = useQuery(getEmailsQuery())
  const createMutation = useMutation(createProjectMutation(queryClient))
  const updateMutation = useMutation(updateProjectMutation(queryClient))
  const deleteMutation = useMutation(deleteProjectMutation(queryClient))

  const handleOpenDialog = (project = null) => {
    if (project) {
      setEditingProject(project)
      form.reset({ title: project.title, description: project.description })
      setSelectedMembers(project.members?.map(member => member.email) || [])
    } else {
      setEditingProject(null)
      form.reset({ title: '', description: '' })
      setSelectedMembers([])
    }
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingProject(null)
    form.reset({ title: '', description: '' })
    setSelectedMembers([])
  }

  const onSubmit = (data) => {
    if (editingProject) {
      updateMutation.mutate(
        { id: editingProject._id, data: { ...data, members: selectedMembers } },
        {
          onSuccess: () => {
            handleCloseDialog()
          }
        }
      )
    } else {
      createMutation.mutate(
        { ...data, members: selectedMembers },
        {
          onSuccess: () => {
            handleCloseDialog()
          }
        }
      )
    }
  }

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this project?')) {
      deleteMutation.mutate(id)
    }
  }

  const handleCreateNewUser = () => {
    setIsCreateUserDialogOpen(false)
    localStorage.removeItem('token')
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    router.push('/signup')
  }

  if (isLoading) {
    return <div className="p-6">Loading...</div>
  }

  return (
    <div className="p-6 relative">
      <Toaster />      
      <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-medium">Projects</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()}>Add New Project</Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingProject ? 'Edit Project' : 'Create New Project'}</DialogTitle>
                <DialogDescription>
                  {editingProject ? 'Update your project details' : 'Add a new project to your workspace'}
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    rules={{ required: 'Title is required' }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter project title" {...field} />
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
                          <Input placeholder="Enter project description" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormItem>
                    <FormLabel>Add Members</FormLabel>
                    <div className="space-y-2">
                      <div className="flex gap-2 items-start">
                        <div className="flex-1 min-w-0">
                          <MultiSelect values={selectedMembers} onValuesChange={setSelectedMembers}>
                            <MultiSelectTrigger>
                              <MultiSelectValue placeholder="Select members..." />
                            </MultiSelectTrigger>
                            <MultiSelectContent>
                              <MultiSelectGroup>
                                {emails.map((email) => (
                                  <MultiSelectItem key={email} value={email}>
                                    {email}
                                  </MultiSelectItem>
                                ))}
                              </MultiSelectGroup>
                            </MultiSelectContent>
                          </MultiSelect>
                        </div>
                        <Button 
                          type="button" 
                          variant="destructive" 
                          size="icon"
                          className="shrink-0"
                          onClick={() => setIsCreateUserDialogOpen(true)}
                          title="Create a new user account"
                        >
                          <UserPlus className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Select existing members from the list. To add a new member, click the <span className="text-destructive font-medium">red button</span> to create a new user account first.
                      </p>
                    </div>
                  </FormItem>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={handleCloseDialog}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingProject ? 'Update Project' : 'Create Project'}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Create New User Confirmation Dialog */}
        <Dialog open={isCreateUserDialogOpen} onOpenChange={setIsCreateUserDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
              <DialogDescription>
                To add a new member to your project, you need to create a new user account first.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                You will be logged out and redirected to the signup page where you can create a new user account. 
                After the new user is created, you can log back in and add them as a member to your project.
              </p>
              <div className="flex justify-end gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsCreateUserDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="button" 
                  onClick={handleCreateNewUser}
                >
                  Continue to Signup
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 border rounded-lg bg-muted/10">
            <p className="text-lg text-muted-foreground mb-4">No projects available</p>
            <Button onClick={() => handleOpenDialog()}>Add New Project</Button>
          </div>
        ) : (
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Members</TableHead>
                  <TableHead>Completion</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => (
                  <TableRow 
                    key={project._id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => router.push(`/dashboard/projects/${project._id}`)}
                  >
                    <TableCell className="font-medium">{project.title}</TableCell>
                    <TableCell>{project.description}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{project.owner?.name}</span>
                        <span className="text-xs text-muted-foreground">{project.owner?.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <span className="text-sm">{project.membersCount || 0}</span>
                        <span className="text-xs text-muted-foreground">members</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-green-500 transition-all"
                            style={{ width: `${project.completionRate || 0}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{project.completionRate || 0}%</span>
                      </div>
                    </TableCell>
                    <TableCell>{new Date(project.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                        <Button 
                          variant="ghost" 
                          size="icon-sm" 
                          title="Edit project"
                          onClick={() => handleOpenDialog(project)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon-sm" 
                          title="Delete project"
                          onClick={() => handleDelete(project._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
  )
}
