'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import styles from './blog-detail.module.css';

export default function BlogDetailPage() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    fetch(`http://10.10.50.93:5000/api/blogs/${slug}`)
      .then(res => res.json())
      .then(data => setBlog(data))
      .catch(err => console.error('Error fetching blog:', err));
  }, [slug]);

  if (!blog) return <div className={styles.loading}>Loading...</div>;

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1>{blog.title}</h1>
        <p className={styles.meta}>
          Posted on: {new Date(blog.date).toLocaleDateString()} | Category: {blog.category}
        </p>
        {blog.image && (
          <Image
            src={blog.image}
            alt={blog.title}
            width={800}
            height={400}
            className={styles.featuredImage}
          />
        )}
        <div className={styles.content} dangerouslySetInnerHTML={{ __html: blog.content }} />
        <div className={styles.socialShare}>
          <a href={`https://www.linkedin.com/shareArticle?url=http://10.10.50.93:3001/blog/${blog.slug}`} target="_blank" className={styles.socialLink}>Share on LinkedIn</a>
          <a href={`https://twitter.com/intent/tweet?url=http://10.10.50.93:3001/blog/${blog.slug}`} target="_blank" className={styles.socialLink}>Share on Twitter</a>
        </div>
      </main>

      <aside className={styles.sidebar}>
        <h3>Explore More</h3>
        <p><Link href="/blog">All Blogs</Link></p>
        <h3>Categories</h3>
        <ul>
          <li><Link href="/blog?category=General">General</Link></li>
          <li><Link href="/blog?category=ERP">ERP</Link></li>
          <li><Link href="/blog?category=BDM">BDM</Link></li>
          <li><Link href="/blog?category=Payroll">Payroll</Link></li>
          <li><Link href="/blog?category=Cloud Services">Cloud Services</Link></li>
        </ul>
      </aside>

      
    </div>
  );
}