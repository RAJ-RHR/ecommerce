import { getServerSideSitemap } from 'next-sitemap';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function GET() {
  try {
    const [blogSnap, productSnap, categorySnap] = await Promise.all([
      getDocs(collection(db, 'blog_data')),
      getDocs(collection(db, 'products')),
      getDocs(collection(db, 'categories')),
    ]);

    const blogUrls = blogSnap.docs.map((doc) => ({
      loc: `https://store.herbolife.in/blog/${doc.id}`,
      lastmod: new Date().toISOString(),
    }));

    const productUrls = productSnap.docs
      .filter((doc) => !!doc.data().slug)
      .map((doc) => ({
        loc: `https://store.herbolife.in/products/${encodeURIComponent(doc.data().slug)}`,
        lastmod: new Date().toISOString(),
      }));

    const categoryUrls = categorySnap.docs.map((doc) => {
      const data = doc.data();
      const slug = data.slug || doc.id;
      return {
        loc: `https://store.herbolife.in/category/${encodeURIComponent(slug)}`,
        lastmod: new Date().toISOString(),
      };
    });

    const allUrls = [...blogUrls, ...productUrls, ...categoryUrls];

    return getServerSideSitemap(allUrls);
  } catch (error) {
    console.error('❌ Sitemap generation error:', error);
    return new Response('Error generating sitemap', { status: 500 });
  }
}
