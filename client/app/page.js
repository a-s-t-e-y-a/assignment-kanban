'use client'

import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../components/ui/form'
import { getLoginMutation } from '../lib/utils/mutations'

export default function LoginPage() {
  const router = useRouter()
  const form = useForm({
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const loginMutation = useMutation(getLoginMutation(router))

  const onSubmit = (data) => {
    loginMutation.mutate(data)
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-meedium mb-3">Welcome Back</h1>
          <p className="text-muted-foreground text-base">
            Sign in to manage your projects and collaborate with your team
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <h2 className="text-xl font-medium text-center mb-6">Login</h2>
            <FormField
            control={form.control}
            name="email"
            rules={{ 
              required: 'Email is required',
              pattern: {
                value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/,
                message: 'Email must be lowercase and valid'
              }
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input 
                    type="email" 
                    placeholder="Email" 
                    {...field}
                    onChange={(e) => {
                      const lowerCaseValue = e.target.value.toLowerCase();
                      field.onChange(lowerCaseValue);
                    }}
                  />
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
          <Button type="submit" disabled={loginMutation.isPending}>
            {loginMutation.isPending ? 'Logging in...' : 'Login'}
          </Button>
          <p className="text-center text-sm">
            Don't have an account? <Link href="/signup" className="text-primary hover:underline">Sign up</Link>
          </p>
        </form>
      </Form>
      </div>
    </div>
  )
}
