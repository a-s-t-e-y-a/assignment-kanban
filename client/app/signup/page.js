'use client'

import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast, { Toaster } from 'react-hot-toast'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form'
import { getSignupMutation } from '../../lib/utils/mutations'

export default function SignupPage() {
  const router = useRouter()
  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: ''
    }
  })

  const signupMutation = useMutation(getSignupMutation(router))

  const onSubmit = (data) => {
    signupMutation.mutate(data)
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Toaster />
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <h1 className="text-2xl font-medium mb-3">Become a Member</h1>
          <p className="text-muted-foreground text-base mb-2">
            Join our collaborative project management platform
          </p>
          <div className="bg-muted/50 rounded-lg p-4 mt-4 text-left">
            <p className="text-sm font-medium mb-2">Create your account to:</p>
            <ul className="text-sm text-muted-foreground space-y-1.5">
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold mt-0.5">✓</span>
                <span>Create and manage projects with your team</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold mt-0.5">✓</span>
                <span>Update and track tasks in real-time</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold mt-0.5">✓</span>
                <span>Collaborate with team members</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold mt-0.5">✓</span>
                <span>Monitor project progress and completion rates</span>
              </li>
            </ul>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <h2 className="text-xl font-medium text-center mb-6">Sign Up</h2>
            <FormField
            control={form.control}
            name="name"
            rules={{ required: 'Name is required' }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            rules={{ required: 'Email is required' }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            rules={{ required: 'Password is required' }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={signupMutation.isPending}>
            {signupMutation.isPending ? 'Signing up...' : 'Signup'}
          </Button>
          <p className="text-center text-sm">
            Already have an account? <Link href="/" className="text-primary hover:underline">Login</Link>
          </p>
        </form>
      </Form>
      </div>
    </div>
  )
}
