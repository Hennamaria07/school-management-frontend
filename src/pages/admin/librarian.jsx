import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Title } from '@/components'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { ALL_LIBRARIANS, CREATE_LIBRARIAN } from '@/lib/constants'
import { axiosInstance } from '@/lib/utils'
import Table from '@/components/common/table'
import { Flip, toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

const AdminLibrarian = () => {

    const [data, setData] = useState([])
    const [isOpen, setIsOpen] = useState(false)
    const [photoPreview, setPhotoPreview] = useState(null)
    const [loading, setLoading] = useState(false)

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
        axiosInstance.get(ALL_LIBRARIANS)
            .then(res => setData(res.data.data))
            .catch(err => console.log(err.response?.data?.message || err.message))
    }, [data])

    const onSubmit = (values) => {
        console.log('Submitting:', values)
        const formData = new FormData();
        formData.append('name', values.name)
        formData.append('email', values.email)
        formData.append('password', values.password)
        formData.append('photo', values.photo)
        setLoading(true)
        axiosInstance.post(CREATE_LIBRARIAN, formData, { withCredentials: true })
            .then(res => {
                setLoading(false)
                toast.success(res.data.message)
            })
            .catch(err => {
                setLoading(false)
                toast.error(err.response?.data?.message || err.message)
            })
        setIsOpen(false)
        form.reset()
        setPhotoPreview(null)
    }

    const handlePhotoChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            form.setValue('photo', file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setPhotoPreview(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    return (
        <div>
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
            <Title title="Librarian Management" />
            <div className='flex justify-end mb-5'>
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button>Add Librarian</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Librarian</DialogTitle>
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
                                                <Input {...field} />
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
                                                <Input type="email" {...field} />
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
                                                <Input type="password" {...field} />
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
                                                    accept="image/jpeg,image/png,image/webp"
                                                    onChange={(e) => {
                                                        handlePhotoChange(e)
                                                        field.onChange(e.target.files[0])
                                                    }}
                                                />
                                            </FormControl>
                                            {photoPreview && (
                                                <img src={photoPreview} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded" />
                                            )}
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button className="w-full" type="submit" disabled={loading}>{loading ? 'Adding...' : 'Create Librarian'}</Button>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>
            {data.length === 0 ? (
                <div className='text-center text-xl font-600 py-8'>No Librarian data</div>
            ) : (
                <div>
                    <Table data={data} role={"librarian"} />
                </div>
            )}
        </div>
    )
}

export default AdminLibrarian