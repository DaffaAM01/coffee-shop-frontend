import { useState, useEffect } from "react";
import api from "./api/api";

import {
    ResponsiveContainer,
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,

    BarChart,
    Bar,

    PieChart,
    Pie,
    Cell,
    Legend
} from "recharts";

import {
  FaBox,
  FaShoppingCart,
  FaMoneyBillWave,
  FaExclamationTriangle,
  FaSearch,
  FaCalendarAlt,
} from "react-icons/fa";

import Layout from "./Layout";

function DashboardCard({ icon, title, value, color }) {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 flex justify-between items-center border border-gray-100">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>

        <h2 className="text-3xl font-bold mt-2">
          {value}
        </h2>
      </div>

      <div
        className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl ${color}`}
      >
        {icon}
      </div>
    </div>
  );
}

function Dashboard() {

  const statusColor = {
    Pending: "bg-yellow-100 text-yellow-700",

    Diproses: "bg-blue-100 text-blue-700",

    Dikirim: "bg-purple-100 text-purple-700",

    Selesai: "bg-green-100 text-green-700",

    Dibatalkan: "bg-red-100 text-red-700",
  };

  const [dashboardData, setDashboardData] = useState({

    cards:{
        totalBarang:0,
        totalPendapatan:0,
        totalTransaksi:0,
        stokMenipis:0,
    },

    grafik:[],

    grafikPenjualan:[],

    transaksiTerbaru:{
        data:[],
        current_page:1,
        last_page:1
    }

});
  const COLORS = [
    "#f59e0b",
    "#10b981",
    "#3b82f6",
    "#ef4444",
    "#8b5cf6",
    "#ec4899",
    "#06b6d4",
];

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("semua");

  const [bulan, setBulan] = useState("semua");

  const [tahun, setTahun] = useState(new Date().getFullYear());

  const [page, setPage] = useState(1);

  useEffect(() => {

    getDashboard();

  }, [page, search, status, bulan, tahun]);

  const getDashboard = async () => {
    try {
        const response = await api.get("/dashboard", {
            params: {
                page,
                search,
                status,
                bulan,
                tahun,
            },
        });

        console.log(response.data);

        setDashboardData({
    ...response.data,
    grafikPenjualan: response.data.grafikPenjualan.map(item => ({
        ...item,
        total: Number(item.total),
    })),
});
    } catch (err) {
        console.log(err);
    }
};

  return (

    <>

      <div className="p-6 bg-gray-100 min-h-screen">

        <div className="mb-8">

          <h1 className="text-4xl font-bold">

            Dashboard

          </h1>

          <p className="text-gray-500 mt-2">

            Pantau statistik penjualan, pendapatan, stok barang,
            serta transaksi terbaru toko Anda.

          </p>

        </div>

        {/* CARD */}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

          <DashboardCard

            title="Total Barang"

            value={dashboardData.cards.totalBarang}

            color="bg-blue-500"

            icon={<FaBox />}

          />

          <DashboardCard

            title="Pendapatan"

            value={`Rp ${Number(
              dashboardData.cards.totalPendapatan
            ).toLocaleString("id-ID")}`}

            color="bg-green-500"

            icon={<FaMoneyBillWave />}

          />

          <DashboardCard

            title="Total Transaksi"

            value={dashboardData.cards.totalTransaksi}

            color="bg-amber-500"

            icon={<FaShoppingCart />}

          />

          <DashboardCard

            title="Stok Menipis"

            value={dashboardData.cards.stokMenipis}

            color="bg-red-500"

            icon={<FaExclamationTriangle />}

          />

        </div>

        {/* GRAFIK */}

        {/* GRAFIK */}
<div className="bg-white rounded-2xl shadow mt-8 p-6">

    {/* Filter */}
    <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 mb-8">

        <div>
            <h2 className="text-2xl font-bold">
                Statistik Penjualan
            </h2>
            <p className="text-gray-500">
                Pendapatan dan penjualan barang.
            </p>
        </div>

        <div className="flex flex-wrap gap-3">

            <select
    value={bulan}
    onChange={(e)=>setBulan(e.target.value)}
    className="border rounded-lg px-3 py-2"
>
    <option value="semua">Semua Bulan</option>
    <option value="1">Januari</option>
    <option value="2">Februari</option>
    <option value="3">Maret</option>
    <option value="4">April</option>
    <option value="5">Mei</option>
    <option value="6">Juni</option>
    <option value="7">Juli</option>
    <option value="8">Agustus</option>
    <option value="9">September</option>
    <option value="10">Oktober</option>
    <option value="11">November</option>
    <option value="12">Desember</option>
</select>

       <select
    value={tahun}
    onChange={(e)=>setTahun(e.target.value)}
    className="border rounded-lg px-3 py-2"
>
    <option value="2024">2024</option>
    <option value="2025">2025</option>
    <option value="2026">2026</option>
    <option value="2027">2027</option>
</select>

        </div>

    </div>

    {/* ================= GRAFIK ================= */}

    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

        {/* BAR CHART */}

        <div className="bg-gray-50 rounded-xl p-4">

            <h3 className="font-bold text-lg mb-4">
                Pendapatan Bulanan
            </h3>

            <ResponsiveContainer width="100%" height={320}>

                <BarChart data={dashboardData.grafik}>

                    <CartesianGrid strokeDasharray="3 3"/>

                    <XAxis dataKey="bulan"/>

                    <YAxis/>

                    <Tooltip
                        formatter={(value)=>
                            `Rp ${Number(value).toLocaleString("id-ID")}`
                        }
                    />

                    <Bar
                        dataKey="pendapatan"
                        fill="#d97706"
                        radius={[8,8,0,0]}
                    />

                </BarChart>

            </ResponsiveContainer>

        </div>

        {/* PIE CHART */}

        <div className="bg-gray-50 rounded-xl p-4">

            <h3 className="font-bold text-lg mb-4">
                Penjualan Barang
            </h3>

            <ResponsiveContainer width="100%" height={320}>

                <PieChart>

                    <Pie
                        data={dashboardData.grafikPenjualan || []}
                        dataKey="total"
                        nameKey="nama"
                        outerRadius={100}
                        label
                    >

                        {(dashboardData.grafikPenjualan || []).map((entry,index)=>(
                            <Cell
                                key={index}
                                fill={COLORS[index % COLORS.length]}
                            />
                        ))}

                    </Pie>

                    <Tooltip/>

                    <Legend/>

                </PieChart>

            </ResponsiveContainer>

        </div>

    </div>

</div>
        {/* ================= TRANSAKSI TERBARU ================= */}

<div className="bg-white rounded-2xl shadow mt-8">

    {/* Header */}

    <div className="p-6 border-b">

        <h2 className="text-2xl font-bold">

            Transaksi Terbaru

        </h2>

        <p className="text-gray-500 mt-1">

            Daftar transaksi terbaru yang terjadi pada toko.

        </p>

    </div>

    {/* Filter */}

    <div className="p-6 flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">

        <div className="relative w-full lg:w-96">

            <FaSearch className="absolute left-4 top-3.5 text-gray-400" />

            <input

                type="text"

                placeholder="Cari nama barang..."

                value={search}

                onChange={(e)=>setSearch(e.target.value)}

                className="w-full border rounded-xl pl-11 pr-4 py-3 focus:ring-2 focus:ring-amber-500 outline-none"

            />

        </div>

        <div className="flex flex-wrap gap-3">

            <select

                value={status}

                onChange={(e)=>setStatus(e.target.value)}

                className="border rounded-xl px-4 py-3"

            >

                <option value="semua">

                    Semua Status

                </option>

                <option value="Pending">

                    Pending

                </option>

                <option value="Diproses">

                    Diproses

                </option>

                <option value="Dikirim">

                    Dikirim

                </option>

                <option value="Selesai">

                    Selesai

                </option>

                <option value="Dibatalkan">

                    Dibatalkan

                </option>

            </select>

            <select

                value={bulan}

                onChange={(e)=>setBulan(e.target.value)}

                className="border rounded-xl px-4 py-3"

            >

                <option value="semua">Semua Bulan</option>

                <option value="1">Januari</option>

                <option value="2">Februari</option>

                <option value="3">Maret</option>

                <option value="4">April</option>

                <option value="5">Mei</option>

                <option value="6">Juni</option>

                <option value="7">Juli</option>

                <option value="8">Agustus</option>

                <option value="9">September</option>

                <option value="10">Oktober</option>

                <option value="11">November</option>

                <option value="12">Desember</option>

            </select>

            <select

                value={tahun}

                onChange={(e)=>setTahun(e.target.value)}

                className="border rounded-xl px-4 py-3"

            >

                <option>2024</option>

                <option>2025</option>

                <option>2026</option>

                <option>2027</option>

            </select>

        </div>

    </div>

    {/* ======================= DESKTOP ====================== */}

    <div className="hidden lg:block overflow-x-auto">

        <table className="w-full">

            <thead className="bg-amber-500 text-white">

                <tr>

                    <th className="py-4">No</th>

                    <th>Tanggal</th>

                    <th>Barang</th>

                    <th>Jumlah</th>

                    <th>Total</th>

                    <th>Status</th>

                </tr>

            </thead>

            <tbody>

                {

                dashboardData.transaksiTerbaru.data?.length>0 ?

                (

                    dashboardData.transaksiTerbaru.data.map((item,index)=>(

                        <tr

                        key={item.id}

                        className="border-b hover:bg-gray-50 transition"

                        >

                            <td className="text-center py-4">

                                {(page-1)*10+index+1}

                            </td>

                           <td className="border p-3">
  {new Date(item.tanggal).toLocaleString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })}
</td>

                            <td className="px-4 py-3 border">
    {item.detail_transaksi?.map(detail => (
        <div key={detail.id}>
            {detail.barang?.nama}
        </div>
    ))}
</td>

                            <td className="border p-3 text-center">
    {item.detail_transaksi?.reduce(
        (total, detail) => total + detail.jumlah,
        0
    )}
</td>

                            <td className="border px-4 py-3">

                                Rp {Number(item.total).toLocaleString("id-ID")}

                            </td>

                            <td className="px-4 py-3 border">

                                <span

                                className={`px-3 py-2 rounded-full text-sm font-semibold ${statusColor[item.status_pesanan]}`}

                                >

                                    {item.status_pesanan}

                                </span>

                            </td>

                        </tr>

                    ))

                )

                :

                (

                    <tr>

                        <td

                        colSpan="6"

                        className="py-10 text-center text-gray-500"

                        >

                            Belum ada transaksi.

                        </td>

                    </tr>

                )

                }

            </tbody>

        </table>

    </div>

    {/* ====================== MOBILE ====================== */}

    <div className="lg:hidden p-5 space-y-5">

        {

        dashboardData.transaksiTerbaru.data?.length>0 ?

        (

            dashboardData.transaksiTerbaru.data.map((item)=>(

                <div

                key={item.id}

                className="border rounded-2xl p-5 shadow-sm"

                >

                    <div className="flex justify-between">

                        <div>

                            <h3 className="font-bold text-lg">

                                {item.barang?.nama}

                            </h3>

                            <p className="text-gray-500">

                                {item.tanggal}

                            </p>

                        </div>

                        <span

                        className={`px-3 py-1 h-fit rounded-full text-sm font-semibold ${statusColor[item.status_pesanan]}`}

                        >

                            {item.status_pesanan}

                        </span>

                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-5">

                        <div>

                            <p className="text-gray-500 text-sm">

                                Jumlah

                            </p>

                            <h4 className="font-bold">

                                {item.jumlah}

                            </h4>

                        </div>

                        <div>

                            <p className="text-gray-500 text-sm">

                                Total

                            </p>

                            <h4 className="font-bold text-amber-600">

                                Rp {Number(item.total).toLocaleString("id-ID")}

                            </h4>

                        </div>

                    </div>

                </div>

            ))

        )

        :

        (

            <div className="text-center py-10 text-gray-500">

                Belum ada transaksi.

            </div>

        )

        }

    </div>
      </div>
{/* ================= PAGINATION ================= */}

<div className="border-t px-6 py-5 flex flex-col md:flex-row justify-between items-center gap-5">

    <div className="text-sm text-gray-500">

        Menampilkan halaman

        <span className="font-bold mx-1">

            {dashboardData.transaksiTerbaru.current_page}

        </span>

        dari

        <span className="font-bold mx-1">

            {dashboardData.transaksiTerbaru.last_page}

        </span>

    </div>

    <div className="flex items-center gap-2">

        <button

            disabled={page===1}

            onClick={()=>setPage(page-1)}

            className={`px-5 py-2 rounded-xl font-semibold transition

            ${page===1

                ?

                "bg-gray-200 text-gray-400 cursor-not-allowed"

                :

                "bg-amber-500 hover:bg-amber-600 text-white"

            }

            `}

        >

            ← Sebelumnya

        </button>

        {

        [...Array(dashboardData.transaksiTerbaru.last_page)].map((_,index)=>(

            <button

                key={index}

                onClick={()=>setPage(index+1)}

                className={`w-10 h-10 rounded-xl font-semibold transition

                ${page===index+1

                    ?

                    "bg-amber-500 text-white"

                    :

                    "bg-gray-100 hover:bg-gray-200"

                }

                `}

            >

                {index+1}

            </button>

        ))

        }

        <button

            disabled={page===dashboardData.transaksiTerbaru.last_page}

            onClick={()=>setPage(page+1)}

            className={`px-5 py-2 rounded-xl font-semibold transition

            ${page===dashboardData.transaksiTerbaru.last_page

                ?

                "bg-gray-200 text-gray-400 cursor-not-allowed"

                :

                "bg-amber-500 hover:bg-amber-600 text-white"

            }

            `}

        >

            Berikutnya →

        </button>

    </div>

</div>

</div>
    </>

  );
}

export default Dashboard;