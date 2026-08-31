import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../axiosConfig';

function ReportQueue() {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState('');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await axios.get('/reports');
      setReports(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load reports');
    }
  };

  const handleDelete = async (postId, reportId) => {
    if (!window.confirm('Are you sure you want to delete this Rustle/Thicket post?')) return;
    try {
      await axios.delete(`/posts/${postId}`);
      alert('Post deleted.');
      fetchReports();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete post');
    }
  };

  if (!user || (user.role !== 'moderator' && user.role !== 'admin')) {
    return (
      <div style={{ textAlign: 'center', marginTop: 80, fontFamily: 'sans-serif' }}>
        <p>You do not have permission to view this page.</p>
        <Link to="/">Back to home</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h2>Moderator Report Queue</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {reports.length === 0 ? (
        <p>No pending reports.</p>
      ) : (
        reports.map((r) => (
          <div key={r._id} style={{ border: '1px solid #ddd', padding: 12, marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong>{r.post?.title || '(post removed)'}</strong>
              <br />
              <small>Reason: {r.reason} · Reported by {r.reportedBy?.nickname}</small>
            </div>
            <button onClick={() => handleDelete(r.post?._id, r._id)}>Delete</button>
          </div>
        ))
      )}
      <p><Link to="/">Back to home</Link></p>
    </div>
  );
}

export default ReportQueue;