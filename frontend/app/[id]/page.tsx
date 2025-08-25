import Image from 'next/image';
import Link from 'next/link';

export async function getStaticPaths() {
  const blogPosts = [
    { id: 1, title: 'ERP Trends in 2025', category: 'ERP', date: 'Aug 20, 2025', excerpt: 'Explore the latest ERP trends shaping the future of enterprise management.', image: '/blogs/erp-trend.jpg', slug: 'erp-trends-2025', content: 'Detailed content about ERP trends in 2025 goes here. This could include market analysis, technology updates, and implementation tips...' },
    { id: 2, title: 'BDM Strategies for Growth', category: 'BDM', date: 'Aug 22, 2025', excerpt: 'Learn effective business development strategies to boost your company’s growth.', image: '/blogs/bdm-strategy.jpg', slug: 'bdm-strategies-growth', content: 'Detailed content about BDM strategies including case studies, tools, and best practices...' },
    { id: 3, title: 'Payroll Automation Benefits', category: 'Payroll', date: 'Aug 23, 2025', excerpt: 'Discover how automation can transform your payroll processes.', image: '/blogs/payroll-automation.jpg', slug: 'payroll-automation-benefits', content: 'Detailed content on payroll automation benefits, including cost savings and efficiency gains...' },
    { id: 4, title: 'Cloud Security Best Practices', category: 'Cloud Services', date: 'Aug 24, 2025', excerpt: 'Stay ahead with the best practices for securing your cloud infrastructure.', image: '/blogs/cloud-security.jpg', slug: 'cloud-security-best-practices', content: 'Detailed content on cloud security practices, including encryption and monitoring techniques...' },
    { id: 5, title: 'Future of Cloud Computing', category: 'Cloud Services', date: 'Aug 25, 2025', excerpt: 'A look into the innovations driving the next wave of cloud technology.', image: '/blogs/cloud-future.jpg', slug: 'future-cloud-computing', content: 'Detailed content on future cloud computing trends, including AI integration and scalability...' },
    { id: 6, title: 'ERP Implementation Guide', category: 'ERP', date: 'Aug 19, 2025', excerpt: 'A step-by-step guide to successfully implementing an ERP system.', image: '/blogs/erp-implementation.jpg', slug: 'erp-implementation-guide', content: 'Detailed content on ERP implementation steps, including planning and execution...' },
    { id: 7, title: 'BDM Tools Overview', category: 'BDM', date: 'Aug 21, 2025', excerpt: 'Overview of the best tools for effective business development.', image: '/blogs/bdm-tools.jpg', slug: 'bdm-tools-overview', content: 'Detailed content on BDM tools, including CRM software and analytics platforms...' },
    { id: 8, title: 'Payroll Compliance Tips', category: 'Payroll', date: 'Aug 18, 2025', excerpt: 'Essential tips to ensure payroll compliance in 2025.', image: '/blogs/payroll-compliance.jpg', slug: 'payroll-compliance-tips', content: 'Detailed content on payroll compliance tips, including legal requirements...' },
    { id: 9, title: 'Cloud Migration Strategies', category: 'Cloud Services', date: 'Aug 17, 2025', excerpt: 'Strategies to migrate your business to the cloud effectively.', image: '/blogs/cloud-migration.jpg', slug: 'cloud-migration-strategies', content: 'Detailed content on cloud migration strategies, including hybrid approaches...' },
    { id: 10, title: 'ERP Cost Analysis', category: 'ERP', date: 'Aug 16, 2025', excerpt: 'Analyze the costs involved in deploying an ERP solution.', image: '/blogs/erp-cost.jpg', slug: 'erp-cost-analysis', content: 'Detailed content on ERP cost analysis, including ROI calculations...' },
  ];

  export async function getStaticPaths() {
    const paths = blogPosts.map((post) => ({
      params: { slug: post.slug },
    }));
    return { paths, fallback: false }; // `false` means non-predefined paths return 404
  }

  export async function getStaticProps({ params }) {
    const post = blogPosts.find((p) => p.slug === params.slug) || null;
    return { props: { post } };
  }

  export default function BlogPost({ post }) {
    if (!post) {
      return <div className="min-h-screen bg-gray-900 text-white p-6 text-center">Blog post not found.</div>;
    }

    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-4xl mx-auto">
          <Image
            src={post.image}
            alt={post.title}
            width={800}
            height={400}
            className="rounded-lg object-cover w-full"
          />
          <h1 className="text-4xl font-bold mt-6 mb-4">{post.title}</h1>
          <p className="text-teal-400 text-sm mb-4">{post.date} | {post.category}</p>
          <p className="text-gray-300 mb-6">{post.content}</p>
          <Link href="/blog" className="text-teal-500 hover:underline">
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }