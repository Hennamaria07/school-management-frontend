import React, { useRef, useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Link, useParams } from 'react-router-dom';

const formSchema = z.object({
  otp: z.string().length(4, { message: "OTP must be 4 digits" }).regex(/^\d+$/, { message: "OTP must contain only numbers" }),
});

const OTPVerification = () => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputs = useRef([]);
  const { role } = useParams();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp: "",
    },
  });

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Combine OTP digits and set form value
    const otpValue = newOtp.join('');
    form.setValue('otp', otpValue, { shouldValidate: true });

    // Focus next input
    if (element.nextSibling && index < 3) {
      element.nextSibling.focus();
    }
  };

  function onSubmit(values) {
    console.log('OTP submitted:', values.otp);
    // Here you would typically handle the OTP verification logic
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-5">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="authenticationHeader">Verify OTP</CardTitle>
          <CardDescription className="authenticationDescription">Enter the 4-digit OTP sent to your device.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex justify-center space-x-2">
                        {otp.map((data, index) => (
                          <Input
                            key={index}
                            type="text"
                            inputMode="numeric"
                            ref={(ref) => inputs.current[index] = ref}
                            maxLength={1}
                            value={data}
                            onChange={(e) => handleChange(e.target, index)}
                            onFocus={(e) => e.target.select()}
                            className="w-12 h-12 text-center text-xl"
                          />
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">Verify OTP</Button>
            </form>
          </Form>
          
          <div className='text-sm flex justify-between gap-5 mt-4'>
            <button onClick={() => console.log('Resend OTP')} className="text-blue-500">Resend OTP</button>
            <Link to={`/${role}/login`} className='authNavigate'>Back to Login</Link>
          </div>
        </CardContent>
        <CardFooter>
        </CardFooter>
      </Card>
    </div>
  );
};

export default OTPVerification;