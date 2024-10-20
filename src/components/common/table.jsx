import React, { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import moment from 'moment'
import { DELETE_LIBRARIAN, UPDATE_LIBRARIAN,} from '@/lib/constants'
import { Flip, toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { deleteStudent, fetchStudents } from '@/redux/features/studentSlice'
import { deleteStaff, updateStaff } from '@/redux/features/staffSlice'
import { deleteLibrarian, fetchLibrarians, updateLibrarian } from '@/redux/features/librarianSlice'

const formSchema = z.object({
  _id: z.string(),
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  photo: z.any().optional()
})

const StaffTable = ({ data, role }) => {
  const userRole = useSelector((state) => state.auth.userInfo.role);
  // console.log(userRole)
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // console.log('data', data)
  const [editingStaff, setEditingStaff] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [photoPreview, setPhotoPreview] = useState(null)

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      _id: '',
      name: '',
      email: '',
      photo: undefined
    }
  })

  useEffect(() => {
    if (editingStaff) {
      setPhotoPreview(editingStaff.photo?.url || '/default-avatar.png')
    }
  }, [editingStaff])

  const handleEdit = (staff) => {
    if (role === 'student') {
      return navigate('/admin/student/edit/' + staff._id)
    }
    setEditingStaff(staff)
    form.reset({
      _id: staff._id,
      name: staff.name,
      email: staff.email
    })
    setPhotoPreview(staff.photo?.url || '/default-avatar.png')
    setIsDialogOpen(true)
  }

  const onSubmit = async (values) => {
    console.log('Submitting:', values)
    try {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('email', values.email);
      formData.append('role', role.toLowerCase()); // Dynamic role
      if (values.photo) {
        formData.append('photo', values.photo);
      }

      
if(role.toLowerCase() === 'staff'){
  dispatch(updateStaff({formData : values, id: values._id}))
  .unwrap()
  .then((res) => {
    toast.success(res.message || 'Staff updated successfully!');
    setIsDialogOpen(false);
  })
  .catch((err) => {
    toast.error(err.message || 'An error occurred.');
    console.error('Error updating:', err);
  });
}

if(role.toLowerCase() === 'librarian'){
  dispatch(updateLibrarian({formData : values, id: values._id}))
  .unwrap()
  .then((res) => {
    toast.success(res.message || 'Librarian updated successfully!');
    setIsDialogOpen(false);
  })
  .catch((err) => {
    toast.error(err.message || 'An error occurred.');
    console.error('Error updating:', err);
  });
}
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      console.error('Error updating:', error);
    }

  }

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDelete = async (id) => {
    try {
      if (role.toLowerCase() === 'student') {
        dispatch(deleteStudent(id))
          .unwrap()
          .then(res => {
            dispatch(fetchStudents())
            alert('Student deleted successfully');
          })
          .catch(err => {
            toast.error(err.message || err)
          })
      } else if (role.toLowerCase() === 'staff') {
        dispatch(deleteStaff(id))
          .unwrap()
          .then(res => {
            toast.success('Staff deleted successfully');
            dispatch(fetchStaffs());
          })
          .catch(err => {
            console.log('Error deleting staff');
          })
      } else if (role.toLowerCase() === 'librarian') {
        dispatch(deleteLibrarian(id))
          .unwrap()
          .then(res => {
            toast.success('Librarian deleted successfully');
            dispatch(fetchLibrarians());
          })
          .catch(err => {
            console.log('Error deleting staff');
          })
      }
      else {
        throw new Error("Invalid role provided");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  }

  return (
    <>
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
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Photo</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            {/* <TableHead>Role</TableHead> */}
            <TableHead>Joined By</TableHead>
            {userRole === 'librarian' && role === 'student' ? '' :
              (<TableHead>Actions</TableHead>)}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((staff) => {
            if (!staff) return null; // Skip rendering if staff is null/undefined

            return (
              <TableRow key={staff._id}>
                <TableCell>
                  <img
                    src={staff?.photo?.url || '/default-avatar.png'}
                    alt={staff?.name || 'Student'}
                    className="w-10 h-10 rounded-full object-cover"
                    onError={(e) => {
                      e.target.src = '/default-avatar.png'
                    }}
                  />
                </TableCell>
                <TableCell>{staff?.name || 'N/A'}</TableCell>
                <TableCell>{staff?.email || staff?.contactInfo?.email || 'N/A'}</TableCell>
                <TableCell>{staff?.createdAt ? moment(staff.createdAt).format('DD-MM-YYYY') : 'N/A'}</TableCell>
                {userRole === 'librarian' && role === 'student' ? '' : (
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(staff)}
                        disabled={!staff._id}
                      >
                        <Pencil className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(staff._id)}
                        disabled={!staff._id}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit {role}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="_id"
                render={({ field }) => (
                  <FormItem className="hidden">
                    <FormControl>
                      <Input {...field} type="hidden" />
                    </FormControl>
                  </FormItem>
                )}
              />
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
                name="photo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Photo</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
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
              <Button className="w-full" type="submit">Save Changes</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default StaffTable