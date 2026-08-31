import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../axiosConfig';
import { theme } from '../theme';
import memberMonster from '../pic/member-monster.png';
import approvedBadge from '../pic/approved_1.png';
import { SortDropdown, THICKET_COLORS, mockJoinedThickets } from './ThicketBoard';
import DeleteConfirmModal from './DeleteConfirmModal';

const sidebarButtonStyle = {
  width: '100%',
  textAlign: 'left',
  padding: '10px 14px',
  borderRadius: 10,
  border: 'none',
  backgroundColor: '#fff',
  fontWeight: 700,
  fontSize: 14,
  cursor: 'pointer',
  marginBottom: 10,
  display: 'block'
};

const REASON_COLORS = { Spam: '#E24C4C', Harassment: '#B968C7', Other: '#5FA83C' };

function ReportQueue() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('New');
  const [pendingDelete, setPendingDelete] = useState(null); 

  const user = (() => {
    try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
  })();
  const isAuthorized = !!user && (user.role === 'moderator' || user.role === 'admin');

  useEffect(() => {
    if (isAuthorized) fetchReports();
    
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/reports');
      // post delete, then return null
      setReports(res.data.filter((r) => r.post));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`/posts/${pendingDelete.postId}`);
      setReports((prev) => prev.filter((r) => r._id !== pendingDelete.reportId));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete post');
      throw err; // DeleteConfirmModal do not show is deleted window
    }
  };

  // No authorized granted
  if (!isAuthorized) {
    return (
      <div style={{
        minHeight: '100vh', backgroundColor: theme.formBg, fontFamily: 'sans-serif',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
      }}>
        <p style={{ fontSize: 16, marginBottom: 12 }}>You do not have permission to view this page.</p>
        <Link to="/" style={{ color: theme.linkPurple, fontWeight: 700 }}>Back to home</Link>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: theme.formBg, fontFamily: 'sans-serif' }}>
      {/* Nav bar */}
      <div style={{
        backgroundColor: theme.panelBg, padding: '16px 30px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div
          onClick={() => navigate('/')}
          style={{ fontSize: 22, fontWeight: 800, cursor: 'pointer' }}
        >
          Rustle Rustle.
        </div>
        <input
          type="text" placeholder="Search"
          style={{ width: 340, padding: '10px 16px', borderRadius: 20, border: 'none', backgroundColor: '#F1F1E8' }}
        />
        <div style={{ position: 'relative' }}>
          <img src={user?.avatar || memberMonster} alt="me" style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: theme.panelBg }}
            onError={(e) => { e.currentTarget.src = memberMonster; }} />
          <img src={approvedBadge} alt="approved" style={{ width: 16, height: 16, position: 'absolute', top: -5, right: -5 }}
            onError={(e) => { e.currentTarget.style.display = 'none'; }} />
        </div>
      </div>

      <div style={{ display: 'flex' }}>
        {/* Left side function list */}
        <div style={{ width: 240, backgroundColor: theme.panelBg, padding: 20, minHeight: 'calc(100vh - 76px)', boxSizing: 'border-box' }}>
          <button style={sidebarButtonStyle}>Notifications</button>
          <button style={sidebarButtonStyle}>Create a Thicket +</button>
          <button style={sidebarButtonStyle}>Big Thicket</button>
          <button style={sidebarButtonStyle}>Explore</button>
          <button style={{ ...sidebarButtonStyle, backgroundColor: '#c9ceac' }}>Moderator model</button>

          <p style={{ fontWeight: 700, fontSize: 13, margin: '20px 0 10px' }}>Thicket you in &gt;</p>
          {mockJoinedThickets.map((name, i) => (
            <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 4px', fontSize: 13, fontWeight: 600 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: THICKET_COLORS[i % THICKET_COLORS.length] }} />
              {name}
            </div>
          ))}
        </div>

        {/* Report Queue */}
        <div style={{ flex: 1, padding: '30px 36px' }}>
          <h2 style={{ marginTop: 0, marginBottom: 6 }}>Moderator model - Report Context</h2>
          <div style={{ marginBottom: 18 }}>
            <SortDropdown value={sort} onChange={setSort} />
          </div>

          {error && <p style={{ color: theme.errorRed }}>{error}</p>}
          {loading && <p>Loading...</p>}
          {!loading && reports.length === 0 && !error && (
            <p style={{ color: '#666' }}>No pending reports right now.</p>
          )}

          {reports.map((r) => (
            <div key={r._id} style={{
              backgroundColor: '#C9CE84',
              borderRadius: 16,
              padding: '14px 18px',
              marginBottom: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 16
            }}>
              <div style={{ flexShrink: 0 }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, backgroundColor: REASON_COLORS[r.reason] || '#999' }} />
                <span style={{ fontSize: 10, color: '#555' }}>
                  {new Date(r.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div style={{
                flex: 1, fontWeight: 700, fontSize: 15,
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
              }}>
                {r.post?.title || '(post removed)'}
              </div>

              <div style={{
                padding: '10px 26px', borderRadius: 10, backgroundColor: '#fff',
                fontWeight: 700, fontSize: 15, flexShrink: 0
              }}>
                {r.reason}
              </div>

              <button
                onClick={() => setPendingDelete({ postId: r.post?._id, reportId: r._id })}
                disabled={!r.post}
                style={{
                  padding: '10px 22px', borderRadius: 10, border: 'none',
                  backgroundColor: '#ddd', fontWeight: 700, fontSize: 14,
                  cursor: r.post ? 'pointer' : 'not-allowed', flexShrink: 0
                }}
              >
                delete
              </button>
            </div>
          ))}
        </div>
      </div>

      {pendingDelete && (
        <DeleteConfirmModal
          onConfirm={handleConfirmDelete}
          onClose={() => setPendingDelete(null)}
        />
      )}
    </div>
  );
}

export default ReportQueue;
