import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, [page, search, category]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/posts?page=${page}&limit=10&search=${search}&category=${category}`);
      setPosts(res.data.posts);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchPosts();
  };

  return (
    <div className="container">
      <div className="filter-bar">
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', flex: 2 }}>
          <input
            type="text"
            placeholder="Search posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="btn">Search</button>
        </form>
        <select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }} className="category-select">
          <option value="all">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {loading ? <p>Loading...</p> : (
        <>
          {posts.map(post => (
            <div key={post._id} className="card">
              <h2 className="post-title">
                <Link to={`/post/${post.slug}`}>{post.title}</Link>
              </h2>
              <div className="post-meta">
                {new Date(post.date).toLocaleDateString()} | {post.category} | Views: {post.views}
              </div>
              <p className="post-description">{post.description.substring(0, 150)}...</p>
            </div>
          ))}
        </>
      )}

      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
        <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1} className="btn">Prev</button>
        <span>Page {page} of {totalPages}</span>
        <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page === totalPages} className="btn">Next</button>
      </div>
    </div>
  );
};

export default Home;
