import { useState } from "react";
import { Link, useNavigate} from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";
import api from "./api/api";
function LoginUser() {
const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev)=>({
      ...prev,
      [e.target.name]:e.target.value,
    }));
  };

 const handleLogin = async (e) => {
  e.preventDefault();

  if (!formData.email || !formData.password) {
    alert("Email dan Password wajib diisi");
    return;
  }

  try {
    const response = await api.post("/login", formData);

    localStorage.setItem("user_token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));

    alert(response.data.message);

    navigate("/");
  } catch (err) {
    alert(err.response?.data?.message || "Login gagal");
  }
};

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center px-5">

      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">

        <h1 className="text-3xl font-bold text-center">
          Login
        </h1>

        <p className="text-center text-gray-500 mb-8">
          Selamat datang kembali
        </p>

        <form
          onSubmit={handleLogin}
          className="space-y-5"
        >

          <div>

            <label>Email</label>

            <div className="border rounded-lg flex items-center mt-2 px-3">

              <FaEnvelope className="text-gray-400"/>

             <input
    type="email"
    name="email"
    value={formData.email}
    onChange={handleChange}
    required
    className="w-full p-3 outline-none"
    placeholder="Email"
/>

            </div>

          </div>

          <div>

            <label>Password</label>

            <div className="border rounded-lg flex items-center mt-2 px-3">

              <FaLock className="text-gray-400"/>

              <input
    type="password"
    name="password"
    value={formData.password}
    onChange={handleChange}
    required
    className="w-full p-3 outline-none"
    placeholder="Password"
/>

            </div>

          </div>

          <button
            className="w-full bg-amber-600 hover:bg-amber-700 text-white rounded-lg py-3 font-semibold"
          >
            Login
          </button>

        </form>

        <p className="text-center mt-6">

          Belum punya akun?

          <Link
            to="/register"
            className="text-amber-600 font-semibold ml-2"
          >
            Daftar
          </Link>

        </p>

      </div>

    </div>
  );
}

export default LoginUser;