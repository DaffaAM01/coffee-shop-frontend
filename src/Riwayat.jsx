import LayoutUser from "./LayoutUser";
import { useEffect, useState } from "react";
import api from "./api/api";

import {
    FaClipboardList,
    FaCalendarAlt,
    FaMoneyBillWave,
    FaBoxOpen,
    FaChevronRight,
    FaMapMarkerAlt,
    FaPhone,
    FaUser
} from "react-icons/fa";

function Riwayat() {

    const [transaksi,setTransaksi] = useState([]);
    const [loading,setLoading] = useState(true);

    const [detail,setDetail] = useState(null);

    useEffect(()=>{

        getRiwayat();

    },[]);

    const getRiwayat = async()=>{

        try{

            const response = await api.get("/riwayat-transaksi",{

                headers:{
                    Authorization:`Bearer ${localStorage.getItem("user_token")}`
                }

            });

            setTransaksi(response.data.data);

        }

        catch(err){

            console.log(err);

        }

        finally{

            setLoading(false);

        }

    }

    const warnaStatus={

        Pending:"bg-yellow-100 text-yellow-700",

        Diproses:"bg-blue-100 text-blue-700",

        Dikirim:"bg-purple-100 text-purple-700",

        Selesai:"bg-green-100 text-green-700",

        Dibatalkan:"bg-red-100 text-red-700"

    }

    return(

<div>

<div className="max-w-6xl mx-auto px-4 py-10">

<h1 className="text-4xl font-bold">

Riwayat Pesanan

</h1>

<p className="text-gray-500 mt-2 mb-8">

Lihat seluruh pesanan Anda dan pantau status pesanan secara realtime.

</p>

{
loading?

<div className="text-center py-20">

Loading...

</div>

:

transaksi.length===0?

<div className="bg-white rounded-2xl shadow-lg p-10 text-center">

<FaClipboardList
className="mx-auto text-6xl text-gray-300"
/>

<h2 className="text-2xl font-bold mt-5">

Belum ada transaksi

</h2>

<p className="text-gray-500 mt-2">

Silahkan lakukan pemesanan terlebih dahulu.

</p>

</div>

:

<div className="space-y-5">

{

transaksi.map(item=>(

<div
key={item.id}
className="bg-white rounded-2xl shadow hover:shadow-xl duration-300 overflow-hidden"
>

<div className="flex justify-between items-center bg-gray-50 px-5 py-4">

<div>

<h2 className="font-bold">

{item.kode_transaksi}

</h2>

<div className="flex items-center gap-2 text-gray-500 text-sm mt-1">

<FaCalendarAlt/>

{item.tanggal}

</div>

</div>

<span
className={`px-4 py-2 rounded-full text-sm font-semibold ${warnaStatus[item.status_pesanan]}`}
>

{item.status_pesanan}

</span>

</div>

<div className="p-5">

<div className="space-y-3">

{

item.detail_transaksi.map((barang,index)=>(

<div
key={index}
className="flex justify-between items-center border-b pb-3"
>

<div>

<h3 className="font-semibold">

{barang.barang.nama}

</h3>

<p className="text-gray-500 text-sm">

{barang.jumlah} x Rp {Number(barang.harga).toLocaleString("id-ID")}

</p>

</div>

<div className="font-semibold">

Rp {Number(barang.subtotal).toLocaleString("id-ID")}

</div>

</div>

))

}

</div>

<div className="flex justify-between items-center mt-5">

<div>

<p className="text-gray-500">

Total Belanja

</p>

<h2 className="text-2xl font-bold text-amber-600">

Rp {Number(item.total).toLocaleString("id-ID")}

</h2>

</div>

<button

onClick={()=>setDetail(item)}

className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-3 rounded-xl flex items-center gap-2"
>

Detail

<FaChevronRight/>

</button>

</div>

</div>

</div>

))

}

</div>

}

</div>

{

detail &&

<div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">

<div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">

<div className="bg-amber-600 text-white p-6 flex justify-between">

<h2 className="text-2xl font-bold">

Detail Pesanan

</h2>

<button
onClick={()=>setDetail(null)}
className="text-3xl"
>

×

</button>

</div>

<div className="p-6">

<div className="grid md:grid-cols-2 gap-5">

<div className="flex gap-3">

<FaUser className="mt-1"/>

<div>

<p className="text-gray-500">

Nama

</p>

<p>

{detail.nama_pelanggan}

</p>

</div>

</div>

<div className="flex gap-3">

<FaPhone className="mt-1"/>

<div>

<p className="text-gray-500">

No HP

</p>

<p>

{detail.no_hp}

</p>

</div>

</div>

<div className="md:col-span-2 flex gap-3">

<FaMapMarkerAlt className="mt-1"/>

<div>

<p className="text-gray-500">

Alamat

</p>

<p>

{detail.alamat}

</p>

</div>

</div>

</div>

<hr className="my-6"/>

{

detail.detail_transaksi.map((barang,index)=>(

<div
key={index}
className="flex justify-between py-3 border-b"
>

<div>

<h3 className="font-semibold">

{barang.barang.nama}

</h3>

<p>

{barang.jumlah} x Rp {Number(barang.harga).toLocaleString("id-ID")}

</p>

</div>

<div>

Rp {Number(barang.subtotal).toLocaleString("id-ID")}

</div>

</div>

))

}

<div className="flex justify-between mt-6 text-2xl font-bold">

<span>Total</span>

<span className="text-amber-600">

Rp {Number(detail.total).toLocaleString("id-ID")}

</span>

</div>

</div>

</div>

</div>

}

</div>

    )

}

export default Riwayat;