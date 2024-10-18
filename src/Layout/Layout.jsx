import Navbar from '@/components/Header/Navbar'
import Sidebar from '@/components/Header/Sidebar'
import React from 'react'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <>
    <Navbar />
    <Sidebar />
    <main className='ml-[5rem] p-5'>
    <Outlet />
    </main>
    </>
  )
}

export default Layout