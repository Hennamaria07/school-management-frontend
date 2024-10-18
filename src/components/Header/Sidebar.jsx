import { Activity } from 'lucide-react';
import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaChalkboardTeacher } from "react-icons/fa";
import { IoLibraryOutline } from "react-icons/io5";
import { PiStudentBold } from "react-icons/pi";
import { useSelector } from 'react-redux';
import { BsCashCoin } from "react-icons/bs";
import { RiFileHistoryFill } from "react-icons/ri";

const Sidebar = () => {
  const role = useSelector(state => state.auth.userInfo.role);

  return (
    <div className='h-screen fixed top-0 left-0 z-30 w-[5rem] bg-blue-800 rounded-tr-3xl flex flex-col gap-5 items-center'>
      {/* Dashboard Icon */}
      <div className='h-[72px] grid place-items-center mb-6'>
        <NavLink to={'/admin/dashboard'}>
          <Activity className='text-white w-10 h-10' />
        </NavLink>
      </div>

      {/* Student Icon */}
      <div className='h-16 grid place-items-center'>
        <NavLink
          to={`/${role}/student`}
          className={({ isActive }) =>
            `group grid place-items-center ${isActive ? 'text-white' : 'text-gray-200'}`
          }
        >
          <PiStudentBold className='w-8 h-8 transition-all duration-300' />
          <p className='text-transparent group-hover:text-gray-50 transition-opacity duration-300 opacity-0 group-hover:opacity-100'>
            Student
          </p>
        </NavLink>
      </div>

      {/* Staff Icon (Admin only) */}
      {role === 'admin' && (
        <div className='h-16 grid place-items-center'>
          <NavLink
            to={`/${role}/staff`}
            className={({ isActive }) =>
              `group grid place-items-center ${isActive ? 'text-white' : 'text-gray-200'}`
            }
          >
            <FaChalkboardTeacher className='w-8 h-8 transition-all duration-300' />
            <p className='text-transparent group-hover:text-gray-50 transition-opacity duration-300 opacity-0 group-hover:opacity-100'>
              Staff
            </p>
          </NavLink>
        </div>
      )}

      {/* Librarian Icon (Admin only) */}
      {role === 'admin' && (
        <div className='h-16 grid place-items-center'>
          <NavLink
            to={`/${role}/librarian`}
            className={({ isActive }) =>
              `group grid place-items-center ${isActive ? 'text-white' : 'text-gray-200'}`
            }
          >
            <IoLibraryOutline className='w-8 h-8 transition-all duration-300' />
            <p className='text-transparent group-hover:text-gray-50 transition-opacity duration-300 opacity-0 group-hover:opacity-100'>
              Librarian
            </p>
          </NavLink>
        </div>
      )}

      {/* Fees History Icon (Admin and Staff) */}
      {(role === 'admin' || role === 'staff') && (
        <div className='h-16 grid place-items-center'>
          <NavLink
            to={`/${role}/fees-history`}
            className={({ isActive }) =>
              `group grid place-items-center ${isActive ? 'text-white' : 'text-gray-200'}`
            }
          >
            <BsCashCoin className='w-8 h-8 transition-all duration-300' />
            <p className='text-transparent text-center group-hover:text-gray-50 transition-opacity duration-300 opacity-0 group-hover:opacity-100'>
              Fees History
            </p>
          </NavLink>
        </div>
      )}

      {/* Library History Icon */}
      <div className='h-16 grid place-items-center'>
        <NavLink
          to={`/${role}/library-history`}
          className={({ isActive }) =>
            `group grid place-items-center ${isActive ? 'text-white' : 'text-gray-200'}`
          }
        >
          <RiFileHistoryFill className='w-8 h-8 transition-all duration-300' />
          <p className='text-transparent group-hover:text-gray-50 text-center transition-opacity duration-300 opacity-0 group-hover:opacity-100'>
            Library History
          </p>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
