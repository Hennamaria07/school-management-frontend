import { Title } from "@/components";
import { Button } from "@/components/ui/button";
import { fetchStudents } from "@/redux/features/studentSlice";
import Table from '@/components/common/table';
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Flip, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'

const Student = () => {
    const role = useSelector(state => state.auth.userInfo.role);
    const { students: data, isLoading, isError } = useSelector((state) => state.student);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    useEffect(() => {
      dispatch(fetchStudents());
    }, [dispatch]);
  
    // if (isLoading) {
    //   return <div className="text-center text-xl font-600 py-8">Loading...</div>;
    // }
  
    if (isError) {
      return <div className="text-center text-xl font-600 py-8">Error loading students</div>;
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
        <Title title="Student Management" />
        {role === 'librarian' ? null : (
          <div className='flex justify-end mb-5'>
            <Button onClick={() => navigate(`/${role}/student/add`)}>Add Student</Button>
          </div>
        )}
        {!data || !Array.isArray(data) || data.length === 0 ? (
          <div className='text-center text-xl font-600 py-8'>No Student Data</div>
        ) : (
          <div>
            <Table data={data.filter(Boolean)} role="student" />
          </div>
        )}
      </div>
    );
  };

  export default Student