import LayoutUser from "./LayoutUser";
import { useEffect, useState } from "react";
import api from "./api/api";
import { FaShoppingCart, FaBolt } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

function Produk(){
     const [barang, setBarang] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getBarang();
    }, []);

    const getBarang = async () => {
        try {
            const response = await api.get("/barang");
            setBarang(response.data.data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };
    const kategoriList = [
        ...new Set(barang.map((item) => item.kategori)),
    ];
    const [showModal, setShowModal] = useState(false);
    const [selectedBarang, setSelectedBarang] = useState(null);
    const [jumlah, setJumlah] = useState(1);
    const bukaModal = (barang) => {
    setSelectedBarang(barang);
    setJumlah(1);
    setShowModal(true);
    };
    const tutupModal = () => {
    setShowModal(false);
    setSelectedBarang(null);
    setJumlah(1);
    };
    const masukkanKeranjang = () => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const index = cart.findIndex(
        item => item.id === selectedBarang.id
    );
    if (index !== -1) {
        cart[index].jumlah += jumlah;
        cart[index].total =
            cart[index].jumlah *
            Number(cart[index].harga_jual);
    } else {
        const itemBaru = {
    id: selectedBarang.id,
    nama: selectedBarang.nama,
    kategori: selectedBarang.kategori,
    harga_jual: selectedBarang.harga_jual,
    stok: selectedBarang.stok,
    gambar: selectedBarang.gambar,
    deskripsi: selectedBarang.deskripsi,
    jumlah: jumlah,
    total: jumlah * Number(selectedBarang.harga_jual),
};

cart.push(itemBaru);

    }
    localStorage.setItem("cart", JSON.stringify(cart));
window.dispatchEvent(new Event("cartUpdated"));
console.log(cart);

tutupModal();
    };
    return(
        <div>
             <section className="bg-gray-50 py-14">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-14">
                         <h1 className="text-4xl font-bold">
                        Produk Kami
                    </h1>
                     <p className="text-gray-500 mt-4">
                        Temukan berbagai makanan dan minuman favorit dengan kualitas terbaik.
                    </p>
                    </div>
                     {loading ? (
                    <div className="text-center">
                        Loading...
                    </div>
                ) : (
                    kategoriList.map((kategori) => {
                        const produkKategori = barang.filter(
                            (item) => item.kategori === kategori
                        );
                        return (
                            <div
                                key={kategori}
                                className="mb-16"
                            >
                                <h2 className="text-2xl font-bold text-amber-600 mb-8">
                                    {kategori}
                                </h2>
                                <Swiper
                                    modules={[Navigation, Pagination]}
                                    navigation
                                    pagination={{ clickable: true }}
                                    spaceBetween={25}
                                    breakpoints={{
                                        0: {
                                            slidesPerView: 1,
                                        },
                                        640: {
                                            slidesPerView: 2,
                                        },
                                        1024: {
                                            slidesPerView: 3,
                                        },
                                    }}
                                >
                                    {produkKategori.map((item) => (
                                        <SwiperSlide key={item.id}>
                                            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300">
                                                <div className="w-full h-60 bg-gray-50 flex items-center justify-center p-4 rounded-t-2xl">
    <img
        src={item.gambar}
        alt={item.nama}
        className="w-full h-full object-contain"
    />
</div>
                                                <div className="p-5">
                                                    <h3 className="text-xl font-bold">
                                                        {item.nama}
                                                    </h3>
                                                    <p className="text-amber-600 font-bold text-lg mt-2">
                                                        Rp{" "}
                                                        {Number(
                                                            item.harga_jual
                                                        ).toLocaleString()}
                                                    </p>
                                                    <p className="mt-2">
                                                        <span className="font-semibold">
                                                            Stok :
                                                        </span>{" "}
                                                        {item.stok}
                                                    </p>
                                                    <p className="text-gray-600 mt-3 line-clamp-3">
                                                        {item.deskripsi}
                                                    </p>
                                                    <div className="grid grid-cols-2 gap-3 mt-6">
                                                        <button
                                                            onClick={() => bukaModal(item)}
                                                            className="flex items-center justify-center gap-2 border-2 border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white rounded-xl py-3 transition"
                                                        >
                                                            <FaShoppingCart />
                                                            Keranjang
                                                        </button>
                                                        <button
                                                            className="flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl py-3 transition"
                                                        >
                                                            <FaBolt />
                                                            Beli
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </div>
                        );
                    })
                )}
</div>
</section>
{showModal && selectedBarang && (

<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

<div className="bg-white rounded-2xl max-w-md w-full p-6">

<h2 className="text-2xl font-bold text-center mb-5">

Checkout Produk

</h2>

<img
src={selectedBarang.gambar}
alt={selectedBarang.nama}
className="w-full h-56 object-contain rounded-xl bg-gray-100"
/>

<h3 className="font-bold text-xl mt-5">

{selectedBarang.nama}

</h3>

<p className="mt-3">

Harga :

<b>

Rp {Number(selectedBarang.harga_jual).toLocaleString()}

</b>

</p>

<div className="flex justify-between items-center mt-5">

<p className="font-semibold">

Jumlah

</p>

<div className="flex items-center gap-3">

<button

onClick={() =>

jumlah > 1 && setJumlah(jumlah - 1)

}

className="w-9 h-9 rounded-full bg-gray-200"

>

-

</button>

<span className="text-lg font-bold">

{jumlah}

</span>

<button

onClick={() => setJumlah(jumlah + 1)}

className="w-9 h-9 rounded-full bg-gray-200"

>

+

</button>

</div>

</div>

<p className="text-xl text-amber-600 font-bold mt-6">

Total :

Rp {(jumlah * Number(selectedBarang.harga_jual)).toLocaleString()}

</p>

<div className="flex gap-3 mt-8">

<button

onClick={tutupModal}

className="w-1/2 py-3 rounded-xl bg-gray-300"

>

Batal

</button>

<button

onClick={masukkanKeranjang}

className="w-1/2 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white"

>

Masukkan Keranjang

</button>

</div>

</div>

</div>

)}
        </div>
    );
}
export default Produk;