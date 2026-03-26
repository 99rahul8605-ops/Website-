import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

const PostDetail = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await api.get(`/posts/${slug}`);
        setPost(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  if (loading) return <div className="container">Loading...</div>;
  if (!post) return <div className="container">Post not found</div>;

  return (
    <div className="container">
      <div className="card">
        <h1>{post.title}</h1>
        <div className="post-meta">
          {new Date(post.date).toLocaleDateString()} | {post.category} | Views: {post.views}
        </div>
        <p style={{ marginTop: '1rem' }}>{post.description}</p>

        {post.pdfUrl && (
          <p><a href={post.pdfUrl} target="_blank" rel="noopener noreferrer">Download PDF</a></p>
        )}
        {post.linkUrl && (
          <p><a href={post.linkUrl} target="_blank" rel="noopener noreferrer">External Link</a></p>
        )}
      </div>
    </div>
  );
};

export default PostDetail;
