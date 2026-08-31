import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../axiosConfig';

function Home() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [formError, setFormError] = useState('');
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get('/posts');
      setPosts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!title || !content) {
      setFormError('Title and content are required');
      return;
    }
    try {
      await axios.post('/posts', { title, content });
      setTitle('');
      setContent('');
      fetchPosts();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to create post');
    }
  };

  const handleReport = async (postId) => {
    const reason = window.prompt('Reason for reporting (Spam / Harassment / Other):', 'Spam');
    if (!reason) return;
    try {
        await axios.post('/reports', { postId, reason });
        alert('Report submitted. Our moderators will review it.');
    } catch (err) {
        alert(err.response?.data?.message || 'Failed to submit report');
    }
    };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) {
    return (
      <div style={{ textAlign: 'center', marginTop: 80, fontFamily: 'sans-serif' }}>
        <p>Please login to see the discussions.</p>
        <Link to="/login">Login</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Rustle Rustle</h2>
        <div>
          <span style={{ marginRight: 10 }}>
            {user.nickname} [{user.role}]
          </span>
          <Link to="/create-board" style={{ marginRight: 10 }}>+ Create a Thicket</Link>
            {(user.role === 'moderator' || user.role === 'admin') && (
                <Link to="/reports" style={{ marginRight: 10 }}>Moderator Queue</Link>
            )}
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <form onSubmit={handleCreatePost} style={{ margin: '20px 0', border: '1px solid #ccc', padding: 12 }}>
        <h3>Create a new post</h3>
        <input
          type="text"
          placeholder="Your title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: '100%', padding: 8, marginBottom: 8 }}
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{ width: '100%', padding: 8, minHeight: 80, marginBottom: 8 }}
        />
        {formError && <p style={{ color: 'red' }}>{formError}</p>}
        <button type="submit">Post</button>
      </form>

      <h3>Big Thicket</h3>
      {posts.length === 0 ? (
        <p>Sorry, no Rustles yet. Be the first to start a discussion!</p>
      ) : (
        posts.map((post) => (
            <div key={post._id} style={{ border: '1px solid #ddd', padding: 12, marginBottom: 10 }}>
            <h4>{post.title}</h4>
            <p>{post.content}</p>
            <small>by {post.author?.nickname || 'Unknown'} · {post.category}</small>
            <div style={{ marginTop: 8 }}>
                <button onClick={() => handleReport(post._id)}>Report</button>
            </div>
        </div>
    ))
      )}
    </div>
  );
}

export default Home;