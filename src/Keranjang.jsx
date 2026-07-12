import LayoutUser from "./LayoutUser";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import api from "./api/api";

function Keranjang() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(() => {
    return JSON.parse(localStorage.getItem("cart")) || [];
  });
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);
  const tambahJumlah = (id) => {
    const update = cart.map((item) =>
      item.id === id
        ? {
            ...item,
            jumlah: item.jumlah < item.stok ? item.jumlah + 1 : item.jumlah,
            total:
              (item.jumlah < item.stok ? item.jumlah + 1 : item.jumlah) *
              Number(item.harga_jual),
          }
        : item,
    );

    setCart(update);
    localStorage.setItem("cart", JSON.stringify(update));
window.dispatchEvent(new Event("cartUpdated"));
  };
  const kurangJumlah = (id) => {
    const update = cart.map((item) =>
      item.id === id && item.jumlah > 1
        ? {
            ...item,
            jumlah: item.jumlah - 1,
            total: (item.jumlah - 1) * Number(item.harga_jual),
          }
        : item,
    );

    setCart(update);
localStorage.setItem("cart", JSON.stringify(update));
window.dispatchEvent(new Event("cartUpdated"));
  };
  const hapusBarang = (id) => {
    const update = cart.filter((item) => item.id !== id);
    setCart(update);
    localStorage.setItem("cart", JSON.stringify(update));
    window.dispatchEvent(new Event("cartUpdated"));
  };
  const totalBelanja = cart.reduce((total, item) => total + item.total, 0);
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutData, setCheckoutData] =useState({
    nama_penerima: "",
    no_hp: "",
    alamat: "",
    catatan: "",
    metode_pembayaran: "COD",
});
const bukaCheckout = () => {
    setShowCheckout(true);
}

const tutupCheckout = () => {
    setShowCheckout(false);
}
const checkout = async () => {
  try {
    await api.post(
      "/transaksi",
      {
        tanggal: new Date().toISOString().split("T")[0],

        tipe_transaksi: "Online",

        nama_pelanggan: checkoutData.nama_penerima,

        no_hp: checkoutData.no_hp,

        alamat: checkoutData.alamat,

        barang: checkoutItems.map((item) => ({
          barang_id: item.id,
          jumlah: item.jumlah,
        })),

        metode_pembayaran: checkoutData.metode_pembayaran,

        status_pembayaran:
          checkoutData.metode_pembayaran === "COD"
            ? "Belum Bayar"
            : "Lunas",

        status_pesanan: "Pending",

        catatan: checkoutData.catatan,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("user_token")}`,
        },
      }
    );

    alert("Pesanan berhasil dibuat");

    const sisaCart = cart.filter(
      (cartItem) =>
        !checkoutItems.some((item) => item.id === cartItem.id)
    );

    setCart(sisaCart);

    localStorage.setItem("cart", JSON.stringify(sisaCart));

    window.dispatchEvent(new Event("cartUpdated"));

    setShowCheckout(false);
  } catch (err) {
    console.log(err.response?.data);
    alert("Checkout gagal");
  }
};
const [checkoutItems, setCheckoutItems] = useState([]);
const checkoutSatuBarang = (item) => {
    setCheckoutItems([item]);
    setShowCheckout(true);
};
const checkoutSemua = () => {
    setCheckoutItems(cart);
    setShowCheckout(true);
};
const totalCheckout = checkoutItems.reduce(
    (total, item) => total + item.total,
    0
);
  return (
    <div>
      <section className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-4xl font-bold text-center">Keranjang Belanja</h1>
        <p className="text-center text-gray-500 mt-3 mb-10">
          Berikut daftar produk yang akan Anda pesan.
        </p>
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <FaShoppingCart size={90} className="text-gray-300" />

            <h2 className="text-3xl font-bold mt-6">Keranjang Masih Kosong</h2>

            <p className="text-gray-500 mt-3 text-center">
              Yuk pilih makanan dan minuman favoritmu terlebih dahulu.
            </p>

            <button
              onClick={() => navigate("/produk")}
              className="mt-8 bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-xl"
            >
              Belanja Sekarang
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-8">
              {cart.map((item) => (
                <div
    key={item.id}
    className="bg-white rounded-2xl shadow-lg overflow-hidden"
>
    <div className="grid lg:grid-cols-3 gap-6 p-5">

        {/* Gambar */}
        <div>
            <img
                src={item.gambar}
                alt={item.nama}
                className="w-full h-56 object-contain rounded-xl bg-gray-100"
            />
        </div>

        {/* Informasi */}
        <div className="lg:col-span-2">

            <h2 className="text-2xl font-bold">
                {item.nama}
            </h2>

            <p className="mt-4">
                <span className="font-semibold">
                    Harga :
                </span>{" "}
                Rp {Number(item.harga_jual).toLocaleString()}
            </p>

            <p className="mt-2">
                <span className="font-semibold">
                    Stok :
                </span>{" "}
                {item.stok}
            </p>

            <div className="flex items-center gap-3 mt-5">
                <span className="font-semibold">
                    Jumlah :
                </span>

                <button
                    onClick={() => kurangJumlah(item.id)}
                    className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300"
                >
                    -
                </button>

                <span className="font-bold">
                    {item.jumlah}
                </span>

                <button
                    onClick={() => tambahJumlah(item.id)}
                    className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300"
                >
                    +
                </button>
            </div>

            <p className="mt-5 text-xl font-bold text-amber-600">
                Total :
                {" "}Rp {Number(item.total).toLocaleString()}
            </p>

        </div>

    </div>

    {/* Tombol */}
    <div className="grid grid-cols-2 gap-4 p-5 pt-0">

        <button
            onClick={() => hapusBarang(item.id)}
            className="bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-semibold transition"
        >
            Hapus
        </button>

        <button
    onClick={() => checkoutSatuBarang(item)}
    className="bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-xl font-semibold transition"
>
    Pesan Sekarang
</button>

    </div>
</div>
              ))}
            </div>
            <div className="mt-10 bg-white shadow-lg rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center">
              <h2 className="text-2xl font-bold">Total Belanja</h2>
              <div className="text-right">
                <p className="text-3xl font-bold text-amber-600">
                  Rp {totalBelanja.toLocaleString()}
                </p>
               <button
    onClick={checkoutSemua}
    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold"
>
    Pesan Semua
</button>
              </div>
            </div>
          </>
        )}
      </section>
      {
showCheckout && (

<div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">

<div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">

<h2 className="text-3xl font-bold text-center mb-6">

Checkout Pesanan

</h2>

<div className="space-y-5">

{
checkoutItems.map((item)=>(
<div
key={item.id}
className="flex gap-4 border rounded-xl p-3"
>

<img
src={item.gambar}
className="w-24 h-24 object-contain bg-gray-100 rounded"
/>

<div className="flex-1">

<h3 className="font-bold">

{item.nama}

</h3>

<p>

Harga :
Rp {Number(item.harga_jual).toLocaleString()}

</p>

<p>

Jumlah : {item.jumlah}

</p>

<p className="font-bold text-amber-600">

Total :
Rp {Number(item.total).toLocaleString()}

</p>

</div>

</div>
))
}

<div>

<label className="font-semibold">

Nama Penerima

</label>

<input
type="text"
className="w-full border rounded-lg p-3 mt-2"
value={checkoutData.nama_penerima}
onChange={(e)=>
setCheckoutData({
...checkoutData,
nama_penerima:e.target.value
})
}
/>

</div>

<div>

<label className="font-semibold">

No HP

</label>

<input
type="text"
className="w-full border rounded-lg p-3 mt-2"
value={checkoutData.no_hp}
onChange={(e)=>
setCheckoutData({
...checkoutData,
no_hp:e.target.value
})
}
/>

</div>

<div>

<label className="font-semibold">

Alamat

</label>

<textarea
rows={3}
className="w-full border rounded-lg p-3 mt-2"
value={checkoutData.alamat}
onChange={(e)=>
setCheckoutData({
...checkoutData,
alamat:e.target.value
})
}
/>

</div>

<div>

<label className="font-semibold">

Catatan

</label>

<textarea
rows={2}
className="w-full border rounded-lg p-3 mt-2"
value={checkoutData.catatan}
onChange={(e)=>
setCheckoutData({
...checkoutData,
catatan:e.target.value
})
}
/>

</div>

<div>

<label className="font-semibold">

Metode Pembayaran

</label>

<select
className="w-full border rounded-lg p-3 mt-2"
value={checkoutData.metode_pembayaran}
onChange={(e)=>
setCheckoutData({
...checkoutData,
metode_pembayaran:e.target.value
})
}
>

<option value="COD">

COD

</option>

<option value="Transfer">

Transfer

</option>

</select>

</div>

<div className="border-t pt-5">

<h2 className="text-2xl font-bold">

Total Bayar

</h2>

<p className="text-3xl font-bold text-amber-600 mt-2">

Rp {totalCheckout.toLocaleString()}

</p>

</div>

<div className="grid grid-cols-2 gap-4 mt-8">

<button
onClick={tutupCheckout}
className="bg-gray-300 rounded-xl py-3"
>

Batal

</button>

<button
onClick={checkout}
className="bg-green-600 hover:bg-green-700 text-white rounded-xl py-3"
>

Pesan Sekarang

</button>

</div>

</div>

</div>

</div>

)
}
    </div>
  );
}
export default Keranjang;
