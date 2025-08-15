"use client";

import React, { useState, useEffect } from "react";
import { Edit, Trash2, Plus, Loader2, Shield } from "lucide-react";
import supabase from "../lib/supabase";

export default function AdminTabel({ admins, loading, error }) {
  // Cek apakah user adalah super admin
  const [isSuperAdminState, setIsSuperAdminState] = useState(false);
  
  useEffect(() => {
    // Cek apakah user adalah super admin saat komponen dimount
    const email = localStorage.getItem('userEmail');
    console.log('Current user email:', email); // Debugging
    const isSuper = email === 'rifki10rpl1.2019@gmail.com';
    console.log('Is super admin:', isSuper); // Debugging
    setIsSuperAdminState(isSuper);
  }, []);
  
  const isSuperAdmin = () => isSuperAdminState;
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formType, setFormType] = useState("add"); // add, edit
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);

  // Fungsi untuk membuka form tambah admin
  const handleAdd = () => {
    setFormData({
      username: "",
      email: "",
      password: ""
    });
    setFormType("add");
    setIsFormOpen(true);
    setFormError(null);
  };

  // Fungsi untuk membuka form edit admin
  const handleEdit = (admin) => {
    setFormData({
      username: admin.username,
      email: admin.email,
      password: "" // Password tidak ditampilkan saat edit
    });
    setCurrentAdmin(admin);
    setFormType("edit");
    setIsFormOpen(true);
    setFormError(null);
  };

  // Fungsi untuk menangani perubahan input form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Fungsi untuk menangani submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);

    try {
      if (formType === "add") {
        // Validasi input
        if (!formData.username || !formData.email) {
          throw new Error("Username dan email harus diisi");
        }

        // Tambah admin baru (password opsional karena admin login tanpa validasi password)
        const { data, error } = await supabase
          .from('admin')
          .insert([{
            username: formData.username,
            email: formData.email,
            password: formData.password || 'default-password' // Password opsional dengan nilai default
          }])
          .select();

        if (error) throw error;

        // Update admins state dengan data baru tanpa refresh halaman
        window.location.reload();
      } else if (formType === "edit") {
        // Validasi input
        if (!formData.username || !formData.email) {
          throw new Error("Username dan email harus diisi");
        }

        // Update data admin
        const updateData = {
          username: formData.username,
          email: formData.email
        };

        // Jika password diisi, update juga password
        if (formData.password) {
          updateData.password = formData.password;
        }

        const { data, error } = await supabase
          .from('admin')
          .update(updateData)
          .eq('id', currentAdmin.id)
          .select();

        if (error) throw error;
        
        // Update data di UI tanpa refresh halaman
        const updatedAdmin = data[0];
        // Gunakan callback untuk update data di parent component
        if (updatedAdmin) {
          // Tutup form setelah berhasil
          setIsFormOpen(false);
          // Refresh halaman untuk menampilkan data terbaru
          window.location.reload();
        }
      }

      // Tutup form setelah berhasil
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error:', error);
      setFormError(error.message);
    } finally {
      setFormLoading(false);
    }
  };

  // Fungsi untuk menghapus admin
  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus admin ini?")) {
      try {
        const { error } = await supabase
          .from('admin')
          .delete()
          .eq('id', id);

        if (error) throw error;

        // Refresh halaman untuk menampilkan data terbaru
        window.location.reload();
      } catch (error) {
        console.error('Error:', error);
        alert("Gagal menghapus admin: " + error.message);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
        <span className="block sm:inline">Terjadi kesalahan: {error}</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header dengan tombol tambah (hanya untuk super admin) */}
      <div className="p-4 flex justify-between items-center border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center">
          <Shield className="w-5 h-5 mr-2 text-purple-600" />
          Daftar Admin
        </h2>
        {isSuperAdmin() && (
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg transition-colors duration-200 text-sm font-medium"
          >
            <Plus size={16} />
            Tambah Admin
          </button>
        )}
      </div>

      {/* Tabel Admin */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Username
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              {isSuperAdmin() && (
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {admins.length > 0 ? (
              admins.map((admin) => (
                <tr key={admin.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {admin.username}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {admin.email}
                  </td>
                  {isSuperAdmin() && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(admin)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(admin.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Hapus"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">
                  Belum ada data admin
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {formType === "add" ? "Tambah Admin Baru" : "Edit Admin"}
            </h3>

            {formError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                <span className="block sm:inline">{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="username">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Masukkan username"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Masukkan email"
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="password">
                  Password {formType === "edit" && "(Kosongkan jika tidak ingin mengubah)"}
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder={formType === "add" ? "Masukkan password" : "Masukkan password baru"}
                  required={formType === "add"}
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none flex items-center justify-center min-w-[80px]"
                  disabled={formLoading}
                >
                  {formLoading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    formType === "add" ? "Tambah" : "Simpan"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}