// Complete updated admin product management page with availability and review moderation

'use client';

import { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import {
  collection,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
  addDoc,
  serverTimestamp,
  DocumentData,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const generateSlug = (text: string): string =>
  text
    .toLowerCase()
    .replace(/[^؀-ۿ\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');

const generateUniqueSlug = async (baseSlug: string, editingId: string | null = null): Promise<string> => {
  const productsRef = collection(db, 'products');
  const snapshot = await getDocs(productsRef);
  const existingSlugs = snapshot.docs
    .filter((doc) => doc.id !== editingId)
    .map((doc) => (doc.data() as DocumentData).slug);
  let uniqueSlug = baseSlug;
  let counter = 1;
  while (existingSlugs.includes(uniqueSlug)) {
    uniqueSlug = `${baseSlug}-${counter}`;
    counter++;
  }
  return uniqueSlug;
};

const uploadToCloudinary = async (file: File): Promise<string> => {
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

export default function AddProductPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [form, setForm] = useState({
  name: '',
  price: '',
  offer_price: '',
  category: '',
  label: '',
  description: '',
  image: null as File | null,
  availability: 'In Stock',
  meta_description: '',
  meta_keywords: ''
});

  const [preview, setPreview] = useState<string | null>(null);
  const [products, setProducts] = useState<DocumentData[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [reviews, setReviews] = useState<DocumentData[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const perPage = 6;
  const CATEGORY_OPTIONS = ['Weight Management','Enhancers','Energy & Fitness',"Children's Health","Women's Health","Men's Health",'Bone & Joint Health','Digestive Health','Sports Nutritions','Skin & Body Care','Male Enhancement'];
  const LABEL_OPTIONS = ['Hot Deal', 'Sale', 'Limited Offer'];
  const AVAILABILITY_OPTIONS = ['In Stock', 'Out of Stock'];

  useEffect(() => {
    const isAdmin = localStorage.getItem('admin');
    if (isAdmin === 'true') {
      setIsAuthorized(true);
      fetchProducts();
      fetchReviews();
      let timeout: ReturnType<typeof setTimeout>;
      const resetTimer = () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          localStorage.removeItem('admin');
          alert('Session expired due to inactivity.');
          router.push('/admin/login');
        }, 5 * 60 * 1000);
      };
      const events = ['mousemove', 'keydown', 'click', 'scroll'];
      events.forEach((event) => document.addEventListener(event, resetTimer));
      resetTimer();
      return () => {
        clearTimeout(timeout);
        events.forEach((event) => document.removeEventListener(event, resetTimer));
      };
    } else {
      router.push('/admin/login');
    }
  }, [router]);

  const fetchProducts = async () => {
    const querySnapshot = await getDocs(collection(db, 'products'));
    setProducts(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  const fetchReviews = async () => {
    const snapshot = await getDocs(collection(db, 'reviews'));
    setReviews(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  
  

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (files && files[0]) {
      setForm({ ...form, image: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    let imageUrl = form.image ? await uploadToCloudinary(form.image) : null;
    const slug = await generateUniqueSlug(generateSlug(form.name), editingId);
  const productData = {
  name: form.name,
  price: form.price,
  offer_price: form.offer_price,
  category: form.category,
  label: form.label,
  description: form.description,
  availability: form.availability,
  slug,
  meta_description: form.meta_description,
  meta_keywords: form.meta_keywords,
  ...(imageUrl && { image: imageUrl })
};

    if (editingId) {
      await updateDoc(doc(db, 'products', editingId), productData);
    } else {
      await addDoc(collection(db, 'products'), { ...productData, image: imageUrl, createdAt: serverTimestamp() });
    }
    setForm({ name: '', price: '', offer_price: '', category: '', label: '', description: '', image: null, availability: 'In Stock', meta_description: '', meta_keywords: '' });
    setPreview(null);
    setEditingId(null);
    setLoading(false);
    setShowPopup(true);
    fetchProducts();
    setTimeout(() => setShowPopup(false), 3000);
  };

  const handleEdit = (product: DocumentData) => {
  setForm({
  name: product.name,
  price: product.price,
  offer_price: product.offer_price,
  category: product.category || '',
  label: product.label || '',
  description: product.description || '',
  image: null,
  availability: product.availability || 'In Stock',
  meta_description: product.meta_description || '',
  meta_keywords: product.meta_keywords || ''
});
 setPreview(product.image || null);
    setEditingId(product.id);
  };


  const handleDelete = async (id: string) => {
    if (confirm('Delete product?')) {
      await deleteDoc(doc(db, 'products', id));
      fetchProducts();
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchCategory = selectedCategory ? p.category === selectedCategory : true;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const paginated = filteredProducts.slice((currentPage - 1) * perPage, currentPage * perPage);
  const totalPages = Math.ceil(filteredProducts.length / perPage);

  if (!isAuthorized) return null;

  return (
  <div className="mt-24">
    <div className="max-w-5xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          {editingId ? '✏️ Edit Product' : '➕ Add Product'}
        </h2>
        <div className="flex gap-3">
          <Link href="/admin" className="bg-gray-700 text-white px-2 py-2 rounded hover:bg-gray-800">🏠 Home</Link>
          <Link href="/admin/orders" className="bg-blue-600 text-white px-2 py-2 rounded hover:bg-blue-700">📦 View Orders</Link>
          <button
            onClick={() => {
              localStorage.removeItem('admin');
              router.push('/admin/login');
            }}
            className="bg-red-600 text-white px-2 py-2 rounded hover:bg-red-700"
          >
            🔓 Logout
          </button>
        </div>
      </div>

      {showPopup && (
        <div className="bg-green-100 text-green-700 p-3 mb-4 rounded shadow">
          ✅ Product {editingId ? 'updated' : 'added'} successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Product Name" required className="border w-full p-2 rounded" />
        <input type="text" name="price" value={form.price} onChange={handleChange} placeholder="Price" required className="border w-full p-2 rounded" />
        <input type="text" name="offer_price" value={form.offer_price} onChange={handleChange} placeholder="Offer Price" required className="border w-full p-2 rounded" />

        <select name="category" value={form.category} onChange={handleChange} required className="border w-full p-2 rounded">
          <option value="">Select Category</option>
          {CATEGORY_OPTIONS.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
        </select>

        <select name="label" value={form.label} onChange={handleChange} className="border w-full p-2 rounded">
          <option value="">Select Label</option>
          {LABEL_OPTIONS.map((label) => <option key={label} value={label}>{label}</option>)}
        </select>

        <select name="availability" value={form.availability} onChange={handleChange} className="border w-full p-2 rounded">
          <option value="">Select Availability</option>
          <option value="In Stock">In Stock</option>
          <option value="Out of Stock">Out of Stock</option>
          <option value="Limited Stock">Limited Stock</option>
        </select>

        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" rows={3} className="border w-full p-2 rounded" />
<textarea
  name="meta_description"
  value={form.meta_description}
  onChange={handleChange}
  placeholder="Meta Description (for SEO)"
  rows={2}
  className="border w-full p-2 rounded"
/>

<input
  type="text"
  name="meta_keywords"
  value={form.meta_keywords}
  onChange={handleChange}
  placeholder="Meta Keywords (comma-separated)"
  className="border w-full p-2 rounded"
/>

        <input type="file" name="image" accept="image/*" onChange={handleChange} className="border w-full p-2 rounded" {...(editingId ? {} : { required: true })} />
        {preview && <img src={preview} className="w-full h-60 object-contain bg-white border rounded" />}

        <button type="submit" className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700">
          {loading ? (editingId ? 'Updating...' : 'Uploading...') : (editingId ? 'Update Product' : 'Upload Product')}
        </button>
      </form>

      <div className="flex flex-col md:flex-row justify-between mt-10 gap-4">
        <input type="text" placeholder="Search by product name..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="border p-2 rounded w-full md:max-w-sm" />
        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="border p-2 rounded w-full md:w-auto">
          <option value="">All Categories</option>
          {CATEGORY_OPTIONS.map((cat) => <option key={cat}>{cat}</option>)}
        </select>
      </div>

      <div className="flex justify-center items-center gap-4 mt-6">
        <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="bg-gray-200 px-3 py-1 rounded">Prev</button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="bg-gray-200 px-3 py-1 rounded">Next</button>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {paginated.map(product => (
          <div key={product.id} className="border rounded p-4 flex flex-col">
            <img src={product.image} alt={product.name} className="h-40 object-contain bg-white rounded mb-2" />
            <h4 className="font-bold">{product.name}</h4>
            <p>Category: {product.category}</p>
            <p>Price: ₹{product.price}</p>
            <p>Offer: ₹{product.offer_price}</p>
            <p className="text-sm text-gray-600">Availability: {product.availability || 'N/A'}</p>
            <p className="text-sm text-gray-600">Label: {product.label || 'None'}</p>
            <p className="text-sm text-gray-600">Desc: {product.description || 'No description'}</p>
            <p className="text-xs text-gray-500">Meta: {product.meta_description?.slice(0, 50)}...</p>
<p className="text-xs text-gray-500">Keywords: {product.meta_keywords}</p>

            <div className="flex gap-2 mt-2">
              <button onClick={() => handleEdit(product)} className="bg-yellow-500 text-white px-3 py-1 rounded">Edit</button>
              <button onClick={() => handleDelete(product.id)} className="bg-red-600 text-white px-3 py-1 rounded">Delete</button>
            </div>
          </div>
        ))}
      </div>

    
    </div>
  </div>
);
  } 
