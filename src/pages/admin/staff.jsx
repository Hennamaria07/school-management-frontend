import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Title } from '@/components'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Table from '@/components/common/table'
import { Flip, toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { createStaff, fetchStaffs } from '@/redux/features/staffSlice'

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const formSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    email: z.string().email({ message: "Invalid email address." }),
    password: z.string().min(6, { message: "Password must be at least 6 characters." }),
    photo: z
        .any()
        .refine((file) => file instanceof File, "Photo is required.")
        .refine((file) => file?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
        .refine(
            (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
            "Only .jpg, .png and .webp formats are supported."
        )
})

const AdminStaff = () => {
    const role = useSelector((state) => state.auth.userInfo.role);
    const data = useSelector((state) => state.staff.staffs);
    const [isOpen, setIsOpen] = useState(false)
    const [photoPreview, setPhotoPreview] = useState(null)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            photo: undefined
        }
    })
    
    useEffect(() => {
       dispatch(fetchStaffs());
    }, [dispatch, data])

    const onSubmit = async (values) => {
        setLoading(true)
        const formData = new FormData();
        formData.append('name', values.name)
        formData.append('email', values.email)
        formData.append('password', values.password)
        formData.append('photo', values.photo)
        try {
            const result = await dispatch(createStaff(formData)).unwrap();
            toast.success(`${values.name} created successfully!`);
            setIsOpen(false);
            form.reset();
            setPhotoPreview(null);
        } catch (err) {
            toast.error(err?.message || err || "An error occurred while creating staff");
        } finally {
            setLoading(false);
        }
    }

    const handlePhotoChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            if (file.size > MAX_FILE_SIZE) {
                toast.error('File size must be less than 5MB')
                return
            }
            if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
                toast.error('Only .jpg, .png and .webp formats are supported')
                return
            }
            
            form.setValue('photo', file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setPhotoPreview(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    return (
        <div className="p-4">
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
            
            <Title title="Staff Management" />
            
            <div className='flex justify-end mb-5'>
                <Button onClick={() => setIsOpen(true)}>Add Staff Member</Button>
            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Add New Staff Member</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter name" {...field} />
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
                                            <Input type="email" placeholder="Enter email" {...field} />
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
                                            <Input 
                                                type="password" 
                                                placeholder="Enter password" 
                                                {...field} 
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="photo"
                                render={() => (
                                    <FormItem>
                                        <FormLabel>Photo</FormLabel>
                                        <FormControl>
                                            <Input 
                                                type="file" 
                                                accept=".jpg,.jpeg,.png,.webp"
                                                onChange={handlePhotoChange}
                                            />
                                        </FormControl>
                                        {photoPreview && (
                                            <img 
                                                src={photoPreview} 
                                                alt="Preview" 
                                                className="mt-2 w-32 h-32 object-cover rounded-md"
                                            />
                                        )}
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex justify-end pt-4">
                                <Button type="submit" disabled={loading}>
                                    {loading ? 'Adding...' : 'Add Staff Member'}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            {data.length === 0 ? (
                <div className='text-center text-xl font-semibold py-8'>No Staff data</div>
            ) : (
                <div className="mt-6">
                    <Table data={data} role="staff" />
                </div>
            )}
        </div>
    )
}

export default AdminStaff