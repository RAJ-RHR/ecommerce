import { getServerSideSitemap } from 'next-sitemap';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function GET() {
  const blogSnap = await getDocs(collection(db, 'blog_data'));
  const productSnap = await getDocs(collection(db, 'products'));
  const categorySnap = await getDocs(collection(db, 'categories'));

  const blogUrls = blogSnap.docs.map(doc => ({
    loc: `https://store.herbolife.in/blog/${doc.id}`,
    lastmod: new Date().toISOString(),
  }));

  const productUrls = productSnap.docs.map(doc => ({
    loc: `https://store.herbolife.in/products/${doc.id}`,
    lastmod: new Date().toISOString(),
  }));

  const categoryUrls = categorySnap.docs.map(doc => ({
    loc: `https://store.herbolife.in/category/${doc.id}`,
    lastmod: new Date().toISOString(),
  }));

  return getServerSideSitemap([...blogUrls, ...productUrls, ...categoryUrls]);
}
