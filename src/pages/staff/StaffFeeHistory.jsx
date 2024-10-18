import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Flip, ToastContainer, toast } from 'react-toastify';
import { Title } from '@/components';
import { ALL_FEES, ALL_STUDENTS, CREATE_FEES, UPDATE_FEES } from '@/lib/constants';
import { axiosInstance } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import HistoryTable from '@/components/common/HistroyTable';

const StaffFeeHistory = () => {
  const role = useSelector(state => state.auth.userInfo.role);
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [students, setStudents] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm();

  const fetchFees = () => {
    axiosInstance
      .get(ALL_FEES, { withCredentials: true })
      .then(res => setData(res.data.data))
      .catch(err => console.log(err.response?.data?.message || err.message));
  };

  const fetchStudents = () => {
    axiosInstance
      .get(ALL_STUDENTS, {withCredentials: true})
      .then(res => setStudents(res.data.data))
      .catch(err => console.log(err.response?.data?.message || err.message));
  };

  useEffect(() => {
    fetchFees();
    fetchStudents();
  }, [data]);

  const openDialog = (fee = null) => {
    if (fee) {
      setIsEditing(true);
      setValue('student', fee.student);
      setValue('feeType', fee.feeType);
      setValue('amount', fee.amount);
      setValue('paymentDate', fee.paymentDate.split('T')[0]);
      setValue('status', fee.status);
      setValue('remarks', fee.remarks);
    } else {
      setIsEditing(false);
      reset();
    }
    setIsDialogOpen(true);
  };

  const onSubmit = (data) => {
    const url = isEditing ? `${UPDATE_FEES}/${data._id}` : CREATE_FEES;
    const method = isEditing ? 'put' : 'post';

    axiosInstance[method](url, data, { withCredentials: true })
      .then(() => {
        toast.success(`Fee ${isEditing ? 'updated' : 'added'} successfully`);
        setTimeout(() => {
            setIsDialogOpen(false);
            fetchFees();
            reset();
        }, 1500)
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
      <Title title="Student Fees Management" />
      <div className='flex justify-end my-5'>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openDialog()}>Add Fee History</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{isEditing ? 'Edit Fee' : 'Add New Fee'}</DialogTitle>
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
                <Label htmlFor="feeType">Fee Type</Label>
                <Input 
                  id="feeType" 
                  {...register('feeType', { 
                    required: 'Fee type is required',
                    minLength: { value: 3, message: 'Fee type must be at least 3 characters long' }
                  })} 
                />
                {errors.feeType && <p className="text-red-500 text-sm mt-1">{errors.feeType.message}</p>}
              </div>
              <div>
                <Label htmlFor="amount">Amount</Label>
                <Input 
                  id="amount" 
                  type="number" 
                  {...register('amount', { 
                    required: 'Amount is required',
                    min: { value: 0, message: 'Amount must be a positive number' }
                  })} 
                />
                {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>}
              </div>
              <div>
                <Label htmlFor="paymentDate">Payment Date</Label>
                <Input 
                  id="paymentDate" 
                  type="date" 
                  {...register('paymentDate', { 
                    required: 'Payment date is required',
                    validate: value => new Date(value) <= new Date() || 'Payment date cannot be in the future'
                  })} 
                />
                {errors.paymentDate && <p className="text-red-500 text-sm mt-1">{errors.paymentDate.message}</p>}
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select onValueChange={(value) => setValue('status', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
                {errors.status && <p className="text-red-500 text-sm mt-1">Status is required</p>}
              </div>
              <div>
                <Label htmlFor="remarks">Remarks</Label>
                <Input 
                  id="remarks" 
                  {...register('remarks', { 
                    maxLength: { value: 200, message: 'Remarks must be less than 200 characters' }
                  })} 
                />
                {errors.remarks && <p className="text-red-500 text-sm mt-1">{errors.remarks.message}</p>}
              </div>
              <Button type="submit" className="w-full">{isEditing ? 'Update' : 'Add'} Fee</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      {data.length === 0 ? (
        <div className='text-center text-xl font-600 py-8'>No Fee History</div>
      ) : (
        <div>
          <HistoryTable 
            data={data} 
            role={"fees"} 
            actions={[
              {
                name: 'Edit',
                onClick: (fee) => openDialog(fee),
              },
            ]}
          />
        </div>
      )}
    </div>
  );
};

export default StaffFeeHistory;