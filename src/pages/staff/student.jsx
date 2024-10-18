import { Title } from '@/components';
import { Button } from '@/components/ui/button'
import Table from '@/components/common/table'
import { ALL_STUDENTS } from '@/lib/constants';
import { axiosInstance } from '@/lib/utils';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Flip, ToastContainer } from 'react-toastify'

const Student = () => {
  const role = useSelector(state => state.auth.userInfo.role);
  const navigate = useNavigate();
  const [data, setData] = useState([]);
    useEffect(() => {
        axiosInstance
        .get(ALL_STUDENTS, {withCredentials: true})
        .then(res => setData(res.data.data))
        .catch(err =>console.log(err.response?.data?.message || err.message))
    }, [])
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
        <Title title="Student Management" />
        {role === 'librarian' ? '' : (
            <div className='flex justify-end mb-5'>
            <Button onClick={() => navigate(`/${role}/student/add`)}>Add Student</Button>
        </div>
        )}
        {data.length === 0 ? (
            <div className='text-center text-xl font-600 py-8'>No Student Data</div>
        ) : (
            // Render your staff data here
            <div>
                <Table data={data} role={"student"} />
            </div>
        )}
    </div>
)
}

export default Student