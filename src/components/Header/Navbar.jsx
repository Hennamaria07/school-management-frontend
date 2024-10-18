import { LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "@/redux/features/authSlice";
import { axiosInstance } from "@/lib/utils";
import { LOGOUT_ADMIN, LOGOUT_LIBRARIAN, LOGOUT_STAFF } from "@/lib/constants";
import { toast } from "react-toastify";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = useSelector(state => state.auth.userInfo);
  const {role} = user;

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleLogout = () => {
    const url = role === "admin" ? LOGOUT_ADMIN : role === "librarian" ? LOGOUT_LIBRARIAN : role === "staff" ? LOGOUT_STAFF : null;
    if(url) {
      axiosInstance
        .post(url)
        .then(res => {
         toast.success(res.data.message);
         setTimeout(() => {
          dispatch(logout());
          navigate(`/`);
         }, 2000);
        })
        .catch(err => {
          toast.error(err.response.data.message || err.message);
        })
    }
  }
  return (
    <header className="bg-white shadow-sm ml-[5rem]">
      <div className="py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="lg:hidden mr-2" onClick={toggleSidebar}>
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="text-2xl font-semibold text-blue-800">Dashboard</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Avatar>
              <AvatarImage src={user?.photo?.url} alt={user?.name} />
              <AvatarFallback>{user?.name.split(' ').map(n => n[0]).join('').toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{user?.name}</span>
          </div>
          <Button variant="ghost" size="icon">
            <LogOut onClick={handleLogout} className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;