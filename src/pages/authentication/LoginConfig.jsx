import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Lock, Mail } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { LOGIN_ADMIN, LOGIN_LIBRARIAN, LOGIN_STAFF } from '@/lib/constants';
import { axiosInstance } from '@/lib/utils';
import { Flip, toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';
import { login } from '@/redux/features/authSlice';

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

const LoginConfig = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {role} = useParams();
  const [loading, setLoading] = useState(false);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const roleName = role.toLocaleLowerCase() === "admin" ? "admin" : role.toLocaleLowerCase() === "librarian" ? "librarian" : role.toLocaleLowerCase() === "staff" ? "staff" : "";
  const onSubmit = (values) => {
    // Here you would typically handle the login logic
    console.log('Login attempted with:', values);
    const url = role.toLowerCase() === 'admin' ? LOGIN_ADMIN : role.toLowerCase() === 'librarian' ? LOGIN_LIBRARIAN : role.toLowerCase() === 'staff' ? LOGIN_STAFF : null;
    if (url) {
      setLoading(true);
      axiosInstance.post(url, values, { withCredentials: true })
        .then(res => {
          setLoading(false);
          toast.success(res.data.message);
          dispatch(login({ isAuthenticated: res.data.isAuthenticated, token: res.data.token, userInfo: res.data.data }));
          setTimeout(() => {
            if(role.toLowerCase() === 'admin'){
              navigate('/admin/student');
            } else if (role.toLowerCase() === 'librarian') {
              navigate('/librarian/student');
            } else if (role.toLowerCase() === 'staff') {
              navigate('/staff/student');
            }
          }, 2000);
        })
        .catch(err => {
          setLoading(false);
          toast.error(err.response?.data?.message || err.message);
        })
  }
}

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-5">
       <ToastContainer
                position="top-center"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition={Flip}
            />
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="authenticationHeader">{roleName} login</CardTitle>
          <CardDescription className="authenticationDescription">Enter your credentials to access the {roleName} portal.</CardDescription>
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
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <Lock className="text-gray-500" />
                        <Input type="password" placeholder="Enter your password" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={loading}>{loading ? 'logging in...' : 'Login'}</Button>
            </form>
          </Form>
          
          <div className='text-sm flex justify-between gap-5 mt-1'>
                <Link to={`/${role}/forgot-password`}>Forgot your password?</Link>
              </div>
        </CardContent>
        <CardFooter>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginConfig;