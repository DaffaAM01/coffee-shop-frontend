import LayoutUser from "./LayoutUser";
import { Link } from "react-router-dom";
import HeroSlider from "./HeroSlider";
import tentangKami from "./assets/tentangKami.png";
import api from "./api/api";
import { FaArrowRight } from "react-icons/fa";
import { useEffect, useState } from "react";
import { FaPhoneAlt, FaInstagram, FaTiktok, FaMapMarkerAlt } from "react-icons/fa";
function Home(){
    const user = JSON.parse(localStorage.getItem("user"));
    const [barang, setBarang] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        getBarang();
    },[]);
    const getBarang = async () => {
        try {
         const response = await api.get("/barang");
         setBarang(response.data.data);
        }catch (err) {
            console.log(err);
        }finally {
            setLoading(false)
        }
    };
    const kategoriList = [...new Set(barang.map((item) => item.kategori))].slice(0, 4);
    return(
        <>
        <section className="bg-gray-50">
            <div className="max-w-7xl mx-auto px-6 py-10">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                            Selamat Datang 
                            <span className="text-amber-600">{" "}{user?.name}</span>
                            <br />Di Website Kami
                        </h1>
                        <p className="text-gray-600 mt-6 leading-8">
                            Nikmati berbagai pilihan makanan dan minuman
                            berkualitas dengan harga terbaik.
                            Kami menghadirkan pengalaman berbelanja
                            yang mudah, cepat, dan nyaman untuk semua pelanggan.
                        </p>
                        <Link to="/produk" className="inline-block mt-8 bg-amber-600 hover:bg-amber-700 transition text-white px-7 py-3 rounded-xl">
                        Lihat Produk
                        </Link>
                    </div>
                    <HeroSlider />
                </div>
            </div>
        </section>
        <section className="bg-white py-20">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-14">
                    <h2 className="text-4xl font-bold">
                        Tentang <span className="text-amber-600">Kami</span>
                    </h2>
                    <p className="text-gray-500 mt-3">
                        Mengenal InventoryStore lebih dekat
                    </p>
                </div>
                <div className="grid md:grid-cols-2 gap-14 items-center">
                    <div>
                        <p className="text-gray-600 leading-8 text-justify">
                            InventoryStore merupakan website yang menyediakan berbagai
                            pilihan makanan dan minuman berkualitas untuk memenuhi
                            kebutuhan pelanggan. Kami menghadirkan produk yang selalu
                            segar, harga yang bersahabat, serta proses pemesanan yang
                            cepat dan mudah.
                            <br /><br />
                             Dengan tampilan yang sederhana dan modern, pelanggan dapat
                             menjelajahi berbagai menu, melihat detail produk,
                             menambahkan ke keranjang, hingga melakukan transaksi
                             dengan nyaman.
                             
                        </p>
                        <div>
          <h4 className="text-xl font-semibold mb-4">
            <br></br>
            Keunggulan:
          </h4>

          <ul className="space-y-3 text-gray-700">
            <li>✅ Produk selalu fresh dan berkualitas</li>
            <li>✅ Banyak pilihan makanan & minuman</li>
            <li>✅ Harga terjangkau</li>
            <li>✅ Pemesanan mudah dan cepat</li>
            <li>✅ Pelayanan ramah dan responsif</li>
            <li>✅ Pengiriman cepat dan aman</li>
          </ul>
        </div>
                    </div>
                    <div>
                       <img src={tentangKami} alt="Tentang Kami" className="rounded-3xl shadow-xl w-full object-cover" />
                    </div>
                </div>
            </div>
        </section>
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <h2 className="text-4xl font-bold text-center">
                    Produk
                </h2>
                <p className="text-center text-gray-500 mt-3 mb-12">
                 Pilihan makanan dan minuman terbaik yang tersedia di toko kami.
                </p>
                {loading ?(
                    <div className="text-center">
                        Loading...
                    </div>
                ) : (
                    kategoriList.map((kategori) => {
                     const produkKategori = barang
                       .filter((item) => item.kategori === kategori)
                       .slice(0, 3);
                    return (
                        <div key={kategori} className="mb-20">
                            <h3 className="text-2xl font-bold text-amber-600 mb-8">
                                {kategori}
                            </h3>
                            <div className="grid lg:grid-cols-4 gap-8 items-start">
                                 <div className="lg:col-span-3 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {produkKategori.map((item) => (
                                        <div key={item.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition">
                                            <img src={item.gambar} alt={item.nama} className="w-full h-56 object-cover" />
                                            <div className="p-5">
                                                <h4 className="font-bold text-xl">
                                                    {item.nama}
                                                </h4>
                                                <p className="text-amber-600 font-bold mt-2">
                                                    Rp{" "} {Number(item.harga_jual).toLocaleString()}
                                                </p>
                                                <p className="text-sm mt-2">
                                                    <span className="font-semibold">
                                                        Stok : </span>{" "}{item.stok}                                                    
                                                </p>
                                                <p className="text-gray-600 mt-3 line-clamp-3">
                                                    {item.deskripsi}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                 </div>
                                 <div className="flex flex-col items-center justify-center h-full">
                                    <Link to="/produk" className="w-20 h-20 rounded-full bg-amber-600 hover:bg-amber-700 text-white flex items-center justify-center transition">
                                      <FaArrowRight size={20} />
                                    </Link> 
                                    <p className="mt-4 font-semibold text-center">
                                        Lihat semua Produk
                                    </p>
                                 </div>
                            </div>
                        </div>
                    )
                    })
                )}
            </div>
        </section>
        <section>
            <footer className="bg-gray-900 text-white mt-20">
                <div className="max-w-7xl mx-auto px-6 py-14">
                    <h2 className="text-3xl font-bold text-center mb-12">
                        Hubungi Kami
                    </h2>
                    <div className="space-y-10 text-center">
                        <div>
                            <FaPhoneAlt className="mx-auto text-amber-500 text-3xl mb-3" />
                            <h3 className="font-semibold text-xl">
                                No. Telepon
                            </h3>
                            <p className="text-gray-300 mt-2">
                                085859225861
                            </p>
                            <div>
                            <FaInstagram className="mx-auto text-pink-500 text-3xl mb-3 mt-3" />
                            <h3 className="font-semibold text-xl">
                              Akun Instagram
                            </h3>
                            <a href="https://www.instagram.com/daffaadityamahandika?igsh=ZnIxODVldWxtZmRu"
                               target="_blank" rel="noopener noreferrer"
                               className="text-gray-300 hover:text-amber-500"
                            >
                               @DAFFA_XML5
                            </a>
                            </div>
                            <div>
                            <FaTiktok className="mx-auto text-3xl mb-3 mt-3" />
                            <h3 className="font-semibold text-xl">
                              Akun TikTok
                            </h3>
                            <a href="https://www.tiktok.com/@daffa.am1?_r=1&_t=ZS-97rM22Z8VHt" 
                               target="_blank" rel="noopener noreferrer"
                               className="text-gray-300 hover:text-amber-500"
                            >
                              @daffa_am1
                            </a>
                            </div>
                            <div>
                            <FaMapMarkerAlt className="mx-auto text-red-500 text-3xl mb-3 mt-3" />
                            <h3 className="font-semibold text-xl">
                              Alamat
                            </h3>
                            <p className="text-gray-300 mt-2">
                              Jl. Raya Barek-Desa Plumbangan,Kec.Doko Kab.Blitar
                              <br />
                              Jawa Timur, Indonesia
                            </p>
                            </div>
                        </div>
                        <div className="border-t border-gray-700 mt-12 pt-6 text-center text-gray-400 text-sm">
                          © {new Date().getFullYear()} InventoryStore.
                          All Rights Reserved.
                        </div>
                    </div>
                </div>
            </footer>
        </section>
        </>
    );
}
export default Home;