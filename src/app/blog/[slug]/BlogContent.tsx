'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
  collection,
  query,
  where,
  getDocs,
  Timestamp
} from 'firebase/firestore';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';
import Link from 'next/link';

export default function BlogContent({ blog }: { blog: any }) {
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [showCount, setShowCount] = useState(5);
  const [product, setProduct] = useState<any>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<any[]>([]);

  const blogSlug = blog.slug;
  const createdAt = blog.createdAt
    ? new Date(blog.createdAt.seconds * 1000).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : '';

  useEffect(() => {
    const blogRef = doc(db, 'blog_data', blogSlug);
    const unsub = onSnapshot(blogRef, snap => {
      if (snap.exists()) {
        const data = snap.data();
        setLikes(data.likes || 0);
        setComments(data.comments || []);
      } else {
        setDoc(blogRef, { likes: 0, comments: [] });
      }
    });

    const fetchProduct = async () => {
      if (!blog.product) return;
      const q = query(collection(db, 'products'), where('name', '==', blog.product));
      const snap = await getDocs(q);
      if (!snap.empty) setProduct(snap.docs[0].data());
    };

    const fetchRelated = async () => {
      const q = query(collection(db, 'blogs'));
      const snap = await getDocs(q);
      const list = snap.docs
        .map(d => d.data())
        .filter((b: any) => b.slug !== blogSlug);
      setRelatedBlogs(list);
    };

    fetchProduct();
    fetchRelated();

    return () => unsub();
  }, [blogSlug]);

  const handleLike = async () => {
    const ref = doc(db, 'blog_data', blogSlug);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      await updateDoc(ref, { likes: (snap.data().likes || 0) + 1 });
    } else {
      await setDoc(ref, { likes: 1, comments: [] });
    }
  };

  const handleComment = async () => {
    if (!newComment.trim()) return;
    const ref = doc(db, 'blog_data', blogSlug);
    const snap = await getDoc(ref);
    const commentData = {
      text: newComment.trim(),
      createdAt: Timestamp.now(),
    };

    if (snap.exists()) {
      const prev = snap.data().comments || [];
      const updated = [commentData, ...prev].slice(0, 10);
      await updateDoc(ref, { comments: updated });
    } else {
      await setDoc(ref, { likes: 0, comments: [commentData] });
    }

    setNewComment('');
  };

  const calcDiscount = (price: string, offer: string) => {
    const p = parseFloat(price);
    const o = parseFloat(offer);
    if (!p || !o) return '';
    return `${Math.round(((p - o) / p) * 100)}% OFF`;
  };

  const shownComments = comments.slice(0, showCount);

  return (
    <div className="bg-white text-black p-4 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-2">{blog.title}</h1>
      <p className="text-center text-sm text-gray-500 mb-4">
        By: <strong>Herbolife</strong> | {blog.product} in {blog.category} | {createdAt}
      </p>

      {blog.cover && (
        <div className="mb-6 flex justify-center">
          <Image src={blog.cover} alt="cover" width={800} height={400} className="rounded-md" />
        </div>
      )}

      <div className="prose prose-lg max-w-none mb-8">
        <ReactMarkdown>{blog.content}</ReactMarkdown>
      </div>

      {product && (
        <div className="flex gap-4 p-4 bg-gray-50 rounded-md mb-6 items-center">
          <Image src={product.image} alt={product.name} width={80} height={80} className="rounded" />
          <div>
            <h3 className="font-semibold">{product.name}</h3>
            <p className="text-sm text-gray-600">{product.category}</p>
            <p className="mt-1">
              <span className="text-green-600 font-bold">₹{product.offer_price}</span>{' '}
              <span className="line-through text-gray-500 ml-2">₹{product.price}</span>{' '}
              <span className="text-red-600">{calcDiscount(product.price, product.offer_price)}</span>
            </p>
            <Link href={`/products/${product.slug}`}>
              <span className="inline-block mt-2 px-4 py-1 bg-green-600 text-white rounded">
                View Product
              </span>
            </Link>
          </div>
        </div>
      )}

      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={handleLike}
          className="flex items-center gap-1 text-blue-600 hover:underline"
        >
          👍 {likes}
        </button>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            `https://store.herbolife.in/blog/${blog.slug}`
          )}`}
          target="_blank"
          className="text-blue-600 underline"
        >
          Share on Facebook
        </a>
        <a
          href={`https://wa.me/?text=${encodeURIComponent(
            `Read this blog: https://store.herbolife.in/blog/${blog.slug}`
          )}`}
          target="_blank"
          className="text-green-600 underline"
        >
          Share on WhatsApp
        </a>
      </div>

      <div className="mb-6">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows={3}
          placeholder="Write a comment..."
          className="w-full border p-2 rounded mb-2"
        />
        <button
          onClick={handleComment}
          className="bg-blue-600 text-white px-4 py-1 rounded"
        >
          Post Comment
        </button>

        {shownComments.map((c, i) => (
          <div key={i} className="border-t pt-2 mt-2">
            <p>{c.text}</p>
            {c.createdAt?.seconds && (
              <p className="text-xs text-gray-500">
                {new Date(c.createdAt.seconds * 1000).toLocaleDateString('en-IN')}
              </p>
            )}
          </div>
        ))}

        {comments.length > 2 && showCount === 2 && (
          <button
            onClick={() => setShowCount(13)}
            className="mt-2 text-blue-600 underline"
          >
            See more comments
          </button>
        )}
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Related Blogs</h2>
        <div className="flex overflow-x-auto gap-4 pb-2">
          {relatedBlogs.map((b) => (
            <Link
              href={`/blog/${b.slug}`}
              key={b.slug}
              className="min-w-[60%] sm:min-w-[200px] max-w-xs bg-gray-50 rounded shadow-sm p-3 flex-shrink-0"
            >
              {b.coverImage && (
                <Image
                  src={b.coverImage}
                  alt={b.title}
                  width={280}
                  height={160}
                  className="rounded mb-2 object-cover w-full h-40"
                />
              )}
               <h3 className="font-semibold line-clamp-2">{b.product}</h3>
              <h3 className=" line-clamp-2">{b.content}</h3>
              <p className="text-xs text-gray-600 mt-1 line-clamp-3">{b.metaDesc}</p>
              <div className="mt-2 flex gap-4 text-sm">
                <span>👍 {b.likes?.length || 0}</span>
                <span>💬 {b.comments?.length || 0}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
