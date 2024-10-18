import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from 'react-hook-form';
import moment from 'moment';
import { Flip, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { axiosInstance } from '@/lib/utils';
import { ALL_STUDENTS, ALL_LIBRARY, UPDATE_LIBRARY, DELETE_LIBRARY } from '@/lib/constants';
import { useSelector } from 'react-redux';

const LibraryHistoryTable = ({ data = [], role }) => {
  const userRole = useSelector((state) => state.auth.userInfo.role);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    defaultValues: {
      _id: '',
      student: '',
      bookName: '',
      borrowDate: '',
      returnDate: '',
      status: ''
    }
  });

  // Fetch students data
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get(ALL_STUDENTS, {
          withCredentials: true});
        if (response.data.success) {
          setStudents(response.data.data);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Error fetching students');
        console.error('Error fetching students:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const handleEdit = (item) => {
    setEditingItem(item);
    form.reset({
      _id: item._id,
      student: item?.student?._id,
      bookName: item.bookName,
      borrowDate: moment(item.borrowDate).format('YYYY-MM-DD'),
      returnDate: item.returnDate ? moment(item.returnDate).format('YYYY-MM-DD') : '',
      status: item.status
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      const response = await axiosInstance.delete(`${DELETE_LIBRARY}/${id}`, {
        withCredentials: true
      });
      
      if (response.data.success) {
        toast.success(response.data.message);
        // You might want to trigger a refresh of the data here
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error deleting record');
      console.error('Error deleting record:', error);
    }
  };

  const onSubmit = async (values) => {
    try {
      const response = await axiosInstance.put(`${UPDATE_LIBRARY}/${values._id}`, values, {
        withCredentials: true
      });
      
      if (response.data.success) {
        toast.success(response.data.message);
        setTimeout(() => {
          setIsDialogOpen(false);
        }, 1500);
        // You might want to trigger a refresh of the data here
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating record');
      console.error('Error updating record:', error);
    }
  };

  return (
    <>
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

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Photo</TableHead>
            <TableHead>Student Name</TableHead>
            <TableHead>Book Name</TableHead>
            <TableHead>Borrow Date</TableHead>
            <TableHead>Return Date</TableHead>
            <TableHead>Status</TableHead>
            {userRole === 'librarian' ? ''  : <TableHead>Action</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((item) => (
            <TableRow key={item._id}>
              <TableCell>
                <img 
                  src={item?.student?.photo?.url} 
                  alt={item?.student?.name} 
                  className="w-10 h-10 rounded-full object-cover"
                />
              </TableCell>
              <TableCell>{item?.student?.name}</TableCell>
              <TableCell>{item.bookName}</TableCell>
              <TableCell>{moment(item.borrowDate).format('DD-MM-YYYY')}</TableCell>
              <TableCell>
                {item.returnDate ? moment(item.returnDate).format('DD-MM-YYYY') : '-'}
              </TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  item.status === 'Returned' ? 'bg-green-100 text-green-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {item.status}
                </span>
              </TableCell>
              {userRole === 'librarian' ? ''  : (
              <TableCell>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleEdit(item)}
                  >
                    <Pencil className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleDelete(item._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </TableCell>
              )}
            </TableRow>
          ))}
          {(!data || data.length === 0) && (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-4">
                No library records found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Library Record</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="student"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Student</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select student" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {students?.map((student) => (
                          <SelectItem key={student._id} value={student._id}>
                            {student.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bookName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Book Name</FormLabel>
                    <FormControl>
                      <Input 
                        type="text" 
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="borrowDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Borrow Date</FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="returnDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Return Date</FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Borrowed">Borrowed</SelectItem>
                        <SelectItem value="Returned">Returned</SelectItem>
                      </SelectContent>
                    </Select>
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
  );
};

export default LibraryHistoryTable;