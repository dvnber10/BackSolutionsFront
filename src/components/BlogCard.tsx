import { type BlogPost } from "../types/types";

interface BlogCardProps {
  post: BlogPost;
}

const BlogCard = ({ post }: BlogCardProps) => (
  <article className="blog-card">
    <img src={post.imageUrl} alt={post.title} className="blog-card-image" />
    <div className="blog-card-content">
      <div className="blog-card-tags">
        {post.tags.map(tag => (
          <span key={tag} className="blog-card-tag">{tag}</span>
        ))}
      </div>
      <h3 className="blog-card-title">{post.title}</h3>
      <p className="blog-card-summary">{post.summary}</p>
      <div className="blog-card-footer">
        <span className="blog-card-author">{post.author}</span>
        <span className="blog-card-date">{new Date(post.date).toLocaleDateString()}</span>
      </div>
    </div>
  </article>
);

export default BlogCard;
