import { useState } from "react";
import api from "./api/api";
import { useNavigate } from "react-router-dom";

function Login() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

   const login = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
        alert("Email dan Password wajib diisi");
        return;
    }

    try {

        const response = await api.post("/admin/login", formData);

        localStorage.setItem("admin_token", response.data.token);
localStorage.setItem("admin", JSON.stringify(response.data.user));

        navigate("/dashboard");

    } catch (err) {

        alert(err.response?.data?.message || "Login gagal");

    }

};
const logout = async () => {
    try {
        await api.post("/admin/logout");
    } catch (err) {
        console.log(err);
    }

    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin");

    navigate("/");
};

    return (
        <div className="h-screen flex justify-center items-center bg-gray-100">
            <div className="bg-white w-96 p-6 rounded-lg shadow">

                <h1 className="text-2xl font-bold mb-6 text-center">
                    Login Admin
                </h1>

                <form onSubmit={login} className="space-y-4">

                    <div>
                        <label>Email</label>

                        <input
                        required
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full border rounded p-2"
                        />
                    </div>

                    <div>
                        <label>Password</label>

                        <input
                        required
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full border rounded p-2"
                        />
                    </div>
                    
                    <button type="submit"
                        className="w-full bg-amber-600 text-white py-2 rounded"
                    >
                        Login
                    </button>
                   </form>
                </div>

            </div>
    );
}

export default Login;