import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from '../axiosConfig';
import { theme } from '../theme';
import memberMonster from '../pic/member-monster.png';
import approvedBadge from '../pic/approved_1.png';
import ReportModal from './ReportModal';
import { DEMO_BOARD_DESCRIPTION, DEMO_POSTS } from '../demoData';

// For demo thicket name
const mockJoinedThickets = ['Thicket_1', 'Thicket_2', 'Thicket_3', 'Thicket_4', 'Thicket_5'];
const THICKET_COLORS = ['#4FC3B0', '#F58EA6', '#5BC0DE', '#E24C4C', '#F0A868'];

// Post time style "Nmo/d/h ago"
function timeAgo(dateStr) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 60) return `${Math.max(mins, 0)}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

const SORT_OPTIONS = ['New', 'Best', 'Rating', 'Top'];


function SortDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          border: 'none', backgroundColor: 'transparent', fontWeight: 700,
          fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4
        }}
      >
        {value} <span style={{ fontSize: 10 }}>▾</span>
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: 24, left: 0, backgroundColor: '#fff',
          borderRadius: 8, boxShadow: '0 4px 14px rgba(0,0,0,0.15)', zIndex: 20, minWidth: 100
        }}>
          {SORT_OPTIONS.map((opt) => (
            <div
              key={opt}
              onClick={() => { onChange(opt); setOpen(false); }}
              style={{
                padding: '8px 14px', fontSize: 13, cursor: 'pointer',
                backgroundColor: opt === value ? '#f0f0f0' : 'transparent'
              }}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


function MoreMenu({ onReport }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 16, fontWeight: 700 }}
      >
        ...
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: 22, right: 0, backgroundColor: '#fff',
          borderRadius: 8, boxShadow: '0 4px 14px rgba(0,0,0,0.15)', zIndex: 20, minWidth: 110
        }}>
          <div
            onClick={() => { onReport && onReport(); setOpen(false); }}
            style={{ padding: '8px 14px', fontSize: 13, cursor: 'pointer' }}
          >
            Report
          </div>
          <div style={{ padding: '8px 14px', fontSize: 13, cursor: 'pointer' }}>
            Mute
          </div>
        </div>
      )}
    </div>
  );
}

const pillButtonStyle = {
  padding: '9px 18px',
  borderRadius: 20,
  border: 'none',
  backgroundColor: '#fff',
  fontWeight: 700,
  fontSize: 13,
  cursor: 'pointer'
};

function ThicketBoard() {
  const { thicketName } = useParams();
  const navigate = useNavigate();
  const storedUser = (() => {
    try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
  })();
  const [joined, setJoined] = useState(false);
  const [sort, setSort] = useState('New');
  const [reportPostId, setReportPostId] = useState(null); 
  const [board, setBoard] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isDemo, setIsDemo] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const displayName = thicketName || 'Thicket_name';

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        
        const boardsRes = await axios.get('/boards');
        const matchedBoard = boardsRes.data.find((b) => b.name === thicketName);

        if (matchedBoard) {
          setBoard(matchedBoard);
          setIsDemo(false);
          const postsRes = await axios.get('/posts');
          const boardPosts = postsRes.data.filter((p) => (p.board?._id || p.board) === matchedBoard._id);
          setPosts(boardPosts);
        } else {
          
          setBoard({ name: thicketName, description: DEMO_BOARD_DESCRIPTION });
          setIsDemo(true);
          setPosts(DEMO_POSTS);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load Thicket.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [thicketName]);

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
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ position: 'relative' }}>
            <img src={storedUser?.avatar || memberMonster} alt="me" style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: theme.panelBg }}
              onError={(e) => { e.currentTarget.src = memberMonster; }} />
            <img src={approvedBadge} alt="approved" style={{ width: 16, height: 16, position: 'absolute', top: -5, right: -5 }}
              onError={(e) => { e.currentTarget.style.display = 'none'; }} />
          </div>
        </div>
      </div>

      <div style={{ display: 'flex' }}>
        {/* Left side fuciton list */}
        <div style={{ width: 240, backgroundColor: theme.panelBg, padding: 20, minHeight: 'calc(100vh - 76px)', boxSizing: 'border-box' }}>
          <button style={{ ...pillButtonStyle, width: '100%', textAlign: 'left', display: 'block', marginBottom: 10 }}>Notifications</button>
          <button style={{ ...pillButtonStyle, width: '100%', textAlign: 'left', display: 'block', marginBottom: 10 }}>Create a Thicket +</button>
          <button style={{ ...pillButtonStyle, width: '100%', textAlign: 'left', display: 'block', marginBottom: 10 }}>Big Thicket</button>
          <button style={{ ...pillButtonStyle, width: '100%', textAlign: 'left', display: 'block', marginBottom: 10 }}>Explore</button>
          <p style={{ fontWeight: 700, fontSize: 13, margin: '20px 0 10px' }}>Thicket you in &gt;</p>
          {mockJoinedThickets.map((name, i) => (
            <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 4px', fontSize: 13, fontWeight: 600 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: THICKET_COLORS[i % THICKET_COLORS.length] }} />
              {name}
            </div>
          ))}
        </div>

        {/* Main content area */}
        <div style={{ flex: 1 }}>
          {/* Banner com. */}
          <div style={{ height: 140, backgroundColor: theme.boardHeader }} />

          <div style={{ padding: '0 36px 36px' }}>
            {/* Board info. */}
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: -50 }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 18 }}>
                <div style={{
                  width: 90, height: 90, borderRadius: '50%', backgroundColor: '#2b2b2b',
                  border: '4px solid ' + theme.formBg
                }} />
                <h1 style={{ margin: 0, marginBottom: 6 }}>{displayName}</h1>
              </div>
              <div style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
                <button style={pillButtonStyle} onClick={() => navigate(`/thickets/${displayName}/new-post`)}>
                  + Make a Rustle
                </button>
                <button style={pillButtonStyle}>Community guide</button>
                {!joined && (
                  <button style={{ ...pillButtonStyle, backgroundColor: theme.inputBg, color: '#fff' }} onClick={() => setJoined(true)}>
                    Join
                  </button>
                )}
              </div>
            </div>

            <p style={{ maxWidth: 800, color: '#333', marginTop: 20 }}>
              {board?.description || 'This discussion board is a place for students to share ideas, ask questions, and discuss topics related to the course.'}
            </p>

            {isDemo && (
              <p style={{ fontSize: 12, color: '#8a8a6a', fontStyle: 'italic' }}>
                Demo preview — "{displayName}" hasn't been created yet, showing sample content.
              </p>
            )}

            {error && <p style={{ color: theme.errorRed }}>{error}</p>}

            <div style={{ marginTop: 16, marginBottom: 12 }}>
              <SortDropdown value={sort} onChange={setSort} />
            </div>

            {loading && <p>Loading...</p>}
            {!loading && board && posts.length === 0 && (
              <p style={{ color: '#666' }}>No Rustles here yet. Be the first to start a discussion!</p>
            )}

            {/* Post list */}
            {posts.map((post) => (
              <div key={post._id} style={{
                backgroundColor: '#C9CE84', borderRadius: 14, padding: 20, marginBottom: 20
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: '#B968C7', flexShrink: 0 }} />
                    <div>
                      <span style={{ fontSize: 12, color: '#555' }}>{timeAgo(post.createdAt)}</span>
                      <h3 style={{ margin: '4px 0 8px 0', cursor: 'pointer' }} onClick={() => navigate(`/thickets/${displayName}/posts/${post._id}`)}>
                        {post.title}
                      </h3>
                    </div>
                  </div>
                  <MoreMenu onReport={() => setReportPostId(post._id)} />
                </div>

                <p style={{ whiteSpace: 'pre-line', color: '#222', fontSize: 14, margin: '0 0 14px 52px' }}>
                  {post.content}
                </p>

                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => navigate(`/thickets/${displayName}/posts/${post._id}`)}
                    style={{ ...pillButtonStyle, display: 'flex', alignItems: 'center', gap: 6 }}
                  >
                    💬
                  </button>
                  <button style={pillButtonStyle}>Share</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {reportPostId && (
        <ReportModal
          postId={reportPostId}
          onClose={() => setReportPostId(null)}
        />
      )}
    </div>
  );
}

export default ThicketBoard;
export { SortDropdown, MoreMenu, pillButtonStyle, THICKET_COLORS, mockJoinedThickets };
