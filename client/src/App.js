import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import PostDetail from './pages/PostDetail';
import Login from './pages/Admin/Login';
import Dashboard from './pages/Admin/Dashboard';
import AddEditPost from './pages/Admin/AddEditPost';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <header>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1><Link to="/" style={{ color: '#fff' }}>CA Students Hub</Link></h1>
          <Link to="/admin/login" style={{ color: '#fff' }}>Admin</Link>
        </div>
      </header>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/post/:slug" element={<PostDetail />} />
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/add" element={<AddEditPost />} />
        <Route path="/admin/edit/:id" element={<AddEditPost />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
