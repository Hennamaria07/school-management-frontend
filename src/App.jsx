import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AdminLibrarian, AdminStaff, LandingPage, LibraryHistroy, LoginConfig, StaffFeeHistory, Student, StudentConfig } from './pages'
import Layout from './Layout/Layout'
import ProtectedRouter, { AdminProtectedRouter } from './lib/protectedRouter'
import { useSelector } from 'react-redux'

const App = () => {
  const isAuthenticated = useSelector(state => state.auth?.isAuthenticated);
  const role = useSelector(state => state.auth?.userInfo?.role);
  console.log(isAuthenticated, role)
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/:role/login" element={<LoginConfig />} />
      <Route element={<Layout />}>
      <Route path='/admin/staff' element={<AdminProtectedRouter isAuthenticated={isAuthenticated} role={role}><AdminStaff /></AdminProtectedRouter>} />
      <Route path='/admin/librarian' element={<ProtectedRouter isAuthenticated={isAuthenticated} role={role}><AdminLibrarian /></ProtectedRouter>} />
      <Route path='/:role/student' element={<ProtectedRouter isAuthenticated={isAuthenticated} role={role}><Student /></ProtectedRouter>} />
      <Route path='/:role/student/:action' element={<ProtectedRouter isAuthenticated={isAuthenticated} role={role}><StudentConfig /></ProtectedRouter>} />
      <Route path='/:role/student/:action/:id' element={<ProtectedRouter isAuthenticated={isAuthenticated} role={role}><StudentConfig /></ProtectedRouter>} />
      <Route path='/:role/fees-history' element={<ProtectedRouter isAuthenticated={isAuthenticated} role={role}><StaffFeeHistory /></ProtectedRouter>} />
      <Route path='/:role/library-history' element={<ProtectedRouter isAuthenticated={isAuthenticated} role={role}><LibraryHistroy /></ProtectedRouter>} />
      </Route>
    </Routes>
    </BrowserRouter>
  )
}

export default App