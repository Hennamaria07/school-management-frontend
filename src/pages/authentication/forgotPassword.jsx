import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Mail } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

const ForgotPassword = () => {
    const {role} = useParams();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(values) {
    // Here you would typically handle the password reset logic
    console.log('Password reset requested for:', values.email);
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-5">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="authenticationHeader">Forgot Password</CardTitle>
          <CardDescription className="authenticationDescription">Enter your email to reset your password.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <Mail className="text-gray-500" />
                        <Input type="email" placeholder="Enter your email" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">Submit</Button>
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

export default ForgotPassword;