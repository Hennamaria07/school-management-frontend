import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Lock } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

const formSchema = z.object({
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const ResetPassword = () => {
  const { role } = useParams();
  const token = "fndsd"

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(values) {
    // Here you would typically handle the password reset logic
    console.log('Password reset attempted with:', values);
    console.log('Using reset token:', token);
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-5">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="authenticationHeader">Reset Password</CardTitle>
          <CardDescription className="authenticationDescription">Enter your new password.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <Lock className="text-gray-500" />
                        <Input type="password" placeholder="Enter new password" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <Lock className="text-gray-500" />
                        <Input type="password" placeholder="Confirm new password" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">Reset Password</Button>
            </form>
          </Form>
          
          <div className='text-sm flex justify-center mt-4'>
            <Link to={`/${role}/login`} className='authNavigate'>Back to Login</Link>
          </div>
        </CardContent>
        <CardFooter>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ResetPassword;