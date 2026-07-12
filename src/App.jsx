import { Routes, Route } from "react-router-dom";

import Login from "./Login";
import Dashboard from "./Dashboard";
import Barang from "./Barang";
import Transaksi from "./Transaksi";

import Layout from "./Layout";
import ProtectedRoute from "./ProtectedRoute";
import LoginUser from "./LoginUser";
import RegisterUser from "./RegisterUser";

import LayoutUser from "./LayoutUser";
import UserProtectedRoute from "./UserProtectedRoute";

import Home from "./Home";
import Produk from "./Produk";
import Keranjang from "./Keranjang";
import Riwayat from "./Riwayat";

function App() {
    return (
        <Routes>

            {/* ===================== */}
            {/* ADMIN */}
            {/* ===================== */}

            <Route
                path="/admin"
                element={<Login />}
            />

            <Route element={<ProtectedRoute />}>
                <Route element={<Layout />}>
                    <Route
                        path="/dashboard"
                        element={<Dashboard />}
                    />
                    <Route
                        path="/barang"
                        element={<Barang />}
                    />
                    <Route
                        path="/transaksi"
                        element={<Transaksi />}
                    />
                </Route>
            </Route>

            {/* ===================== */}
            {/* USER */}
            {/* ===================== */}
<Route
                    path="/login"
                    element={<LoginUser />}
                />

                <Route
                    path="/register"
                    element={<RegisterUser />}
                />
            <Route element={<LayoutUser />}>

                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/produk"
                    element={<Produk />}
                />

                

                {/* Route yang wajib login */}

                <Route element={<UserProtectedRoute />}>

                    <Route
                        path="/keranjang"
                        element={<Keranjang />}
                    />

                    <Route
                        path="/riwayat"
                        element={<Riwayat />}
                    />

                </Route>

            </Route>

        </Routes>
    );
}

export default App;