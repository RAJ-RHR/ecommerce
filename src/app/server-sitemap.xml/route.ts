import { getServerSideSitemap } from 'next-sitemap';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function GET() {
  try {
    const [blogSnap, productSnap] = await Promise.all([
      getDocs(collection(db, 'blog_data')),
      getDocs(collection(db, 'products')),
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

    // Extract unique category names from products
    const categorySet = new Set<string>();
    productSnap.docs.forEach((doc) => {
      const category = doc.data().category;
      if (category) categorySet.add(category);
    });

    const categoryUrls = Array.from(categorySet).map((category) => ({
      loc: `https://store.herbolife.in/category/${encodeURIComponent(category)}`,
      lastmod: new Date().toISOString(),
    }));

    const allUrls = [...blogUrls, ...productUrls, ...categoryUrls];

    return getServerSideSitemap(allUrls);
  } catch (error) {
    console.error('❌ Sitemap generation error:', error);
    return new Response('Error generating sitemap', { status: 500 });
  }
}
