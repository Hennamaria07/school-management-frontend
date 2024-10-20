import React, { useEffect, useRef } from 'react';
import { get, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { axiosInstance } from '@/lib/utils';
import { Flip, toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CREATE_STUDENT, UPDATE_STUDENT } from '@/lib/constants';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addStudent, getStudentById, resetStatus, updateStudent } from '@/redux/features/studentSlice';

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  dateOfBirth: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Please enter a valid date.",
  }),
  gender: z.enum(["Male", "Female", "Other"]),
  class: z.string().min(1, {
    message: "Please enter a class.",
  }),
  phone: z.string().min(10, {
    message: "Phone number must be at least 10 digits.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  photo: z.any().optional(),
  street: z.string().min(1, {
    message: "Please enter a street address.",
  }),
  city: z.string().min(1, {
    message: "Please enter a city.",
  }),
  state: z.string().min(1, {
    message: "Please enter a state.",
  }),
  postalCode: z.string().min(1, {
    message: "Please enter a postal code.",
  }),
  guardianName: z.string().min(2, {
    message: "Guardian name must be at least 2 characters.",
  }),
  guardianRelationship: z.string().min(1, {
    message: "Please enter the guardian's relationship.",
  }),
  guardianPhone: z.string().min(10, {
    message: "Guardian phone number must be at least 10 digits.",
  }),
  guardianEmail: z.string().email({
    message: "Please enter a valid guardian email address.",
  }),
});

const StudentConfig = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { action, id } = useParams();
  const fileInputRef = useRef(null);
  const student = useSelector((state) => state.student.student);
  const message = useSelector((state) => state.student.message);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      dateOfBirth: "",
      gender: "",
      class: "",
      phone: "",
      email: "",
      photo: undefined,
      street: "",
      city: "",
      state: "",
      postalCode: "",
      guardianName: "",
      guardianRelationship: "",
      guardianPhone: "",
      guardianEmail: "",
    },
  });


  useEffect(() => {
    if (action === 'edit' && id) {
      dispatch(getStudentById(id));
    }
  }, [action, id, dispatch]);
  useEffect(() => {
    // Clean up function
    return () => {
      dispatch(resetStatus());
    };
  }, [dispatch]);

  useEffect(() => {
    if (action === 'edit' && student && student._id === id) {
      form.reset({
        name: student.name || "",
        dateOfBirth: student.dateOfBirth || "",
        gender: student.gender || "",
        class: student.class || "",
        phone: student.contactInfo?.phone || "",
        email: student.contactInfo?.email || "",
        photo: undefined,
        street: student?.contactInfo?.address?.street || "",
        city: student?.contactInfo?.address?.city || "",
        state: student?.contactInfo?.address?.state || "",
        postalCode: student?.contactInfo?.address?.postalCode || "",
        guardianName: student?.guardian?.name || "",
        guardianRelationship: student?.guardian?.relationship || "",
        guardianPhone: student?.guardian?.phone || "",
        guardianEmail: student?.guardian?.email || ""
      });
    }
  }, [action, id, student, form]);


  const onSubmit = (values) => {
    const formData = new FormData();

    const contactInfo = {
      phone: values.phone,
      email: values.email,
      address: {
        street: values.street,
        city: values.city,
        state: values.state,
        postalCode: values.postalCode
      }
    }
    const guardian = {
      name: values.guardianName,
      relationship: values.guardianRelationship,
      phone: values.guardianPhone,
      email: values.guardianEmail
    }

    // Append all non-file form fields
    formData.append('name', values.name);
    formData.append('email', values.email);
    formData.append('dateOfBirth', values.dateOfBirth);
    formData.append('gender', values.gender);
    formData.append('studentClass', values.class);
    formData.append('contactInfo', JSON.stringify(contactInfo));
    formData.append('guardian', JSON.stringify(guardian));

    // Handle the file input
    if (fileInputRef.current && fileInputRef.current.files[0]) {
      formData.append('photo', fileInputRef.current.files[0]);
    }

      if (action === 'edit') {
        dispatch(updateStudent({id, formData}))
          .unwrap()
          .then(res => {
            toast.success(`${values?.name} updated successfully`);
            setTimeout(() => {
              navigate(-1);
            }, 1500)
          })
          .catch(err => {
            toast.error(err || "Failed to update student");
          });
    } else if (action === 'add') {
      dispatch(addStudent(formData))
      .unwrap()
      .then(() => {
        toast.success("Student added successfully");
        setTimeout(() => {
          navigate(-1);
        }, 1500);
      })
      .catch(err => {
        toast.error(err || "Failed to add student");
      });
  }
}

  return (
    <Form {...form}>
      <ToastContainer
        position="top-center"
        autoClose={1500}
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dateOfBirth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of Birth</FormLabel>
                <FormControl>
                  <Input type="date" {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ''}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="class"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Class</FormLabel>
                <FormControl>
                  <Input placeholder="10th Grade" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="1234567890" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="john@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="photo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Photo</FormLabel>
                <FormControl>
                  <Input 
                    type="file" 
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={(e) => {
                      field.onChange(e.target.files);
                      form.setValue('photo', e.target.files[0]);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="street"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Street Address</FormLabel>
                <FormControl>
                  <Input placeholder="123 Main St" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="Anytown" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <FormControl>
                  <Input placeholder="State" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="postalCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Postal Code</FormLabel>
                <FormControl>
                  <Input placeholder="12345" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="guardianName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Guardian Name</FormLabel>
                <FormControl>
                  <Input placeholder="Jane Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="guardianRelationship"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Guardian Relationship</FormLabel>
                <FormControl>
                  <Input placeholder="Mother" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="guardianPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Guardian Phone</FormLabel>
                <FormControl>
                  <Input placeholder="0987654321" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="guardianEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Guardian Email</FormLabel>
                <FormControl>
                  <Input placeholder="jane@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default StudentConfig;