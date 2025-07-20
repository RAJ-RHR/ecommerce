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
import { deleteImageFromCloudinary } from '@/lib/deleteImageFromCloudinary';
import Image from 'next/image';
import clsx from 'clsx';

export default function AdminBlogPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [editingBlogId, setEditingBlogId] = useState('');
  const [blogs, setBlogs] = useState<any[]>([]);
  const [message, setMessage] = useState('');
  const [tab, setTab] = useState<'generate' | 'view'>('generate');

  useEffect(() => {
    const fetchData = async () => {
      const productSnap = await getDocs(collection(db, 'products'));
      const productList = productSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProducts(productList);
      setCategories([...new Set(productList.map((p: any) => p.category))]);
      fetchBlogs();
    };
    fetchData();
  }, []);

  const fetchBlogs = async () => {
    const snap = await getDocs(collection(db, 'blogs'));
    setBlogs(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  // Slug generator utility
const generateSlug = (text: string) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
    .replace(/\s+/g, '-') // collapse whitespace and replace by -
    .replace(/-+/g, '-'); // collapse dashes
};

const handleImageUpload = async (): Promise<string> => {
  if (!coverImage) return coverImageUrl || '';
  setUploading(true);
  try {
    const url = await uploadImageToCloudinary(coverImage);
    setUploading(false);
    setCoverImageUrl(url);
    return url;
  } catch (error) {
    setUploading(false);
    setMessage('❌ Failed to upload image');
    return '';
  }
};

const handleSaveBlog = async () => {
  if (!blogContent) return setMessage('❌ Blog content is empty');
  const imageUrl = await handleImageUpload();

  const title = selectedProduct || selectedCategory || 'Untitled Blog';
  const slug = generateSlug(title);

  const blogData = {
    title,
    product: selectedProduct || null,
    category: selectedCategory || null,
    content: blogContent,
    coverImage: imageUrl,
    updatedAt: serverTimestamp(),
    slug, // ✅ Add the generated slug
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
    setTab('generate');
    setMessage('✏️ Editing blog...');
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this blog?')) {
      await deleteDoc(doc(db, 'blogs', id));
      setMessage('🗑️ Blog deleted.');
      fetchBlogs();
    }
  };

  const removeImage = async () => {
    if (coverImageUrl) await deleteImageFromCloudinary(coverImageUrl);
    setCoverImage(null);
    setCoverImageUrl('');
  };

  const filteredCategories = selectedProduct
    ? categories.filter((cat) => {
        const product = products.find((p) => p.name === selectedProduct);
        return product?.category === cat;
      })
    : categories;

  const generatePrompt = () => {
    const base = `Write a high-converting SEO blog for a health and wellness website`;
    if (!selectedProduct && !selectedCategory)
      return 'Please select a product or category to generate blog prompt.';

    if (selectedProduct) {
      const product = products.find((p) => p.name === selectedProduct);
      return `${base} about "${selectedProduct}", which is a ${product?.category} supplement. Description: ${product?.description}`;
    } else {
      return `${base} about the benefits of "${selectedCategory}" category supplements.`;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Tabs */}
      <div className="flex mb-6 border-b">
        {['generate', 'view'].map((key) => (
          <button
            key={key}
            className={clsx(
              'px-4 py-2 font-medium',
              tab === key
                ? 'border-b-4 border-green-600 text-green-700'
                : 'text-gray-500 hover:text-black'
            )}
            onClick={() => setTab(key as 'generate' | 'view')}
          >
            {key === 'generate' ? '✍️ Blog Generator' : '📚 See Blogs'}
          </button>
        ))}
      </div>

      {tab === 'generate' && (
        <>
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
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">-- None --</option>
            {filteredCategories.map((c) => (
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
            <div className="relative inline-block mb-4">
              <Image
                src={coverImageUrl}
                alt="Cover"
                width={300}
                height={200}
                className="rounded"
              />
              <button
                onClick={removeImage}
                className="absolute top-0 right-0 bg-red-600 text-white p-1 rounded-full text-sm hover:bg-red-700"
              >
                ❌
              </button>
            </div>
          )}

          <button
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
            onClick={handleSaveBlog}
          >
            {editingBlogId ? 'Update Blog' : 'Save Blog'}
          </button>

          {message && <p className="mt-4 text-green-700">{message}</p>}
        </>
      )}

      {tab === 'view' && (
        <div className="space-y-4">
          {blogs.map((blog) => (
            <div key={blog.id} className="border p-4 rounded shadow bg-white">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg">{blog.title}</h3>
                <div className="space-x-2">
                  <button onClick={() => handleEdit(blog)} className="text-blue-600">
                    ✏️ Edit
                  </button>
                  <button onClick={() => handleDelete(blog.id)} className="text-red-600">
                    🗑️ Delete
                  </button>
                </div>
              </div>
              {blog.coverImage && (
                <Image src={blog.coverImage} alt="cover" width={300} height={200} className="rounded my-2" />
              )}
              <p className="text-sm text-gray-600">
                Product: {blog.product || 'N/A'} | Category: {blog.category || 'N/A'}
              </p>
              <p className="text-gray-700 line-clamp-3">{blog.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
