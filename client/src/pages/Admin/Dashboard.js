import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await api.get('/admin/posts');
        setPosts(res.data);
      } catch (err) {
        if (err.response?.status === 401) navigate('/admin/login');
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [navigate]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await api.delete(`/admin/posts/${id}`);
      setPosts(posts.filter(p => p._id !== id));
    } catch (err) {
      console.error(err);
      alert('Delete failed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin/login');
  };

  if (loading) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1>Admin Dashboard</h1>
        <div>
          <Link to="/admin/add" className="btn" style={{ marginRight: '1rem' }}>Add New Post</Link>
          <button onClick={handleLogout} className="btn">Logout</button>
        </div>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
        <thead>
          <tr style={{ background: '#c0392b', color: '#fff' }}>
            <th style={{ padding: '0.5rem' }}>Title</th>
            <th>Category</th>
            <th>Date</th>
            <th>Actions</th>
           </tr>
        </thead>
        <tbody>
          {posts.map(post => (
            <tr key={post._id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '0.5rem' }}>{post.title}</td>
              <td>{post.category}</td>
              <td>{new Date(post.date).toLocaleDateString()}</td>
              <td>
                <Link to={`/admin/edit/${post._id}`} style={{ marginRight: '0.5rem' }}>Edit</Link>
                <button onClick={() => handleDelete(post._id)} style={{ background: 'none', border: 'none', color: '#c0392b', cursor: 'pointer' }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
