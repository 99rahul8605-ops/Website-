import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const AddEditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Latest ICAI Updates',
    pdfUrl: '',
    linkUrl: ''
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchPost = async () => {
        try {
          // Use public endpoint (increments views, but that's fine)
          const res = await api.get(`/posts/${id}`);
          setForm({
            title: res.data.title,
            description: res.data.description,
            category: res.data.category,
            pdfUrl: res.data.pdfUrl || '',
            linkUrl: res.data.linkUrl || ''
          });
        } catch (err) {
          console.error(err);
          navigate('/admin/dashboard');
        }
      };
      fetchPost();
    }
  }, [id, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('pdf', file);
    setUploading(true);
    try {
      const res = await api.post('/admin/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setForm({ ...form, pdfUrl: res.data.fileUrl });
    } catch (err) {
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (id) {
        await api.put(`/admin/posts/${id}`, form);
      } else {
        await api.post('/admin/posts', form);
      }
      navigate('/admin/dashboard');
    } catch (err) {
      alert(err.response?.data?.msg || 'Error saving post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '800px', marginTop: '2rem' }}>
      <div className="card">
        <h2>{id ? 'Edit Post' : 'Add New Post'}</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label>Title</label>
            <input type="text" name="title" value={form.title} onChange={handleChange} className="search-input" style={{ width: '100%' }} required />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows="5" className="search-input" style={{ width: '100%' }} required></textarea>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label>Category</label>
            <select name="category" value={form.category} onChange={handleChange} className="category-select" style={{ width: '100%' }}>
              <option>Latest ICAI Updates</option>
              <option>CA Results</option>
              <option>Admit Card / Exam Form</option>
              <option>Suggested Answers</option>
              <option>Study Material</option>
            </select>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label>PDF Upload (optional)</label>
            <input type="file" accept="application/pdf" onChange={handleFileUpload} />
            {uploading && <p>Uploading...</p>}
            {form.pdfUrl && <p>Current PDF: <a href={form.pdfUrl} target="_blank" rel="noopener noreferrer">View</a></p>}
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label>External Link (optional)</label>
            <input type="url" name="linkUrl" value={form.linkUrl} onChange={handleChange} className="search-input" style={{ width: '100%' }} />
          </div>
          <button type="submit" className="btn" disabled={loading}>{loading ? 'Saving...' : 'Save Post'}</button>
        </form>
      </div>
    </div>
  );
};

export default AddEditPost;
