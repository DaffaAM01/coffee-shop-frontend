import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaPhone, FaLock } from "react-icons/fa";
import api from "./api/api";
function RegisterUser() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    no_hp: "",
    password: "",
    password_confirmation: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/register", formData);

      alert(response.data.message);

      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Registrasi gagal");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center px-5">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg">
        <h1 className="text-3xl font-bold text-center mb-2">Register</h1>

        <p className="text-center text-gray-500 mb-8">Buat akun baru</p>

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label>Nama Lengkap</label>

            <div className="border rounded-lg flex items-center mt-2 px-3">
              <FaUser className="text-gray-400" />

              <input
                required
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 outline-none"
                placeholder="Nama lengkap"
              />
            </div>
          </div>

          <div>
            <label>Email</label>

            <div className="border rounded-lg flex items-center mt-2 px-3">
              <FaEnvelope className="text-gray-400" />

              <input
                required
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 outline-none"
                placeholder="Email"
              />
            </div>
          </div>

          <div>
            <label>No HP</label>

            <div className="border rounded-lg flex items-center mt-2 px-3">
              <FaPhone className="text-gray-400" />

              <input
                required
                type="text"
                name="no_hp"
                value={formData.no_hp}
                onChange={handleChange}
                className="w-full p-3 outline-none"
                placeholder="08xxxxxxxxxx"
              />
            </div>
          </div>

          <div>
            <label>Password</label>

            <div className="border rounded-lg flex items-center mt-2 px-3">
              <FaLock className="text-gray-400" />

              <input
                required
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 outline-none"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <label>Konfirmasi Password</label>

            <div className="border rounded-lg flex items-center mt-2 px-3">
              <FaLock className="text-gray-400" />

              <input
                required
                type="password"
                name="password_confirmation"
                value={formData.password_confirmation}
                onChange={handleChange}
                className="w-full p-3 outline-none"
                placeholder="Ulangi Password"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-amber-600 hover:bg-amber-700 text-white rounded-lg py-3 font-semibold"
          >
            Daftar
          </button>
        </form>

        <p className="text-center mt-6">
          Sudah punya akun?
          <Link to="/login" className="text-amber-600 font-semibold ml-2">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterUser;
