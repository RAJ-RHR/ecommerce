'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import {
  doc,
  getDoc,
  setDoc,
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
import { FaFacebook, FaWhatsapp, FaThumbsUp } from 'react-icons/fa';

// ✅ Local user ID
const getLocalUserId = () => {
  if (typeof window === 'undefined') return 'guest';
  let uid = localStorage.getItem('herbolife_user_id');
  if (!uid) {
    uid = 'user_' + Math.random().toString(36).substring(2, 10);
    localStorage.setItem('herbolife_user_id', uid);
  }
  return uid;
};

export default function BlogContent({ blog }: { blog: any }) {
  const localUserId = getLocalUserId();
  const shareUrl = `https://store.herbolife.in/blog/${blog.slug}`;
  const blogTitle = blog?.title || 'Check this blog';
  const blogSlug = blog.slug;

  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [dislikes, setDislikes] = useState(0);
  const [disliked, setDisliked] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [commentName, setCommentName] = useState('');
  const [showCount, setShowCount] = useState(5);
  const [product, setProduct] = useState<any>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<any[]>([]);

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
        const dislikesObj = data.dislikes || {};

        setLikes(Object.keys(likesObj).length);
        setLiked(!!likesObj[localUserId]);
        setDislikes(Object.keys(dislikesObj).length);
        setDisliked(!!dislikesObj[localUserId]);
        setComments(data.comments || []);
      } else {
        setDoc(blogRef, { likes: {}, dislikes: {}, comments: [] });
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
      const list = snap.docs.map((d) => d.data()).filter((b) => b.slug !== blogSlug);
      const dataRefs = await Promise.all(
        list.map((b) => getDoc(doc(db, 'blog_data', b.slug)))
      );
      const enriched = list.map((b, i) => ({
        ...b,
        ...(dataRefs[i].exists() ? dataRefs[i].data() : {}),
      }));
      setRelatedBlogs(enriched);
    };

    fetchProduct();
    fetchRelated();
    return () => unsub();
  }, [blogSlug, localUserId]);

  const handleLike = async () => {
    const ref = doc(db, 'blog_data', blogSlug);
    const snap = await getDoc(ref);
    const existing = snap.exists() ? snap.data() : {};
    let likesObj = existing.likes || {};
    let dislikesObj = existing.dislikes || {};

    if (likesObj[localUserId]) {
      delete likesObj[localUserId];
    } else {
      likesObj[localUserId] = true;
      delete dislikesObj[localUserId]; // remove dislike if liked
    }

    await setDoc(ref, { likes: likesObj, dislikes: dislikesObj }, { merge: true });

    setLiked(!!likesObj[localUserId]);
    setDisliked(!!dislikesObj[localUserId]);
    setLikes(Object.keys(likesObj).length);
    setDislikes(Object.keys(dislikesObj).length);
  };

  const handleDislike = async () => {
    const ref = doc(db, 'blog_data', blogSlug);
    const snap = await getDoc(ref);
    const existing = snap.exists() ? snap.data() : {};
    let dislikesObj = existing.dislikes || {};
    let likesObj = existing.likes || {};

    if (dislikesObj[localUserId]) {
      delete dislikesObj[localUserId];
    } else {
      dislikesObj[localUserId] = true;
      delete likesObj[localUserId]; // remove like if disliked
    }

    await setDoc(ref, { dislikes: dislikesObj, likes: likesObj }, { merge: true });

    setDisliked(!!dislikesObj[localUserId]);
    setLiked(!!likesObj[localUserId]);
    setDislikes(Object.keys(dislikesObj).length);
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

      {blog.coverImage && (
        <div className="mb-6 flex justify-center">
          <Image src={blog.coverImage} alt="cover" width={400} height={200} className="rounded-md" />
        </div>
      )}

      <div className="text-sm text-gray-700 mt-6 leading-relaxed whitespace-pre-line">
        <ReactMarkdown>{blog.content}</ReactMarkdown>
      </div>

      {product && (
        <div className="flex gap-4 p-4 bg-gray-50 rounded-md mb-6 mt-4 items-center">
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

      {/* Likes, Dislikes, Share */}
<div className="flex items-center justify-between mb-4 mt-4">
  {/* Left Side: Like & Dislike */}
  <div className="flex gap-2">
    <button
      onClick={handleLike}
      onDoubleClick={(e) => e.preventDefault()}
      className={`flex items-center px-3 py-1 rounded-md transition-transform duration-200 ${
        liked ? 'bg-blue-600 text-white scale-110' : 'bg-gray-200 text-gray-700'
      }`}
    >
      <FaThumbsUp className="mr-2" />
      {likes}
    </button>

    <button
      onClick={handleDislike}
      onDoubleClick={(e) => e.preventDefault()}
      className={`flex items-center px-3 py-1 rounded-md transition-transform duration-200 ${
        disliked ? 'bg-red-600 text-white scale-110' : 'bg-gray-200 text-gray-700'
      }`}
    >
      <FaThumbsUp className="mr-2 rotate-180" />
      {dislikes}
    </button>
  </div>

  {/* Right Side: Share Buttons */}
  <div className="flex gap-2">
    <a
      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center px-3 py-1 rounded-md bg-blue-600 text-white"
    >
      <FaFacebook className="mr-2" />
      Share
    </a>

    <a
      href={`https://wa.me/?text=${encodeURIComponent(blogTitle + ' ' + shareUrl)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center px-3 py-1 rounded-md bg-green-500 text-white"
    >
      <FaWhatsapp className="mr-2" />
      Share
    </a>
  </div>
</div>


      {/* Comments */}
      <div className="mb-6 mt-4">
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
        <button onClick={handleComment} className="bg-blue-600 text-white px-4 py-1 rounded">
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

      {/* Related Blogs */}
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
              <p className="text-xs text-gray-700 mt-1 line-clamp-2">{b.category}</p>
              <p className="text-xs text-gray-600 mt-1 line-clamp-2">{b.content}</p>
              <div className="mt-2 flex gap-4 text-xs text-gray-500">
                <span>👍 {b.likes ? Object.keys(b.likes).length : 0}</span>
                <span>👎 {b.dislikes ? Object.keys(b.dislikes).length : 0}</span>
                <span>💬 {b.comments?.length || 0}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
