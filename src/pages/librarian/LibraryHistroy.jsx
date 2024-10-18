import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Flip, ToastContainer, toast } from 'react-toastify';
import { Title } from '@/components';
import { ALL_LIBRARY, ALL_STUDENTS, CREATE_LIBRARY, UPDATE_LIBRARY } from '@/lib/constants';
import { axiosInstance } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import HistoryTable from '@/components/common/HistroyTable';
import LibraryHistoryTable from '@/components/common/LibraryHistroyTabel';

const LibraryHistory = () => {
  const role = useSelector(state => state.auth.userInfo.role);
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [students, setStudents] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm();

  const fetchHistory = () => {
    axiosInstance
      .get(ALL_LIBRARY)
      .then(res => setData(res.data.data))
      .catch(err => console.log(err.response?.data?.message || err.message));
  };

  const fetchStudents = () => {
    axiosInstance
      .get(ALL_STUDENTS, { withCredentials: true })
      .then(res => setStudents(res.data.data))
      .catch(err => console.log(err.response?.data?.message || err.message));
  };

  useEffect(() => {
    fetchHistory();
    fetchStudents();
  }, [data]);

  const openDialog = (record = null) => {
    if (record) {
      setIsEditing(true);
      setValue('student', record.student);
      setValue('bookName', record.bookName);
      setValue('borrowDate', record.borrowDate.split('T')[0]);
      setValue('returnDate', record.returnDate?.split('T')[0]);
      setValue('status', record.status);
    } else {
      setIsEditing(false);
      reset();
    }
    setIsDialogOpen(true);
  };

  const onSubmit = (data) => {
    const url = isEditing ? `${UPDATE_LIBRARY}/${data._id}` : CREATE_LIBRARY;
    const method = isEditing ? 'put' : 'post';

    axiosInstance[method](url, data)
      .then(() => {
        toast.success(`Library record ${isEditing ? 'updated' : 'added'} successfully`);
        setIsDialogOpen(false);
        setTimeout(() => {
          fetchHistory();
          reset();
        }, 1500);
      })
      .catch(err => {
        toast.error(err.response?.data?.message || 'An error occurred');
      });
  };

  return (
    <div>
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
      <Title title="Library History Management" />
      {role === 'librarian' ? '' : (
        <div className='flex justify-end mb-5'>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openDialog()}>Add Library History</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{isEditing ? 'Edit Record' : 'Add New Record'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="student">Student</Label>
                <Select onValueChange={(value) => setValue('student', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a student" />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map((student) => (
                      <SelectItem key={student._id} value={student._id}>
                        {student.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.student && <p className="text-red-500 text-sm mt-1">Student is required</p>}
              </div>
              <div>
                <Label htmlFor="bookName">Book Name</Label>
                <Input 
                  id="bookName" 
                  {...register('bookName', { 
                    required: 'Book name is required',
                    minLength: { value: 2, message: 'Book name must be at least 2 characters long' }
                  })} 
                />
                {errors.bookName && <p className="text-red-500 text-sm mt-1">{errors.bookName.message}</p>}
              </div>
              <div>
                <Label htmlFor="borrowDate">Borrow Date</Label>
                <Input 
                  id="borrowDate" 
                  type="date" 
                  {...register('borrowDate', { 
                    required: 'Borrow date is required',
                  })} 
                />
                {errors.borrowDate && <p className="text-red-500 text-sm mt-1">{errors.borrowDate.message}</p>}
              </div>
              <div>
                <Label htmlFor="returnDate">Return Date</Label>
                <Input 
                  id="returnDate" 
                  type="date" 
                  {...register('returnDate')} 
                />
                {errors.returnDate && <p className="text-red-500 text-sm mt-1">{errors.returnDate.message}</p>}
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select onValueChange={(value) => setValue('status', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Borrowed">Borrowed</SelectItem>
                    <SelectItem value="Returned">Returned</SelectItem>
                  </SelectContent>
                </Select>
                {errors.status && <p className="text-red-500 text-sm mt-1">Status is required</p>}
              </div>
              <Button type="submit" className="w-full">{isEditing ? 'Update' : 'Add'} Record</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      )}
      {data.length === 0 ? (
        <div className='text-center text-xl font-600 py-8'>No Library History</div>
      ) : (
        <div>
          <LibraryHistoryTable 
            data={data} 
            role="libraryHistory"
            actions={[
              {
                name: 'Edit',
                onClick: (record) => openDialog(record),
              },
            ]}
          />
        </div>
      )}
    </div>
  );
};

export default LibraryHistory;