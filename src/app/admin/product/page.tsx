'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import {
  collection,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
  addDoc,
} from 'firebase/firestore';
import Link from 'next/link';
import { serverTimestamp } from 'firebase/firestore';
export default function AddProductPage() {
  const [form, setForm] = useState({
    name: '',
    price: '',
    offer_price: '',
    category: '',
    image: null as File | null,
  });

  const [preview, setPreview] = useState<string | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 6;

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const querySnapshot = await getDocs(collection(db, 'products'));
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setProducts(data);
  };

  const handleChange = (e: any) => {
    const { name, value, files } = e.target;
    if (files && files[0]) {
      setForm({ ...form, image: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const uploadToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'herbolife_upload');
    const res = await fetch('https://api.cloudinary.com/v1_1/deijswbt1/image/upload', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    return data.secure_url;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    let imageUrl = null;

    if (form.image) {
      imageUrl = await uploadToCloudinary(form.image);
      if (!imageUrl) return alert('❌ Image upload failed');
    }

    const productData = {
      name: form.name,
      price: form.price,
      offer_price: form.offer_price,
      category: form.category,
      ...(imageUrl && { image: imageUrl }),
    };

    if (editingId) {
      const ref = doc(db, 'products', editingId);
      await updateDoc(ref, productData);
      alert('✅ Product updated!');
    } else {
      
      await addDoc(collection(db, 'products'), {
        ...productData,
        image: imageUrl,
         createdAt: serverTimestamp(), // ✅ add this
      });
      alert('✅ Product added!');
    }

    setForm({ name: '', price: '', offer_price: '', category: '', image: null });
    setPreview(null);
    setEditingId(null);
    fetchProducts();
  };

  const handleEdit = (product: any) => {
    setForm({
      name: product.name,
      price: product.price,
      offer_price: product.offer_price,
      category: product.category || '',
      image: null,
    });
    setPreview(product.image);
    setEditingId(product.id);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure to delete?')) {
      await deleteDoc(doc(db, 'products', id));
      fetchProducts();
    }
  };

  const categories = [...new Set(products.map((p) => p.category))];
  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category === selectedCategory)
    : products;

  const totalPages = Math.ceil(filteredProducts.length / perPage);
  const paginated = filteredProducts.slice((currentPage - 1) * perPage, currentPage * perPage);

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">{editingId ? '✏️ Edit Product' : '➕ Add Product'}</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Product Name" className="border w-full p-2 rounded" required />
        <input type="text" name="price" value={form.price} onChange={handleChange} placeholder="Price" className="border w-full p-2 rounded" required />
        <input type="text" name="offer_price" value={form.offer_price} onChange={handleChange} placeholder="Offer Price" className="border w-full p-2 rounded" required />
        <input type="text" name="category" value={form.category} onChange={handleChange} placeholder="Category (e.g. Protein)" className="border w-full p-2 rounded" required />
        <input type="file" name="image" onChange={handleChange} accept="image/*" className="border w-full p-2 rounded" {...(editingId ? {} : { required: true })} />
        {preview && <img src={preview} alt="Preview" className="w-full h-60 object-contain bg-white rounded" />}
        <button type="submit" className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700">{editingId ? 'Update Product' : 'Upload Product'}</button>
      </form>

      {/* ✅ Category Filter + Pagination */}
      <div className="mt-10 flex justify-between items-center">
        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="border p-2 rounded">
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>
        <div className="flex gap-2">
          <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1} className="bg-gray-200 px-3 py-1 rounded">Prev</button>
          <span>Page {currentPage} of {totalPages}</span>
          <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="bg-gray-200 px-3 py-1 rounded">Next</button>
        </div>
      </div>

      {/* ✅ Product List */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {paginated.map((product) => (
          <div key={product.id} className="border rounded p-4 flex flex-col">
            <img src={product.image} alt={product.name} className="h-40 object-contain bg-white rounded mb-2" />
            <h4 className="font-bold">{product.name}</h4>
            <p>Category: {product.category}</p>
            <p>Price: ₹{product.price}</p>
            <p>Offer: ₹{product.offer_price}</p>
            <div className="flex gap-2 mt-2">
              <Link href={`/products/${product.id}`}>
                <span className="bg-blue-600 text-white px-3 py-1 rounded cursor-pointer">View</span>
              </Link>
              <button onClick={() => handleEdit(product)} className="bg-yellow-500 text-white px-3 py-1 rounded">Edit</button>
              <button onClick={() => handleDelete(product.id)} className="bg-red-600 text-white px-3 py-1 rounded">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
