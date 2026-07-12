import { NavLink, Outlet, useNavigate } from "react-router-dom";
import api from "./api/api";
import { useState } from "react";
function Layout(){
    const [open, setOpen] = useState(false);
     const navigate = useNavigate();
     const logout = async () => {
    try {
        await api.post("/logout");
    } catch (err) {
        console.log(err);
    }

    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin");

    navigate("/admin/login");
};
   return (
    
   <div className="flex min-h-screen bg-gray-100">
{/* Navbar Mobile */}
<div className="fixed top-0 left-0 right-0 bg-white shadow flex justify-between items-center px-5 py-4 md:hidden z-50">
    <h1 className="text-xl font-bold">Admin</h1>

    <button
        onClick={() => setOpen(!open)}
        className="text-3xl"
    >
        ☰
    </button>
</div>
       <div
    className={`
    fixed md:sticky
    top-0 h-screen
     left-0
    w-64
    bg-white
    shadow-lg
    p-5
    flex
    flex-col
    transform
    transition-transform
    duration-300
    z-50

    ${open ? "translate-x-0" : "-translate-x-full"}

    md:translate-x-0
`}
>

            <h1 className="text-2xl font-bold mb-8">
                Admin
            </h1>

            <ul className="space-y-3">

                <li>
                    <NavLink
                        to="/dashboard"
                          onClick={() => setOpen(false)}
                        className={({ isActive }) =>
                            isActive
                                ? "block bg-amber-700 p-3 rounded-lg text-white"
                                : "block hover:bg-gray-300 p-3 rounded-lg"
                        }
                    >
                       
                        Dashboard
                    </NavLink>
                </li>

                <li>
                    <NavLink
                        to="/barang"
                        onClick={() => setOpen(false)}
                        className={({ isActive }) =>
                            isActive
                                ? "block bg-amber-700 p-3 rounded-lg text-white"
                                : "block hover:bg-gray-300 p-3 rounded-lg"
                        }
                    >
                        
                        Barang
                    </NavLink>
                </li>

                <li>
                    <NavLink
                        to="/transaksi"
                        onClick={() => setOpen(false)}
                        className={({ isActive }) =>
                            isActive
                                ? "block bg-amber-700 p-3 rounded-lg text-white"
                                : "block hover:bg-gray-300 p-3 rounded-lg"
                        }
                    >
                        Transaksi
                    </NavLink>
                </li>

            </ul>

            <div className="mt-auto">
                <button
                    onClick={logout}
                    className="w-full bg-red-600 text-white p-3 rounded-lg"
                >
                    Logout
                </button>
            </div>

        </div>
 {open && (
    <div
        className="fixed inset-0 bg-black/40 md:hidden"
        onClick={() => setOpen(false)}
    />
)}
       <div className="flex-1 p-4 md:p-6 md:ml-0 mt-16 md:mt-0">
    <Outlet />
</div>
    </div>
);
}
export default Layout;