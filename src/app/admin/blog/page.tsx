'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import { uploadImageToCloudinary } from '@/lib/uploadImageToCloudinary';
import Image from 'next/image';

export default function AdminBlogPage() {
  const [products, setProducts] = useState<Array<{ id: string; [key: string]: any }>>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [message, setMessage] = useState('');
  const [blogs, setBlogs] = useState<Array<{ id: string; [key: string]: any }>>([]);
  const [editingBlogId, setEditingBlogId] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const productSnap = await getDocs(collection(db, 'products'));
      const productList = productSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productList);

      const categorySet = new Set(productList.map((p: any) => p.category));
      setCategories(Array.from(categorySet));

      fetchBlogs();
    };

    fetchData();
  }, []);

  const fetchBlogs = async () => {
    const snap = await getDocs(collection(db, 'blogs'));
    const blogList = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setBlogs(blogList);
  };

  const handleImageUpload = async () => {
    if (!coverImage) return coverImageUrl || '';
    setUploading(true);
    const url = await uploadImageToCloudinary(coverImage);
    setCoverImageUrl(url);
    setUploading(false);
    return url;
  };

  const handleSaveBlog = async () => {
    if (!blogContent) return setMessage('❌ Blog content is empty');

    const imageUrl = await handleImageUpload();

    const blogData = {
      title: selectedProduct || selectedCategory || 'Untitled Blog',
      product: selectedProduct || null,
      category: selectedCategory || null,
      content: blogContent,
      coverImage: imageUrl,
      updatedAt: serverTimestamp(),
    };

    if (editingBlogId) {
      await updateDoc(doc(db, 'blogs', editingBlogId), blogData);
      setMessage('✅ Blog updated!');
    } else {
      await addDoc(collection(db, 'blogs'), {
        ...blogData,
        createdAt: serverTimestamp(),
      });
      setMessage('✅ Blog saved!');
    }

    resetForm();
    fetchBlogs();
  };

  const resetForm = () => {
    setSelectedProduct('');
    setSelectedCategory('');
    setBlogContent('');
    setCoverImage(null);
    setCoverImageUrl('');
    setEditingBlogId('');
  };

  const handleEdit = (blog: any) => {
    setSelectedProduct(blog.product || '');
    setSelectedCategory(blog.category || '');
    setBlogContent(blog.content || '');
    setCoverImageUrl(blog.coverImage || '');
    setEditingBlogId(blog.id);
    setMessage('✏️ Editing blog...');
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this blog?')) {
      await deleteDoc(doc(db, 'blogs', id));
      setMessage('🗑️ Blog deleted.');
      fetchBlogs();
    }
  };

  const generatePrompt = () => {
    if (!selectedProduct && !selectedCategory)
      return 'Please select a product or category to generate blog prompt.';

    const base = `Write a high-converting SEO blog for a health and wellness website`;
    if (selectedProduct) {
      const product = products.find((p: any) => p.name === selectedProduct);
      return `${base} about "${selectedProduct}", which is a ${product?.category} supplement. Description: ${product?.description}`;
    } else {
      return `${base} about the benefits of "${selectedCategory}" category supplements.`;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">📝 Blog Generator</h1>

      <label className="block mb-1 font-medium">Select Product (optional)</label>
      <select
        className="w-full p-2 border rounded mb-4"
        value={selectedProduct}
        onChange={(e) => {
          setSelectedProduct(e.target.value);
          setSelectedCategory('');
        }}
      >
        <option value="">-- None --</option>
        {products.map((p: any) => (
          <option key={p.id} value={p.name}>
            {p.name}
          </option>
        ))}
      </select>

      <label className="block mb-1 font-medium">Select Category (optional)</label>
      <select
        className="w-full p-2 border rounded mb-4"
        value={selectedCategory}
        onChange={(e) => {
          setSelectedCategory(e.target.value);
          setSelectedProduct('');
        }}
      >
        <option value="">-- None --</option>
        {categories.map((c: any) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <div className="bg-gray-100 p-3 rounded mb-4 text-sm text-gray-700">
        <strong>GPT Prompt:</strong>
        <div className="mt-1">{generatePrompt()}</div>
      </div>

      <label className="block mb-1 font-medium">Paste Blog Content</label>
      <textarea
        rows={10}
        className="w-full border rounded p-2 mb-4"
        value={blogContent}
        onChange={(e) => setBlogContent(e.target.value)}
        placeholder="Paste your generated blog content here..."
      ></textarea>

      <label className="block mb-1 font-medium">Upload Cover Image</label>
      <input
        type="file"
        accept="image/*"
        className="mb-4"
        onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
      />

      {uploading && <p className="text-blue-600 mb-2">Uploading image...</p>}
      {coverImageUrl && (
        <Image
          src={coverImageUrl}
          alt="Cover"
          width={300}
          height={200}
          className="mb-4 rounded"
        />
      )}

      <button
        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
        onClick={handleSaveBlog}
      >
        {editingBlogId ? 'Update Blog' : 'Save Blog'}
      </button>

      {message && <p className="mt-4 text-green-700">{message}</p>}

      {/* Blog List */}
      <div className="mt-10">
        <h2 className="text-xl font-bold mb-4">📚 All Blogs</h2>
        {blogs.map((blog: any) => (
          <div
            key={blog.id}
            className="border p-4 mb-4 rounded shadow bg-white space-y-2"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{blog.title}</h3>
              <div className="space-x-2">
                <button
                  className="text-blue-600 hover:underline"
                  onClick={() => handleEdit(blog)}
                >
                  ✏️ Edit
                </button>
                <button
                  className="text-red-600 hover:underline"
                  onClick={() => handleDelete(blog.id)}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
            {blog.coverImage && (
              <Image
                src={blog.coverImage}
                alt="cover"
                width={200}
                height={120}
                className="rounded"
              />
            )}
            <p className="text-sm text-gray-600">
              Product: {blog.product || 'N/A'} | Category:{' '}
              {blog.category || 'N/A'}
            </p>
            <p className="line-clamp-3 text-gray-700">{blog.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
