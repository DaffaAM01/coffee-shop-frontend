import Layout from "./Layout";
import { useState, useEffect } from "react";
import api from "./api/api";
import {
  FiFileText,
  FiFile,
  FiDownload,
  FiSearch,
  FiPlus,
} from "react-icons/fi";

function Transaksi() {
  const [transaksi, setTransaksi] = useState([]);
  const [barang, setBarang] = useState([]);
  const [selectedTransaksi, setSelectedTransaksi] = useState(null);
  const [showTambah, setShowTambah] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [loading, setLoading] = useState({
    tambah: false,
    update: false,
    hapus: false,
  });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [formData, setFormData] = useState({
    tanggal: "",
    tipe_transaksi: "",
    nama_pelanggan: "",
    no_hp: "",
    alamat: "",
    barang: [],
    barang_id: "",
    jumlah: "",
    metode_pembayaran: "Cash",
    status_pembayaran: "Lunas",
    status_pesanan: "Pending",
    catatan: "",
  });
  const [errors, setErrors] = useState({});
  const hitungJumlah = (jumlah) => {
    const qty = Number(jumlah);

    const harga = Number(formData.harga);

    setFormData((prev) => ({
      ...prev,

      jumlah: qty,

      total: qty * harga,
    }));
  };
  const validateForm = (data) => {
    let newErrors = {};
    if (data.tipe_transaksi === "Online" && !data.alamat.trim()) {
      newErrors.alamat = "Alamat wajib diisi";
    }

    if (data.tipe_transaksi === "Online" && !data.no_hp.trim()) {
      newErrors.no_hp = "Nomor HP wajib diisi";
    }

    if (!data.tanggal) {
      newErrors.tanggal = "Tanggal wajib diisi";
    }
    if (!data.nama_pelanggan.trim()) {
      newErrors.nama_pelanggan = "Nama pelanggan wajib diisi";
    }
    if (!data.barang || data.barang.length === 0) {
      newErrors.barang = "Barang belum dipilih";
    }

    data.barang.forEach((item) => {
      if (item.jumlah <= 0) {
        newErrors.barang = "Jumlah harus lebih dari 0";
      }
    });

    data.barang.forEach((item) => {
      const stokBarang = barang.find((b) => b.id == item.barang_id);

      if (!stokBarang) return;

      if (item.jumlah > stokBarang.stok) {
        newErrors.barang = "Stok tidak cukup";
      }
    });

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };
  const validateUpdate = (data) => {
    let newErrors = {};
    if (data.tipe_transaksi === "Online" && !data.alamat.trim()) {
      newErrors.alamat = "Alamat wajib diisi";
    }

    if (data.tipe_transaksi === "Online" && !data.no_hp.trim()) {
      newErrors.no_hp = "Nomor HP wajib diisi";
    }
    if (!data.tanggal) {
      newErrors.tanggal = "Tanggal wajib diisi";
    }
    if (!data.nama_pelanggan.trim()) {
      newErrors.nama_pelanggan = "Nama pelanggan wajib diisi";
    }
    if (!data.detail_transaksi || data.detail_transaksi.length === 0) {
      newErrors.detail_transaksi = "Barang belum dipilih";
    }
    data.detail_transaksi.forEach((item) => {
      if (item.jumlah <= 0) {
        newErrors.detail_transaksi = "Jumlah tidak valid";
      }
    });

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };
  const resetForm = () => {
    setErrors({});

    setFormData({
      tanggal: "",

      tipe_transaksi: "",

      nama_pelanggan: "",

      no_hp: "",

      alamat: "",

      barang: [],

      barang_id: "",

      kategori: "",

      harga: "",

      stok: "",

      jumlah: "",

      total: "",

      metode_pembayaran: "Cash",

      status_pembayaran: "Lunas",

      status_pesanan: "Pending",

      catatan: "",
    });
  };
  const getBarang = async () => {
    try {
      const response = await api.get("/barang");

      setBarang(response.data.data);
    } catch (err) {
      console.log(error.response);
      console.log(error.response.data);
      console.log(error.response.data.error);
      console.log(err);
    }
  };
  useEffect(() => {
    getBarang();
    getTransaksi();
  }, []);
  const getTransaksi = async () => {
    try {
      const response = await api.get("/transaksi");

      setTransaksi(response.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const pilihBarang = (id) => {
    const data = barang.find((b) => b.id === Number(id));

    if (!data) return;

    setFormData((prev) => ({
      ...prev,

      barang_id: data.id,

      kategori: data.kategori,

      harga: data.harga_jual,

      stok: data.stok,

      jumlah: "",

      total: "",
    }));
  };
  const tambahBarang = () => {
    if (!formData.barang_id) return;

    if (Number(formData.jumlah) <= 0) return;

    const sudahAda = formData.barang.find(
      (item) => item.barang_id === Number(formData.barang_id),
    );
    const data = barang.find((item) => item.id === Number(formData.barang_id));
    if (!data) return;
    if (Number(formData.jumlah) > data.stok) {
      alert("Stok tidak cukup");

      return;
    }

    if (sudahAda) {
      alert("Barang sudah dipilih");

      return;
    }

    const itemBaru = {
      barang_id: data.id,

      nama: data.nama,

      kategori: data.kategori,

      harga: Number(data.harga_jual),

      jumlah: Number(formData.jumlah),

      subtotal: Number(formData.total),
    };

    setFormData((prev) => ({
      ...prev,

      barang: [...prev.barang, itemBaru],

      barang_id: "",

      kategori: "",

      harga: "",

      stok: "",

      jumlah: "",

      total: "",
    }));
  };
  const hapusBarang = (index) => {
    setFormData((prev) => ({
      ...prev,

      barang: prev.barang.filter((_, i) => i !== index),
    }));
  };
  const tambahTransaksi = async () => {
    console.log("Tombol Simpan ditekan");
    console.log(formData);

    if (!validateForm(formData)) {
      console.log("VALIDASI GAGAL");
      console.log(errors);
      return;
    }

    console.log("VALIDASI BERHASIL");

    try {
      setLoading((prev) => ({ ...prev, tambah: true }));

      const response = await api.post("/transaksi", {
        tanggal: formData.tanggal,
        tipe_transaksi: formData.tipe_transaksi,
        nama_pelanggan: formData.nama_pelanggan,
        no_hp: formData.no_hp,
        alamat: formData.alamat,
        barang: formData.barang,
        metode_pembayaran: formData.metode_pembayaran,
        status_pembayaran: formData.status_pembayaran,
        status_pesanan: formData.status_pesanan,
        catatan: formData.catatan,
      });

      console.log(response.data);

      getBarang();
      getTransaksi();

      resetForm();

      setShowTambah(false);
    } catch (err) {
      console.log(err);

      console.log(err.response);

      console.log(err.response?.data);
      console.log(error.response);
      console.log(error.response.data);
      console.log(error.response.data.error);
    } finally {
      setLoading((prev) => ({ ...prev, tambah: false }));
    }
  };
  const exportExcel = () => {
    window.open(
      `${import.meta.env.VITE_API_URL}/transaksi/export/pdf?search=${encodeURIComponent(search)}`,
      "_blank",
    );
  };
  const exportPdf = () => {
    window.open(
      `${import.meta.env.VITE_API_URL}/transaksi/export/pdf?search=${encodeURIComponent(search)}`,
      "_blank",
    );
  };
  const exportDetailExcel = (id) => {
    window.open(
      `${import.meta.env.VITE_API_URL}/detail-transaksi/${id}/export-excel`,
      "_blank",
    );
  };

  const exportDetailPdf = (id) => {
    window.open(
      `${import.meta.env.VITE_API_URL}/detail-transaksi/${id}/export-pdf`,
      "_blank",
    );
  };
  const cetakStruk = (id) => {
    window.open(
      `${import.meta.env.VITE_API_URL}/transaksi/${id}/struk`,
      "_blank",
    );
  };
  const statusColor = {
    Pending: "bg-yellow-500",
    Diproses: "bg-blue-500",
    Dikirim: "bg-purple-500",
    Selesai: "bg-green-500",
    Dibatalkan: "bg-red-500",
  };
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };
  const totalTambah =
    formData?.barang?.reduce((sum, item) => sum + Number(item.subtotal), 0) ||
    0;

  const totalUpdate =
    selectedTransaksi?.detail_transaksi?.reduce(
      (sum, item) => sum + Number(item.subtotal),
      0,
    ) || 0;
  const pilihBarangUpdate = (id) => {
    const data = barang.find((b) => b.id === Number(id));

    if (!data) return;

    setSelectedTransaksi((prev) => ({
      ...prev,
      barang_id: data.id,
      kategori: data.kategori,
      harga: data.harga_jual,
      stok: data.stok,
      jumlah: "",
      total: "",
    }));
  };
  const tambahBarangUpdate = () => {
    if (!selectedTransaksi.barang_id) return;

    const data = barang.find(
      (item) => item.id === Number(selectedTransaksi.barang_id),
    );

    if (!data) return;

    if (Number(selectedTransaksi.jumlah) <= 0) {
      alert("Jumlah harus lebih dari 0");
      return;
    }

    if (Number(selectedTransaksi.jumlah) > data.stok) {
      alert("Stok tidak cukup");
      return;
    }

    const sudahAda = selectedTransaksi.barang.find(
      (item) => item.barang_id === data.id,
    );

    if (sudahAda) {
      alert("Barang sudah ada");
      return;
    }

    const itemBaru = {
      barang_id: data.id,
      nama: data.nama,
      kategori: data.kategori,
      harga: Number(data.harga_jual),
      jumlah: Number(selectedTransaksi.jumlah),
      subtotal: Number(selectedTransaksi.jumlah) * Number(data.harga_jual),
    };

    setSelectedTransaksi((prev) => ({
      ...prev,
      barang: [...prev.barang, itemBaru],
      barang_id: "",
      kategori: "",
      harga: "",
      stok: "",
      jumlah: "",
      total: "",
    }));
  };
  const hapusBarangUpdate = (index) => {
    setSelectedTransaksi((prev) => ({
      ...prev,
      barang: prev.barang.filter((_, i) => i !== index),
    }));
  };
  const updateJumlahBarang = (index, jumlah) => {
    const qty = Number(jumlah);

    setSelectedTransaksi((prev) => {
      const barangBaru = [...prev.barang];

      barangBaru[index].jumlah = qty;

      barangBaru[index].subtotal = qty * Number(barangBaru[index].harga);

      return {
        ...prev,
        barang: barangBaru,
      };
    });
  };

  const updateTransaksi = async () => {
    if (!validateUpdate(selectedTransaksi)) return;
    try {
      await api.put(`${import.meta.env.VITE_API_URL}/transaksi/${selectedTransaksi.id}`, {
        tanggal: selectedTransaksi.tanggal,
        tipe_transaksi: selectedTransaksi.tipe_transaksi,
        nama_pelanggan: selectedTransaksi.nama_pelanggan,
        no_hp: selectedTransaksi.no_hp,
        alamat: selectedTransaksi.alamat,

        barang: selectedTransaksi.detail_transaksi.map((item) => ({
          barang_id: item.barang.id,
          jumlah: item.jumlah,
        })),

        metode_pembayaran: selectedTransaksi.metode_pembayaran,
        status_pembayaran: selectedTransaksi.status_pembayaran,
        status_pesanan: selectedTransaksi.status_pesanan,
        catatan: selectedTransaksi.catatan,
      });

      getTransaksi();
      getBarang();

      setShowUpdate(false);
    } catch (err) {
      console.log(err.response.data);
    } finally {
      setLoading((prev) => ({ ...prev, update: false }));
    }
  };
  const handleUpdateChange = (e) => {
    const { name, value } = e.target;

    setSelectedTransaksi((prev) => {
      const data = {
        ...prev,
        [name]: value,
      };

      if (name === "jumlah") {
        data.total = Number(value) * Number(prev.harga);
      }

      if (name === "tipe_transaksi" && value === "Offline") {
        data.no_hp = "";
        data.alamat = "";
      }

      return data;
    });

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };
  const deleteTransaksi = async () => {
    try {
      await api.delete(`/transaksi/${selectedTransaksi.id}`);

      getTransaksi();
      getBarang();

      setShowDelete(false);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading((prev) => ({ ...prev, hapus: false }));
    }
  };
  const filteredTransaksi = transaksi.filter(
    (item) =>
      (item.nama ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (item.nama_pelanggan ?? "")
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      (item.kode_transaksi ?? "").toLowerCase().includes(search.toLowerCase()),
  );
  const itemsPerPage = 10;

  const totalPages = Math.ceil(filteredTransaksi.length / itemsPerPage);

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const currentTransaksi = filteredTransaksi.slice(startIndex, endIndex);
  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Transaksi</h1>
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 mt-5">
        {/* Search */}
        <div className="relative w-full lg:max-w-sm">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />

          <input
            type="text"
            placeholder="Cari nama barang..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
           w-full
           pl-10
           pr-4
           py-3
           border
           rounded-xl
           shadow-sm
           focus:ring-2
           focus:ring-amber-500
           focus:outline-none
           "
          />
        </div>

        {/* Tombol */}
        <div className="flex flex-wrap gap-3 w-full lg:w-auto">
          <button
            onClick={() => {
              resetForm();
              setShowTambah(true);
            }}
            className="
           flex
           items-center
           justify-center
           gap-2
           bg-amber-600
           hover:bg-amber-700
           text-white
           px-5
           py-3
           rounded-xl
           transition
           w-full
           sm:w-auto
           "
          >
            <FiPlus />
            Tambah
          </button>

          <button
            onClick={exportPdf}
            target="_blank"
            className="
           flex
           items-center
           justify-center
           gap-2
           bg-red-600
           hover:bg-red-700
           text-white
           px-5
           py-3
           rounded-xl
           transition
           w-full
           sm:w-auto
           "
          >
            <FiFileText />
            PDF
          </button>

          <button
            onClick={exportExcel}
            className="
           flex
           items-center
           justify-center
           gap-2
           bg-green-600
           hover:bg-green-700
           text-white
           px-5
           py-3
           rounded-xl
           transition
           w-full
           sm:w-auto
           "
          >
            <FiFile />
            Excel
          </button>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-lg overflow-x-auto">
        <table className="w-full min-w-225 md:min-w-300 text-xs md:text-sm">
          <thead className="bg-amber-600 text-white">
            <tr>
              <th className="border p-2">Kode_transaksi</th>
              <th className="border p-2">Nama_pelanggan</th>
              <th className="border p-2">Tanggal</th>
              <th className="border p-2">Total</th>
              <th className="border p-2">Status_pesanan</th>
              <th className="border p-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {currentTransaksi.map((item) => (
              <tr key={item.id}>
                <td className="border p-2">{item.kode_transaksi}</td>

                <td className="border p-2">{item.nama_pelanggan}</td>

                <td className="border p-2">{item.tanggal}</td>

                <td className="border p-2">
                  Rp {Number(item.total).toLocaleString("id-ID")}
                </td>

                <td className="border p-2">
                  <span
                    className={`px-2 py-1 rounded text-white ${statusColor[item.status_pesanan]}`}
                  >
                    {item.status_pesanan}
                  </span>
                </td>

                <td className="border p-2">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedTransaksi(item);
                        setShowDetail(true);
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                    >
                      Detail
                    </button>

                    <button
                      onClick={() => {
                        setSelectedTransaksi(item);
                        setShowUpdate(true);
                      }}
                      className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1 rounded"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => cetakStruk(item.id)}
                      className="bg-black text-white px-3 py-1 rounded"
                    >
                      Struk
                    </button>
                    <button
                      onClick={() => {
                        setSelectedTransaksi(item);
                        setShowDelete(true);
                      }}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                    >
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mt-6">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
        >
          Previous
        </button>

        <span className="font-semibold text-sm md:text-base">
          {page} / {totalPages}
        </span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
      {showTambah && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3">
          <div className="bg-white w-full max-w-6xl rounded-2xl shadow-2xl flex flex-col max-h-[95vh]">
            {/* HEADER */}

            <div className="px-6 py-5 border-b flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Tambah Transaksi</h2>

                <p className="text-gray-500 text-sm">
                  Masukkan data transaksi baru
                </p>
              </div>

              <button
                onClick={() => {
                  resetForm();
                  setShowTambah(false);
                }}
                className="text-3xl text-gray-500 hover:text-red-600"
              >
                ×
              </button>
            </div>

            {/* BODY */}

            <div className="overflow-y-auto px-6 py-6 space-y-7">
              {/* INFORMASI PELANGGAN */}

              <div>
                <h3 className="font-semibold text-lg mb-4">
                  Informasi Pelanggan
                </h3>

                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label>Tanggal</label>

                    <input
                      type="date"
                      name="tanggal"
                      value={formData.tanggal}
                      onChange={handleChange}
                      className="w-full border rounded-lg p-3"
                    />
                  </div>

                  <div>
                    <label>Tipe Transaksi</label>

                    <select
                      name="tipe_transaksi"
                      value={formData.tipe_transaksi}
                      onChange={handleChange}
                      className="w-full border rounded-lg p-3"
                    >
                      <option value="">Pilih</option>

                      <option value="Offline">Offline</option>

                      <option value="Online">Online</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label>Nama Pelanggan</label>

                    <input
                      name="nama_pelanggan"
                      value={formData.nama_pelanggan}
                      onChange={handleChange}
                      className="w-full border rounded-lg p-3"
                    />
                  </div>

                  {formData.tipe_transaksi === "Online" && (
                    <>
                      <div>
                        <label>No HP</label>

                        <input
                          name="no_hp"
                          value={formData.no_hp}
                          onChange={handleChange}
                          className="w-full border rounded-lg p-3"
                        />
                      </div>

                      <div>
                        <label>Alamat</label>

                        <textarea
                          rows="3"
                          name="alamat"
                          value={formData.alamat}
                          onChange={handleChange}
                          className="w-full border rounded-lg p-3"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* BARANG */}

              <div>
                <h3 className="font-semibold text-lg mb-4">Data Barang</h3>

                <div className="grid lg:grid-cols-6 md:grid-cols-3 gap-4">
                  <div>
                    <label>Barang</label>

                    <select
                      value={formData.barang_id}
                      onChange={(e) => pilihBarang(e.target.value)}
                      className="w-full border rounded-lg p-3"
                    >
                      <option value="">Pilih</option>

                      {barang.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.nama}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label>Kategori</label>

                    <input
                      readOnly
                      value={formData.kategori}
                      className="w-full border rounded-lg p-3 bg-gray-100"
                    />
                  </div>

                  <div>
                    <label>Harga</label>

                    <input
                      readOnly
                      value={formData.harga}
                      className="w-full border rounded-lg p-3 bg-gray-100"
                    />
                  </div>

                  <div>
                    <label>Stok</label>

                    <input
                      readOnly
                      value={formData.stok}
                      className="w-full border rounded-lg p-3 bg-gray-100"
                    />
                  </div>

                  <div>
                    <label>Jumlah</label>

                    <input
                      type="number"
                      value={formData.jumlah}
                      onChange={(e) => hitungJumlah(e.target.value)}
                      className="w-full border rounded-lg p-3"
                    />
                  </div>

                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={tambahBarang}
                      className="bg-blue-600 hover:bg-blue-700 text-white w-full py-3 rounded-lg"
                    >
                      Tambah
                    </button>
                  </div>
                </div>
              </div>

              {/* TABEL BARANG */}

              <div className="overflow-x-auto">
                <table className="w-full border">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border p-2">Barang</th>

                      <th className="border p-2">Harga</th>

                      <th className="border p-2">Qty</th>

                      <th className="border p-2">Subtotal</th>

                      <th className="border p-2">Aksi</th>
                    </tr>
                  </thead>

                  <tbody>
                    {formData.barang.map((item, index) => (
                      <tr key={index}>
                        <td className="border p-2">{item.nama}</td>

                        <td className="border p-2">
                          Rp {item.harga.toLocaleString("id-ID")}
                        </td>

                        <td className="border p-2">{item.jumlah}</td>

                        <td className="border p-2">
                          Rp {item.subtotal.toLocaleString("id-ID")}
                        </td>

                        <td className="border p-2">
                          <button
                            onClick={() => hapusBarang(index)}
                            className="bg-red-600 text-white px-3 py-1 rounded"
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="text-right text-xl font-bold">
                Total : Rp {totalTambah.toLocaleString("id-ID")}
              </div>

              {/* PEMBAYARAN */}

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label>Metode Pembayaran</label>

                  <select
                    name="metode_pembayaran"
                    value={formData.metode_pembayaran}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-3"
                  >
                    <option>Cash</option>

                    <option>Qris</option>

                    <option>Transfer</option>

                    <option>COD</option>
                  </select>
                </div>

                <div>
                  <label>Status Pembayaran</label>

                  <select
                    name="status_pembayaran"
                    value={formData.status_pembayaran}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-3"
                  >
                    <option>Lunas</option>

                    <option>Belum Bayar</option>
                  </select>
                </div>

                <div>
                  <label>Status Pesanan</label>

                  <select
                    name="status_pesanan"
                    value={formData.status_pesanan}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-3"
                  >
                    <option>Pending</option>

                    <option>Diproses</option>

                    <option>Dikirim</option>

                    <option>Selesai</option>

                    <option>Dibatalkan</option>
                  </select>
                </div>

                <div>
                  <label>Catatan</label>

                  <textarea
                    rows="3"
                    name="catatan"
                    value={formData.catatan}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-3"
                  />
                </div>
              </div>
            </div>

            {/* FOOTER */}

            <div className="border-t p-5 flex justify-end gap-3">
              <button
                onClick={() => {
                  resetForm();
                  setShowTambah(false);
                }}
                className="px-6 py-3 rounded-lg bg-gray-400 text-white"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={() => {
                  console.log("BUTTON DIKLIK");
                  tambahTransaksi();
                }}
                className="px-6 py-3 rounded-lg bg-amber-600 text-white"
              >
                Simpan Transaksi
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ===================== DETAIL TRANSAKSI ===================== */}
      {showDetail && selectedTransaksi && (
        <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center p-4">
          <div className="bg-white w-full max-w-6xl rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-amber-600 text-white px-6 py-5 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Detail Transaksi</h2>

                <p className="text-sm opacity-80 mt-1">
                  {selectedTransaksi.kode_transaksi}
                </p>
              </div>

              <button
                onClick={() => setShowDetail(false)}
                className="text-3xl hover:scale-110 duration-200"
              >
                ×
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto max-h-[80vh]">
              {/* Informasi */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <p className="text-gray-500 text-sm">Nama Pelanggan</p>

                    <p className="font-semibold text-lg">
                      {selectedTransaksi.nama_pelanggan}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500 text-sm">Tanggal</p>

                    <p>{selectedTransaksi.tanggal}</p>
                  </div>

                  <div>
                    <p className="text-gray-500 text-sm">Jenis Transaksi</p>

                    <span
                      className={`px-3 py-1 rounded-full text-white text-sm
                ${
                  selectedTransaksi.tipe_transaksi === "Online"
                    ? "bg-blue-600"
                    : "bg-green-600"
                }`}
                    >
                      {selectedTransaksi.tipe_transaksi}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-gray-500 text-sm">No HP</p>

                    <p>{selectedTransaksi.no_hp || "-"}</p>
                  </div>

                  <div>
                    <p className="text-gray-500 text-sm">Metode Pembayaran</p>

                    <p>{selectedTransaksi.metode_pembayaran}</p>
                  </div>

                  <div>
                    <p className="text-gray-500 text-sm">Status Pembayaran</p>

                    <span
                      className={`px-3 py-1 rounded-full text-white text-sm
                ${
                  selectedTransaksi.status_pembayaran === "Lunas"
                    ? "bg-green-600"
                    : "bg-red-500"
                }`}
                    >
                      {selectedTransaksi.status_pembayaran}
                    </span>
                  </div>
                </div>
              </div>

              {/* Alamat */}
              {selectedTransaksi.tipe_transaksi === "Online" && (
                <div className="mt-6">
                  <h3 className="font-semibold mb-2">Alamat Pengiriman</h3>

                  <div className="bg-gray-100 rounded-lg p-4">
                    {selectedTransaksi.alamat}
                  </div>
                </div>
              )}

              {/* Barang */}
              <div className="mt-8">
                <h3 className="font-semibold text-lg mb-4">Daftar Barang</h3>

                <div className="overflow-x-auto border rounded-xl">
                  <table className="w-full min-w-175">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-3 text-left">Barang</th>

                        <th className="p-3 text-center">Kategori</th>

                        <th className="p-3 text-center">Harga</th>

                        <th className="p-3 text-center">Jumlah</th>

                        <th className="p-3 text-right">Subtotal</th>
                      </tr>
                    </thead>

                    <tbody>
                      {selectedTransaksi?.detail_transaksi?.map(
                        (item, index) => (
                          <tr key={index} className="border-t hover:bg-gray-50">
                            <td className="p-3">{item.barang.nama}</td>

                            <td className="p-3 text-center">
                              {item.barang.kategori}
                            </td>

                            <td className="p-3 text-center">
                              Rp {Number(item.harga).toLocaleString("id-ID")}
                            </td>

                            <td className="p-3 text-center">{item.jumlah}</td>

                            <td className="p-3 text-right font-semibold">
                              Rp {Number(item.subtotal).toLocaleString("id-ID")}
                            </td>
                          </tr>
                        ),
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-end mt-5">
                <div className="bg-amber-100 rounded-xl p-5 w-full md:w-80">
                  <div className="flex justify-between">
                    <span>Total Belanja</span>

                    <span className="font-bold text-lg">
                      Rp{" "}
                      {(selectedTransaksi?.detail_transaksi ?? [])
                        .reduce((sum, item) => sum + Number(item.subtotal), 0)
                        .toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Catatan */}
              {selectedTransaksi.catatan && (
                <div className="mt-6">
                  <h3 className="font-semibold mb-2">Catatan</h3>

                  <div className="bg-gray-100 rounded-lg p-4">
                    {selectedTransaksi.catatan}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t p-5">
              <div className="flex flex-col md:flex-row justify-between gap-3">
                {/* kiri */}
                <div className="flex gap-2">
                  <button
                    onClick={() => exportDetailPdf(selectedTransaksi.id)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                  >
                    <i className="bi bi-file-earmark-pdf me-2"></i>
                    PDF
                  </button>

                  <button
                    onClick={() => exportDetailExcel(selectedTransaksi.id)}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                  >
                    <i className="bi bi-file-earmark-excel me-2"></i>
                    Excel
                  </button>
                </div>

                {/* kanan */}

                <button
                  onClick={() => setShowDetail(false)}
                  className="flex items-center justify-center gap-2
                       bg-gray-600
                       hover:bg-gray-700
                       text-white
                       px-6
                       py-3
                       rounded-lg"
                >
                  <FiDownload />
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showUpdate && selectedTransaksi && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4">
          <div className="bg-white w-full max-w-6xl rounded-2xl shadow-2xl flex flex-col max-h-[95vh]">
            {/* HEADER */}
            <div className="flex justify-between items-center bg-amber-600 text-white px-6 py-4">
              <div>
                <h2 className="text-2xl font-bold">Update Transaksi</h2>

                <p className="text-sm opacity-90">
                  Edit data transaksi pelanggan
                </p>
              </div>

              <button
                onClick={() => {
                  setShowUpdate(false);
                  setErrors({});
                }}
                className="text-3xl hover:text-gray-200"
              >
                ×
              </button>
            </div>

            {/* BODY */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* ================= DATA PELANGGAN ================= */}

              <div className="bg-gray-50 rounded-xl p-5 mb-6">
                <h3 className="font-bold text-lg mb-5">Data Pelanggan</h3>

                <div className="grid md:grid-cols-2 gap-5">
                  {/* Tipe */}

                  <div>
                    <label className="font-semibold">Tipe Transaksi</label>

                    <select
                      name="tipe_transaksi"
                      value={selectedTransaksi.tipe_transaksi}
                      onChange={handleUpdateChange}
                      className="border rounded-lg w-full p-3 mt-2"
                    >
                      <option value="Offline">Offline</option>

                      <option value="Online">Online</option>
                    </select>
                  </div>

                  {/* tanggal */}

                  <div>
                    <label className="font-semibold">Tanggal</label>

                    <input
                      type="date"
                      name="tanggal"
                      value={selectedTransaksi.tanggal}
                      onChange={handleUpdateChange}
                      className="border rounded-lg w-full p-3 mt-2"
                    />

                    {errors.tanggal && (
                      <p className="text-red-500 text-sm">{errors.tanggal}</p>
                    )}
                  </div>

                  {/* nama */}

                  <div>
                    <label className="font-semibold">Nama Pelanggan</label>

                    <input
                      type="text"
                      name="nama_pelanggan"
                      value={selectedTransaksi.nama_pelanggan}
                      onChange={handleUpdateChange}
                      className="border rounded-lg w-full p-3 mt-2"
                    />

                    {errors.nama_pelanggan && (
                      <p className="text-red-500 text-sm">
                        {errors.nama_pelanggan}
                      </p>
                    )}
                  </div>

                  {/* no hp */}

                  {selectedTransaksi.tipe_transaksi === "Online" && (
                    <div>
                      <label className="font-semibold">No HP</label>

                      <input
                        type="text"
                        name="no_hp"
                        value={selectedTransaksi.no_hp}
                        onChange={handleUpdateChange}
                        className="border rounded-lg w-full p-3 mt-2"
                      />
                    </div>
                  )}
                </div>

                {selectedTransaksi.tipe_transaksi === "Online" && (
                  <div className="mt-5">
                    <label className="font-semibold">Alamat</label>

                    <textarea
                      rows={3}
                      name="alamat"
                      value={selectedTransaksi.alamat}
                      onChange={handleUpdateChange}
                      className="border rounded-lg w-full p-3 mt-2"
                    />
                  </div>
                )}
              </div>

              {/* ================= BARANG ================= */}

              <div className="bg-gray-50 rounded-xl p-5">
                <h3 className="font-bold text-lg mb-5">Barang</h3>

                <div className="overflow-x-auto">
                  <div className="overflow-x-auto max-h-72 overflow">
                    <table className="w-full border">
                      <thead className="bg-amber-600 text-white">
                        <tr>
                          <th className="p-3">Barang</th>

                          <th className="p-3">Kategori</th>

                          <th className="p-3">Harga</th>

                          <th className="p-3">Jumlah</th>

                          <th className="p-3">Subtotal</th>
                        </tr>
                      </thead>

                      <tbody>
                        {selectedTransaksi?.detail_transaksi?.map(
                          (item, index) => (
                            <tr key={index} className="border-b text-center">
                              <td className="p-3">{item.barang.nama}</td>

                              <td className="p-3">{item.barang.kategori}</td>

                              <td className="p-3">
                                Rp {Number(item.harga).toLocaleString("id-ID")}
                              </td>

                              <td className="p-3">
                                <input
                                  type="number"
                                  value={item.jumlah}
                                  className="border rounded p-2 w-24"
                                  onChange={(e) => {
                                    const detailBaru = [
                                      ...selectedTransaksi.detail_transaksi,
                                    ];

                                    detailBaru[index].jumlah = Number(
                                      e.target.value,
                                    );

                                    detailBaru[index].subtotal =
                                      detailBaru[index].jumlah *
                                      detailBaru[index].harga;

                                    setSelectedTransaksi({
                                      ...selectedTransaksi,
                                      detail_transaksi: detailBaru,
                                    });
                                  }}
                                />
                              </td>

                              <td className="p-3">
                                Rp{" "}
                                {Number(item.subtotal).toLocaleString("id-ID")}
                              </td>
                            </tr>
                          ),
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex justify-end mt-5">
                  <div className="bg-amber-100 px-5 py-3 rounded-xl">
                    <span className="font-bold">Total :</span>

                    <span className="ml-3 text-xl text-amber-700 font-bold">
                      Rp {totalUpdate.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
              </div>

              {/* ================= PEMBAYARAN ================= */}

              <div className="bg-gray-50 rounded-xl p-5 mt-6">
                <h3 className="font-bold text-lg mb-5">Pembayaran</h3>

                <div className="grid md:grid-cols-3 gap-5">
                  <div>
                    <label className="font-semibold">Metode</label>

                    <select
                      name="metode_pembayaran"
                      value={selectedTransaksi.metode_pembayaran}
                      onChange={handleUpdateChange}
                      className="border rounded-lg w-full p-3 mt-2"
                    >
                      <option>Cash</option>

                      <option>Qris</option>

                      <option>Transfer</option>

                      <option>COD</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold">Status Bayar</label>

                    <select
                      name="status_pembayaran"
                      value={selectedTransaksi.status_pembayaran}
                      onChange={handleUpdateChange}
                      className="border rounded-lg w-full p-3 mt-2"
                    >
                      <option>Lunas</option>

                      <option>Belum Bayar</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold">Status Pesanan</label>

                    <select
                      name="status_pesanan"
                      value={selectedTransaksi.status_pesanan}
                      onChange={handleUpdateChange}
                      className="border rounded-lg w-full p-3 mt-2"
                    >
                      <option>Pending</option>

                      <option>Diproses</option>

                      <option>Dikirim</option>

                      <option>Selesai</option>

                      <option>Dibatalkan</option>
                    </select>
                  </div>
                </div>

                <div className="mt-5">
                  <label className="font-semibold">Catatan</label>

                  <textarea
                    rows={3}
                    name="catatan"
                    value={selectedTransaksi?.catatan ?? ""}
                    onChange={handleUpdateChange}
                    className="border rounded-lg w-full p-3 mt-2"
                  />
                </div>
              </div>
            </div>

            {/* FOOTER */}

            <div className="border-t p-5 flex flex-col md:flex-row justify-end gap-3">
              <button
                onClick={() => setShowUpdate(false)}
                className="w-full md:w-auto bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl"
              >
                Batal
              </button>

              <button
                onClick={updateTransaksi}
                disabled={loading.update}
                className="w-full md:w-auto bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-xl"
              >
                {loading.update ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </div>
        </div>
      )}
      {showDelete && selectedTransaksi && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white w-100 rounded-lg p-6">
            <h2 className="text-xl font-bold">Hapus Transaksi</h2>

            <p className="mt-4">Yakin ingin menghapus transaksi ini?</p>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowDelete(false)}
                className="bg-gray-400 px-4 py-2 rounded"
              >
                Batal
              </button>

              <button
                onClick={deleteTransaksi}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Transaksi;
