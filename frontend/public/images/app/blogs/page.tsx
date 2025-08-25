import { motion } from 'framer-motion';
  import Link from 'next/link';

  export default function Blogs() {
    const blogPosts = [
      { title: 'Enhancing Efficiency with ERP Solutions', slug: '/blogs/erp-solutions', excerpt: 'Discover how our ERP solutions streamline business operations.' },
      { title: 'The Power of Custom Software Development', slug: '/blogs/software-development', excerpt: 'Learn how custom software can transform your business.' },
    ];

    return (
      <div className="container mx-auto px-4 py-12">
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Blogs</h1>
          <p className="text-lg mb-6 text-text">Explore insights and updates on our products and services.</p>
        </motion.section>
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid md:grid-cols-2 gap-8"
        >
          {blogPosts.map((post) => (
            <Link key={post.slug} href={post.slug} className="p-6 bg-card rounded-lg shadow-md hover:shadow-lg transition">
              <h2 className="text-2xl font-semibold mb-2">{post.title}</h2>
              <p className="text-text">{post.excerpt}</p>
            </Link>
          ))}
        </motion.section>
      </div>
    );
  }
