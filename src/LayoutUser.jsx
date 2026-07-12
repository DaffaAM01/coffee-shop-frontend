
import { Outlet, Link, useNavigate } from "react-router-dom";
import {
  FaShoppingCart,
  FaHistory,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import api from "./api/api";
import { useEffect, useState } from "react";
function LayoutUser() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("user_token");

  const isLogin = !!token;

  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem("cart")) || []
);

const totalCart = cart.reduce(
    (total, item) => total + item.jumlah,
    0
);
useEffect(() => {
    const updateCart = () => {
        setCart(JSON.parse(localStorage.getItem("cart")) || []);
    };

    updateCart();

    window.addEventListener("cartUpdated", updateCart);

    return () => {
        window.removeEventListener("cartUpdated", updateCart);
    };
}, []);

  const logout = async () => {
    try {
      await api.post(
        "/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (err) {
      console.log(err);
    }

    localStorage.removeItem("user");
    localStorage.removeItem("user_token");

    setOpen(false);
    navigate("/login");
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-5">
          <div className="flex justify-between items-center h-18">

            <Link
              to="/"
              className="text-2xl font-bold text-amber-600"
            >
              Inventory
              <span className="text-black">Store</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">

              <Link to="/" className="hover:text-amber-600">
                Home
              </Link>

              <Link to="/produk" className="hover:text-amber-600">
                Produk
              </Link>

              {isLogin && (
                <Link
                  to="/keranjang"
                  className="relative hover:text-amber-600"
                >
                  <FaShoppingCart size={20} />

                  {totalCart > 0 && (
                    <span className="absolute -top-2 -right-3 bg-red-500 text-white rounded-full w-5 h-5 flex justify-center items-center text-xs">
                      {totalCart}
                    </span>
                  )}
                </Link>
              )}

              {isLogin && (
                <Link
                  to="/riwayat"
                  className="flex items-center gap-2 hover:text-amber-600"
                >
                  <FaHistory />
                  Riwayat
                </Link>
              )}

              {!isLogin ? (
                <Link
                  to="/login"
                  className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2 rounded-lg"
                >
                  Login
                </Link>
              ) : (
                <div className="flex items-center gap-3">
                  <span>{user?.name}</span>

                  <button
                    onClick={logout}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => setOpen(!open)}
              className="md:hidden"
            >
              {open ? <FaTimes size={25} /> : <FaBars size={25} />}
            </button>

          </div>
        </div>

        {open && (
          <div className="md:hidden border-t">
            <div className="flex flex-col gap-5 p-5">

              <Link to="/" onClick={() => setOpen(false)}>
                Home
              </Link>

              <Link to="/produk" onClick={() => setOpen(false)}>
                Produk
              </Link>

              {isLogin && (
                <Link to="/keranjang" onClick={() => setOpen(false)}>
                  Keranjang
                </Link>
              )}

              {isLogin && (
                <Link to="/riwayat" onClick={() => setOpen(false)}>
                  Riwayat
                </Link>
              )}

              {!isLogin ? (
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="bg-amber-600 text-white text-center py-2 rounded-lg"
                >
                  Login
                </Link>
              ) : (
                <>
                  <div className="text-center font-semibold">
                    {user?.name}
                  </div>

                  <button
                    onClick={logout}
                    className="bg-red-500 text-white py-2 rounded-lg"
                  >
                    Logout
                  </button>
                </>
              )}

            </div>
          </div>
        )}
      </nav>

      {/* Halaman akan tampil di bawah navbar */}
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default LayoutUser;