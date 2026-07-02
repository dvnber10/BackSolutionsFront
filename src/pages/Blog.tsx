import BlogCard from '../components/BlogCard';
import { blogPosts } from '../data/blog';

const Blog = () => (
  <div className="page-shell">
    <section className="page-section text-center">
      <span className="eyebrow">Nuestro Blog</span>
      <h1 className="text-4xl font-bold tracking-tight">Ideas, Historias y Conocimiento</h1>
      <p className="mt-4 text-lg text-gray-600">
        Un espacio para explorar las últimas tendencias en tecnología, diseño de productos y estrategias de desarrollo.
      </p>
    </section>
    <section className="blog-grid">
      {blogPosts.map(post => (
        <BlogCard key={post.id} post={post} />
      ))}
    </section>
  </div>
);
export default Blog;
