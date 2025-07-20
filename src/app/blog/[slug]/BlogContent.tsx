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
  Timestamp,
} from 'firebase/firestore';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';
import Link from 'next/link';

import { FaFacebook, FaWhatsapp } from 'react-icons/fa';

export default function BlogContent({ blog }: { blog: any }) {
  const shareUrl = `https://store.herbolife.in/blog/${blog.slug}`;
  const blogTitle = blog?.title || "Check this blog";
  const [likes, setLikes] = useState<number>(0);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [commentName, setCommentName] = useState('');
  const [showCount, setShowCount] = useState(5);
  const [product, setProduct] = useState<any>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<any[]>([]);

  const blogSlug = blog.slug;
  const localUserId =
    typeof window !== 'undefined'
      ? localStorage.getItem('herbolife_user_id') ||
        (() => {
          const uid = 'user_' + Math.random().toString(36).substring(2, 10);
          localStorage.setItem('herbolife_user_id', uid);
          return uid;
        })()
      : 'guest';

  const createdAt = blog.createdAt
    ? new Date(blog.createdAt.seconds * 1000).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : '';

  useEffect(() => {
    const blogRef = doc(db, 'blog_data', blogSlug);
    const unsub = onSnapshot(blogRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        const likesObj = data.likes || {};
        setLikes(Object.keys(likesObj).length);
        setLiked(!!likesObj[localUserId]);
        setComments(data.comments || []);
      } else {
        setDoc(blogRef, { likes: {}, comments: [] });
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
        .map((d) => d.data())
        .filter((b: any) => b.slug !== blogSlug);
      const blogDataRefs = await Promise.all(
        list.map((b) => getDoc(doc(db, 'blog_data', b.slug)))
      );
      const enriched = list.map((b, i) => ({
        ...b,
        ...(blogDataRefs[i].exists() ? blogDataRefs[i].data() : {}),
      }));
      setRelatedBlogs(enriched);
    };

    fetchProduct();
    fetchRelated();

    return () => unsub();
  }, [blogSlug]);

  const handleLike = async () => {
  const ref = doc(db, 'blog_data', blogSlug);
  const snap = await getDoc(ref);
  const existing = snap.exists() ? snap.data() : {};

  const localUserId = `user_${localStorage.getItem('localId') || crypto.randomUUID()}`;

  let likesObj = existing.likes;

  // If likes is a number, convert to object
  if (typeof likesObj === 'number') {
    likesObj = {}; // reset or migrate
  }

  // If likes is undefined, start fresh
  if (!likesObj || typeof likesObj !== 'object') {
    likesObj = {};
  }

  if (likesObj[localUserId]) {
    delete likesObj[localUserId];
  } else {
    likesObj[localUserId] = true;
  }

  await setDoc(ref, {
    ...existing,
    likes: likesObj,
  }, { merge: true });

  setLiked(!!likesObj[localUserId]);
  setLikes(Object.keys(likesObj).length);
};


  const handleComment = async () => {
    if (!newComment.trim() || !commentName.trim()) return alert('Enter name and comment');

    const commentData = {
      text: newComment.trim(),
      userName: commentName.trim(),
      uid: localUserId,
      createdAt: Timestamp.now(),
    };

    const ref = doc(db, 'blog_data', blogSlug);
    const snap = await getDoc(ref);
    const existing = snap.exists() ? snap.data() : { likes: {}, comments: [] };
    const updated = [commentData, ...(existing.comments || [])].slice(0, 10);
    await setDoc(ref, { ...existing, comments: updated }, { merge: true });

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

      <div className="md:col-span-2 mt-6 text-gray-700 text-sm whitespace-pre-line leading-relaxed">
        <ReactMarkdown>{blog.content}</ReactMarkdown>
      </div>

      {product && (
        <div className="flex gap-4 p-4 bg-gray-50 rounded-md mb-6 items-center">
          <Image
            src={product.image}
            alt={product.name}
            width={80}
            height={80}
            className="rounded object-cover"
          />
          <div>
            <h3 className="font-semibold">{product.name}</h3>
            <p className="text-sm text-gray-600">{product.category}</p>
            <p className="mt-1">
              <span className="text-green-600 font-bold">₹{product.offer_price}</span>{' '}
              <span className="line-through text-gray-500 ml-2">₹{product.price}</span>{' '}
              <span className="text-red-600">{calcDiscount(product.price, product.offer_price)}</span>
            </p>
            <Link href={`/products/${product.slug}`}>
              <span className="inline-block mt-2 px-4 py-1 bg-green-600 text-white rounded text-sm">
                View Product
              </span>
            </Link>
          </div>
        </div>
      )}

      <div className="flex gap-4 mt-4">
    <a
      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center px-3 py-1 rounded-md bg-blue-600 text-white"
    >
      <FaFacebook className="mr-2" />
      Share on Facebook
    </a>

    <a
      href={`https://wa.me/?text=${encodeURIComponent(blogTitle + ' ' + shareUrl)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center px-3 py-1 rounded-md bg-green-500 text-white"
    >
      <FaWhatsapp className="mr-2" />
      Share on WhatsApp
    </a>
  </div>

      <div className="mb-6">
        <input
          type="text"
          value={commentName}
          onChange={(e) => setCommentName(e.target.value)}
          placeholder="Your name"
          className="w-full border p-2 rounded mb-2"
        />
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
          <div key={i} className="border-t pt-2 mt-2 text-sm">
            <strong>{c.userName}</strong>
            <p>{c.text}</p>
            {c.createdAt?.seconds && (
              <p className="text-xs text-gray-500">
                {new Date(c.createdAt.seconds * 1000).toLocaleDateString('en-IN')}
              </p>
            )}
          </div>
        ))}

        {comments.length > showCount && (
          <button
            onClick={() => setShowCount(showCount + 5)}
            className="mt-2 text-blue-600 underline"
          >
            Show more comments
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
              className="min-w-[80%] sm:min-w-[200px] max-w-xs bg-gray-50 rounded shadow-sm p-3 flex-shrink-0"
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
              <h3 className="font-semibold text-sm line-clamp-2">{b.title}</h3>
              <p className="text-xs text-gray-600 mt-1 line-clamp-2">{b.content}</p>
              <div className="mt-2 flex gap-4 text-xs text-gray-500">
                <span>👍 {b.likes ? Object.keys(b.likes).length : 0}</span>
                <span>💬 {b.comments?.length || 0}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
