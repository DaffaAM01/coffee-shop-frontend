import Layout from "./Layout";
import { useState, useEffect } from "react";
import api from "./api/api";
import {
  FiSearch,
  FiPlus,
  FiFileText,
  FiFile,
} from "react-icons/fi";

function Barang() {
  const [barang, setBarang] = useState([]);
  const [selectedBarang, setSelectedBarang] = useState(null);
  const [showTambah, setShowTambah] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const [preview, setPreview] = useState("");
  const [formData, setFormData] = useState({
    nama: "",
    kategori: "",
    harga_beli: "",
    harga_jual: "",
    stok: "",
    deskripsi: "",
    gambar: null,
  });
  const [errors, setErrors] = useState({});
  const validateForm = (data) => {
    let newErrors = {};
    if (!data.nama.trim()) {
      newErrors.nama = "Nama barang wajib diisi";
    }

    if (!data.kategori.trim()) {
      newErrors.kategori = "Kategori wajib diisi";
    }

    if (!data.harga_beli) {
      newErrors.harga_beli = "Harga beli wajib diisi";
    } else if (Number(data.harga_beli) < 0) {
      newErrors.harga_beli = "Harga beli tidak boleh negatif";
    }

    if (!data.harga_jual) {
      newErrors.harga_jual = "Harga jual wajib diisi";
    } else if (Number(data.harga_jual) < Number(data.harga_beli)) {
      newErrors.harga_jual =
        "Harga jual tidak boleh lebih kecil dari harga beli";
    }

    if (!data.stok) {
      newErrors.stok = "Stok wajib diisi";
    } else if (Number(data.stok) < 0) {
      newErrors.stok = "Stok tidak boleh negatif";
    }

    if (!data.deskripsi.trim()) {
      newErrors.deskripsi = "Deskripsi wajib diisi";
    }

    if (!data.gambar) {
      newErrors.gambar = "Gambar wajib dipilih";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
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
  const handleImageChange = (e, isUpdate = false) => {
    const file = e.target.files[0];

    if (!file) return;

    setPreview(URL.createObjectURL(file));

    if (isUpdate) {
      setSelectedBarang((prev) => ({
        ...prev,
        gambar: file,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        gambar: file,
      }));
    }

    setErrors((prev) => ({
      ...prev,
      gambar: "",
    }));
  };
  const resetForm = () => {
    setFormData({
      nama: "",
      kategori: "",
      harga_beli: "",
      harga_jual: "",
      stok: "",
      deskripsi: "",
      gambar: null,
    });

    setPreview("");
    setErrors({});
  };

  useEffect(() => {
    getBarang();
  }, []);
  const handleUpdateChange = (e) => {
    const { name, value } = e.target;

    setSelectedBarang((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };
  const getBarang = async () => {
    try {
      const response = await api.get("/barang");

      setBarang(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  const tambahBarang = async () => {
    if (!validateForm(formData)) {
      return;
    }
    try {
      const data = new FormData();
      data.append("nama", formData.nama);
      data.append("kategori", formData.kategori);
      data.append("harga_beli", formData.harga_beli);
      data.append("harga_jual", formData.harga_jual);
      data.append("stok", formData.stok);
      data.append("deskripsi", formData.deskripsi);

      if (formData.gambar) {
        data.append("gambar", formData.gambar);
      }

      await api.post("/barang", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      getBarang();

      resetForm(); // <-- tambah ini

      setShowTambah(false);
    } catch (error) {
      console.log(error);
    }
  };
  const validateUpdate = (data) => {
    let newErrors = {};
    if (!data.nama.trim()) {
      newErrors.nama = "Nama barang wajib diisi";
    }

    if (!data.kategori.trim()) {
      newErrors.kategori = "Kategori wajib diisi";
    }

    if (!data.harga_beli) {
      newErrors.harga_beli = "Harga beli wajib diisi";
    }

    if (!data.harga_jual) {
      newErrors.harga_jual = "Harga jual wajib diisi";
    }

    if (Number(data.harga_jual) < Number(data.harga_beli)) {
      newErrors.harga_jual =
        "Harga jual tidak boleh lebih kecil dari harga beli";
    }

    if (!data.stok) {
      newErrors.stok = "Stok wajib diisi";
    }

    if (!data.deskripsi.trim()) {
      newErrors.deskripsi = "Deskripsi wajib diisi";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };
  const updateBarang = async () => {
    if (!validateUpdate(selectedBarang)) {
      return;
    }
    try {
      const data = new FormData();
      data.append("nama", selectedBarang.nama);
      data.append("kategori", selectedBarang.kategori);
      data.append("harga_beli", selectedBarang.harga_beli);
      data.append("harga_jual", selectedBarang.harga_jual);
      data.append("stok", selectedBarang.stok);
      data.append("deskripsi", selectedBarang.deskripsi);

      if (selectedBarang.gambar instanceof File) {
        data.append("gambar", selectedBarang.gambar);
      }

      data.append("_method", "PUT");

      await api.post(`/barang/${selectedBarang.id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      getBarang();

      setShowUpdate(false);
    } catch (err) {
      console.log(err);
    }
  };
  const deleteBarang = async () => {
    await api.delete(`/barang/${selectedBarang.id}`);

    getBarang();

    setShowDelete(false);
  };

  const filteredBarang = barang.filter((item) => {
  const keyword = search.toLowerCase().trim();

  const data = [
    item.nama,
    item.kategori,
    item.deskripsi,
    item.harga_beli,
    item.harga_jual,
    item.stok,
  ]
    .join(" ")
    .toLowerCase();

  return data.includes(keyword);
});
const exportExcel = () => {
   window.open(
    `${import.meta.env.VITE_API_URL}/barang/export/excel?search=${encodeURIComponent(search)}`,
    "_blank"
);
};
const exportPdf = () => {
    window.open(
    `${import.meta.env.VITE_API_URL}/barang/export/pdf?search=${encodeURIComponent(search)}`,
    "_blank"
);
};
  const totalPages = Math.ceil(filteredBarang.length / itemsPerPage);

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const currentBarang = filteredBarang.slice(startIndex, endIndex);
  return (
    <div className="p-4 md:p-6">
      <h1 className="text:2xl md:text-3xl font-bold">Barang</h1>
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
      onClick={()=>{
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
        <table className="min-w-max w-full">
          <thead className="bg-amber-600 text-white text-xs md:text-sm">
            <tr>
              <th className="px-2 py-2 md:p-3 *:text-xs md:text-sm whitespace-nowrap">No</th>
              <th className="px-2 py-2 md:p-3 text-xs md:text-sm whitespace-nowrap">Nama Barang</th>
              <th className="px-2 py-2 md:p-3 text-xs md:text-sm whitespace-nowrap">Gambar</th>
              <th className="px-2 py-2 md:p-3 text-xs md:text-sm whitespace-nowrap">Kategori</th>
              <th className="px-2 py-2 md:p-3 text-xs md:text-sm whitespace-nowrap">Harga Beli</th>
              <th className="px-2 py-2 md:p-3 text-xs md:text-sm whitespace-nowrap">Harga Jual</th>
              <th className="px-2 py-2 md:p-3 *:**:text-xs md:text-sm whitespace-nowrap">Stok</th>
              <th className="px-2 py-2 md:p-3 text-xs md:text-sm whitespace-nowrap">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {currentBarang.length > 0 ? (
              currentBarang.map((item, index) => (
                <tr
                  key={item.id}
                  className="border-b hover:bg-gray-300 text-center"
                >
                  <td className="px-2 py-2 md:p-3 text-xs md:text-sm text-center">{startIndex + index + 1}</td>
                  <td className="max-w-30 truncate text-xs md:text-sm">
    {item.nama}
</td>
                  <td className="px-2 py-2 md:p-3 text-xs md:text-sm text-center">
                    <img
    src={`${import.meta.env.VITE_API_URL.replace("/api","")}/storage/${item.gambar}`}
    className="w-10 h-10 md:w-16 md:h-16 object-cover rounded"
    alt={item.nama}
/>
                  </td>
                  <td className="px-2 py-2 md:p-3 text-xs md:text-sm">{item.kategori}</td>
                  <td className="px-2 py-2 md:p-3 text-xs md:text-sm">
                    Rp {Number(item.harga_beli).toLocaleString("id-ID")}
                  </td>
                  <td className="px-2 py-2 md:p-3 text-xs md:text-sm">
                    Rp {Number(item.harga_jual).toLocaleString("id-ID")}
                  </td>
                  <td className="px-2 py-2 md:p-3 text-xs md:text-sm">{item.stok}</td>
                  <td className="px-2 py-2 md:p-3 text-xs md:text-sm">
                    <div className="flex flex-col md:flex-row gap-2 justify-center">
                      <button
                        onClick={() => {
                          setSelectedBarang(item);
                          setShowDetail(true);
                        }}
                       className="
bg-green-500
hover:bg-green-500
text-white
text-[10px]
md:text-sm
px-2
md:px-3
py-1
rounded
"
                      >
                        Detail
                      </button>
                      <button
                        onClick={() => {
                          setSelectedBarang(item);
                          setPreview("");
                          setErrors({});
                          setShowUpdate(true);
                        }}
                       className="
bg-yellow-500
hover:bg-yellow-500
text-white
text-[10px]
md:text-sm
px-2
md:px-3
py-1
rounded
"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => {
                          setSelectedBarang(item);
                          setShowDelete(true);
                        }}
                        className="
bg-red-500
hover:bg-red-500
text-white
text-[10px]
md:text-sm
px-2
md:px-3
py-1
rounded
"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center p-6 text-gray-500">
                  Data Barang tidak ditemukan
                </td>
              </tr>
            )}
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
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
      {showTambah && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div
            className="
        bg-white
        rounded-xl
        shadow-lg
        w-full
        max-w-5xl
        max-h-[90vh]
        overflow-y-auto
        p-4
        md:p-6
    "
          >
            <h2 className="text-2xl font-bold mb-5">Tambah Barang</h2>

            <div className="flex flex-col lg:flex-row gap-8">
              {/* BAGIAN GAMBAR */}
              <div className="w-full lg:w-56 flex flex-col items-center">
                <img
                  src={
                    preview
                      ? preview
                      : "https://placehold.co/220x220?text=Preview"
                  }
                  className="w-44 h-44 md:w-52 md:h-52 border rounded-lg object-contain bg-gray-100"
                />

                <p className="mt-3 text-sm text-center text-gray-600 break-all">
                  {formData.gambar
                    ? formData.gambar.name
                    : "Belum ada gambar dipilih"}
                </p>

                <label
                  htmlFor="gambar"
                  className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded cursor-pointer"
                >
                  Pilih Gambar
                </label>

                <input
                  id="gambar"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
                {errors.gambar && (
                  <p className="text-red-500 text-sm mt-2">{errors.gambar}</p>
                )}
              </div>

              {/* BAGIAN FORM */}
              <div className="flex-1 space-y-4">
                <div>
                  <label>Nama Barang</label>
                  <input
                    name="nama"
                    placeholder="Masukkan Nama Barang"
                    className="w-full border rounded p-2"
                    value={formData.nama}
                    onChange={handleChange}
                  />
                  {errors.nama && (
                    <p className="text-red-500 text-sm mt-1">{errors.nama}</p>
                  )}
                </div>

                <div>
                  <label>Kategori</label>
                  <input
                    name="kategori"
                    placeholder="Masukkan Kategori Barang"
                    className="w-full border rounded p-2"
                    value={formData.kategori}
                    onChange={handleChange}
                  />
                  {errors.kategori && (
                    <p className="text-red-500 text-sm">{errors.kategori}</p>
                  )}
                </div>

                <div>
                  <label>Harga Beli</label>
                  <input
                    type="number"
                    placeholder="Masukkan Harga Beli Barang"
                    name="harga_beli"
                    className="w-full border rounded p-2"
                    value={formData.harga_beli}
                    onChange={handleChange}
                  />
                  {errors.harga_beli && (
                    <p className="text-red-500 text-sm">{errors.harga_beli}</p>
                  )}
                </div>

                <div>
                  <label>Harga Jual</label>
                  <input
                    type="number"
                    placeholder="Masukkan Harga Jual Barang"
                    name="harga_jual"
                    className="w-full border rounded p-2"
                    value={formData.harga_jual}
                    onChange={handleChange}
                  />
                </div>
                {errors.harga_jual && (
                  <p className="text-red-500 text-sm">{errors.harga_jual}</p>
                )}
                <div>
                  <label>Stok</label>
                  <input
                    type="number"
                    placeholder="Masukkan Stok Barang"
                    name="stok"
                    className="w-full border rounded p-2"
                    value={formData.stok}
                    onChange={handleChange}
                  />
                  {errors.stok && (
                    <p className="text-red-500 text-sm">{errors.stok}</p>
                  )}
                </div>

                <div>
                  <label>Deskripsi</label>
                  <textarea
                    name="deskripsi"
                    placeholder="Masukkan Deskripsi Barang"
                    className="w-full border rounded p-2"
                    value={formData.deskripsi}
                    onChange={handleChange}
                  />
                  {errors.deskripsi && (
                    <p className="text-red-500 text-sm">{errors.deskripsi}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => {
                  resetForm();
                  setShowTambah(false);
                }}
                className="w-full md:w-auto bg-gray-400 text-white px-4 py-2 rounded"
              >
                Batal
              </button>

              <button
                onClick={tambahBarang}
                className="w-full md:w-auto bg-amber-600 text-white px-4 py-2 rounded"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
      {showDetail && selectedBarang && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg mx-4 p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-5 text-center">Detail Barang</h2>

            <div className="space-y-3">
              <img
  src={selectedBarang.gambar}
  className="w-48 h-48 object-contain rounded-lg mx-auto"
/>
              <p>
                <b>Nama :</b> {selectedBarang.nama}
              </p>

              <p>
                <b>Kategori :</b> {selectedBarang.kategori}
              </p>

              <p>
                <b>Harga Beli Barang:</b> Rp{" "}
                {Number(selectedBarang.harga_beli).toLocaleString("id-ID")}
              </p>
              <p>
                <b>Harga Jual Barang:</b> Rp{" "}
                {Number(selectedBarang.harga_jual).toLocaleString("id-ID")}
              </p>

              <p>
                <b>Stok :</b> {selectedBarang.stok}
              </p>

              <p>
                <b>Deskripsi :</b>
              </p>

              <div className="border rounded p-3 bg-gray-100">
                {selectedBarang.deskripsi}
              </div>
            </div>

            <div className="flex justify-end mt-5">
              <button
                onClick={() => setShowDetail(false)}
                className="bg-red-600 text-white px-5 py-2 rounded"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
      {showUpdate && selectedBarang && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div
            className="
        bg-white
        rounded-xl
        shadow-lg
        w-full
        max-w-5xl
        max-h-[90vh]
        overflow-y-auto
        p-4
        md:p-6
    "
          >
            <h2 className="text-2xl font-bold mb-5">Update Barang</h2>

            <div className="flex flex-col lg:flex-row gap-8">
              <div className="w-full lg:w-56 flex flex-col items-center">
                <img
                  src={
                    selectedBarang.gambar instanceof File
                      ? URL.createObjectURL(selectedBarang.gambar)
                      : selectedBarang.gambar
                  }
                  className="w-44 h-44 md:w-52 md:h-52 object-contain rounded-lg border bg-gray-100"
                />

                <p className="text-center text-sm text-gray-600 mt-3 break-all">
  {selectedBarang.gambar instanceof File
    ? selectedBarang.gambar.name
    : selectedBarang.gambar
      ? selectedBarang.gambar.split("/").pop()
      : "Belum ada gambar"}
</p>
                <label
                  htmlFor="gambar"
                  className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded cursor-pointer"
                >
                  Pilih Gambar
                </label>
                <input
                  id="gambar"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageChange(e, true)}
                />
                {errors.gambar && (
                  <p className="text-red-500 text-sm mt-2">{errors.gambar}</p>
                )}
              </div>
              <div className="flex-1 space-y-4">
                <label>Nama Barang</label>
                <input
                  name="nama"
                  placeholder="Masukkan Nama Barang"
                  className="w-full border rounded p-2"
                  value={selectedBarang.nama}
                  onChange={handleUpdateChange}
                />
                {errors.nama && (
                  <p className="text-red-500 text-sm mt-1">{errors.nama}</p>
                )}

                <label>Kategori</label>
                <input
                  name="kategori"
                  placeholder="Masukkan Kategori Barang"
                  className="w-full border rounded p-2"
                  value={selectedBarang.kategori}
                  onChange={handleUpdateChange}
                />
                {errors.kategori && (
                  <p className="text-red-500 text-sm">{errors.kategori}</p>
                )}
                <label>Harga Beli</label>
                <input
                  type="number"
                  placeholder="Masukkan Harga Beli Barang"
                  name="harga_beli"
                  className="w-full border rounded p-2"
                  value={selectedBarang.harga_beli}
                  onChange={handleUpdateChange}
                />
                {errors.harga_beli && (
                  <p className="text-red-500 text-sm">{errors.harga_beli}</p>
                )}
                <label>Harga Jual</label>
                <input
                  type="number"
                  placeholder="Masukkan Harga Jual Barang"
                  name="harga_jual"
                  className="w-full border rounded p-2"
                  value={selectedBarang.harga_jual}
                  onChange={handleUpdateChange}
                />
                {errors.harga_jual && (
                  <p className="text-red-500 text-sm">{errors.harga_jual}</p>
                )}
                <label>Stok</label>
                <input
                  type="number"
                  placeholder="Masukkan Stok Barang"
                  name="stok"
                  className="w-full border rounded p-2"
                  value={selectedBarang.stok}
                  onChange={handleUpdateChange}
                />
                {errors.stok && (
                  <p className="text-red-500 text-sm">{errors.stok}</p>
                )}
                <label>Deskripsi</label>
                <textarea
                  name="deskripsi"
                  placeholder="Masukkan Deskripsi Barang"
                  className="w-full border rounded p-2"
                  value={selectedBarang.deskripsi}
                  onChange={handleUpdateChange}
                />
                {errors.deskripsi && (
                  <p className="text-red-500 text-sm">{errors.deskripsi}</p>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => {
                  resetForm();
                  setShowUpdate(false);
                }}
                className="w-full md:w-auto bg-gray-400 text-white px-4 py-2 rounded"
              >
                Batal
              </button>

              <button
                onClick={updateBarang}
                className="w-full md:w-auto bg-blue-600 text-white px-4 py-2 rounded"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
      {showDelete && selectedBarang && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4 p-6">
            <h2 className="text-2xl font-bold text-red-600">Hapus Barang</h2>

            <p className="mt-4">
              Apakah yakin ingin menghapus
              <b> {selectedBarang.nama} </b>?
            </p>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowDelete(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Batal
              </button>

              <button
                onClick={deleteBarang}
                className="bg-red-600 text-white px-4 py-2 rounded"
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
export default Barang;
