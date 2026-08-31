import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../axiosConfig';
import { theme } from '../theme';

// 怪獸圖片（依照 Big Thicket 3 張 + Recommended 6 張的順序對應 home-monster1~9）
import monster1 from '../pic/home-monster1.png';
import monster2 from '../pic/home-monster2.png';
import monster3 from '../pic/home-monster3.png';
import monster4 from '../pic/home-monster4.png';
import monster5 from '../pic/home-monster5.png';
import monster6 from '../pic/home-monster6.png';
import monster7 from '../pic/home-monster7.png';
import monster8 from '../pic/home-monster8.png';
import monster9 from '../pic/home-monster9.png';
import memberMonster from '../pic/member-monster.png';
import approvedBadge from '../pic/approved_1.png';

const MONSTERS = [monster1, monster2, monster3, monster4, monster5, monster6, monster7, monster8, monster9];

// ---- 假資料：現有加入 / 熱門討論區 ----
const COMMUNITY_COLORS = ['#4FC3B0', '#F58EA6', '#5BC0DE', '#E24C4C', '#F0A868'];
const mockCommunities = ['Thicket_1', 'Thicket_2', 'Thicket_3', 'Thicket_4', 'Thicket_5'].map((name, i) => ({
  name,
  color: COMMUNITY_COLORS[i % COMMUNITY_COLORS.length],
  hasNotice: i < 4
}));

// ---- 假資料：Big Thicket（6 篇，輪播每次顯示 3 篇）----
const bigThicketPosts = Array.from({ length: 6 }).map((_, i) => ({
  id: `bt-${i}`,
  name: `Thicket_${(i % 5) + 1}`,
  time: '2mo ago',
  monster: MONSTERS[i % MONSTERS.length]
}));

// ---- 假資料：Recommended for you（固定 6 篇）----
const recommendedPosts = Array.from({ length: 6 }).map((_, i) => ({
  id: `rec-${i}`,
  name: `Thicket_${(i % 5) + 1}`,
  time: '2mo ago',
  monster: MONSTERS[(i + 3) % MONSTERS.length]
}));

// ---- 小草叢裝飾（純 CSS 圖形，不需額外圖檔）----
function GrassTuft({ style }) {
  return (
    <div style={{ position: 'absolute', bottom: 0, display: 'flex', gap: 2, ...style }}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            width: 0,
            height: 0,
            borderLeft: '6px solid transparent',
            borderRight: '6px solid transparent',
            borderBottom: `${18 + (i % 2) * 8}px solid #5FA83C`,
            transform: i === 1 ? 'translateY(-4px)' : 'none'
          }}
        />
      ))}
    </div>
  );
}

// ---- Post Card ----
function PostCard({ post, joined, onJoin }) {
  const navigate = useNavigate();
  return (
    <div style={{
      backgroundColor: '#9CB563',
      borderRadius: 14,
      overflow: 'hidden',
      position: 'relative',
      minWidth: 0
    }}>
      {/* 頂部半透明資訊列 */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 12px',
        backgroundColor: 'rgba(0,0,0,0.28)'
      }}>
        <span
          onClick={() => navigate(`/thickets/${post.name}`)}
          style={{ color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}
        >
          {post.name} <span style={{ fontWeight: 400, opacity: 0.85 }}>· {post.time}</span>
        </span>
        {/* 管理員小怪獸頭像（暫用純色圓形佔位） */}
        <div style={{
          width: 26,
          height: 26,
          borderRadius: '50%',
          backgroundColor: '#1a1a1a',
          flexShrink: 0
        }} />
      </div>

      {/* 內容區：怪獸 + 草叢 + 地板 */}
      <div style={{ position: 'relative', height: 130, padding: '16px 0 0 16px' }}>
        <div style={{ position: 'relative', width: 60, height: 60 }}>
          <img
            src={post.monster}
            alt={post.name}
            style={{ width: 60, height: 60, borderRadius: 10, position: 'relative', zIndex: 1 }}
            onError={(e) => { e.currentTarget.style.outline = '2px dashed red'; }}
          />
          <GrassTuft style={{ left: -6, bottom: -6, zIndex: 2 }} />
        </div>

        {/* 地板 */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: 20,
          backgroundColor: theme.floor
        }} />

        {/* Join 按鈕 */}
        <button
          onClick={() => onJoin(post.id)}
          style={{
            position: 'absolute',
            right: 14,
            bottom: 8,
            padding: '8px 18px',
            borderRadius: 20,
            border: 'none',
            backgroundColor: '#fff',
            fontWeight: 700,
            fontSize: 13,
            cursor: 'pointer',
            zIndex: 3
          }}
        >
          {joined ? 'Joined' : 'Join'}
        </button>
      </div>
    </div>
  );
}

// ---- Big Thicket 輪播（6 篇，每次顯示 3 篇，自動向左滑動）----
function BigThicketCarousel({ posts, joinedMap, onJoin }) {
  const [page, setPage] = useState(0); // 0 = 前3篇, 1 = 後3篇
  const totalPages = Math.ceil(posts.length / 3);

  useEffect(() => {
    const timer = setInterval(() => {
      setPage((p) => (p + 1) % totalPages);
    }, 4000);
    return () => clearInterval(timer);
  }, [totalPages]);

  return (
    <div style={{ overflow: 'hidden' }}>
      <div style={{
        display: 'flex',
        width: `${totalPages * 100}%`,
        transform: `translateX(-${page * (100 / totalPages)}%)`,
        transition: 'transform 0.6s ease'
      }}>
        {Array.from({ length: totalPages }).map((_, pageIndex) => (
          <div
            key={pageIndex}
            style={{
              width: `${100 / totalPages}%`,
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 20,
              boxSizing: 'border-box',
              paddingRight: 20
            }}
          >
            {posts.slice(pageIndex * 3, pageIndex * 3 + 3).map((post) => (
              <PostCard key={post.id} post={post} joined={!!joinedMap[post.id]} onJoin={onJoin} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ---- 左側社群小圓圈 ----
function CommunityDot({ color }) {
  return (
    <div style={{
      width: 32,
      height: 32,
      borderRadius: '50%',
      backgroundColor: color,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 14,
      flexShrink: 0
    }}>
      🌿
    </div>
  );
}

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
  marginBottom: 10
};

function Home() {
  const navigate = useNavigate();
  const [joinedMap, setJoinedMap] = useState({});
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // 登入狀態：沿用 Login.jsx 存 localStorage 的方式
  const storedUser = (() => {
    try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
  })();
  const isLoggedIn = !!localStorage.getItem('token') && !!storedUser;
  const [myThickets, setMyThickets] = useState([]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isLoggedIn || !storedUser) return;
    const loadMyThickets = async () => {
      try {
        const res = await axios.get('/boards');
        setMyThickets(res.data.filter((b) => b.moderator?._id === storedUser._id));
      } catch (err) {
        console.error('Failed to load your Thickets:', err);
      }
    };
    loadMyThickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  const handleJoin = (postId) => {
    setJoinedMap((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setMenuOpen(false);
    navigate('/');
    window.location.reload();
  };

  const handleCreateThicket = () => {
    navigate('/create-board');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: theme.formBg, fontFamily: 'sans-serif' }}>
      {/* ---------- Nav Bar ---------- */}
      <div style={{
        backgroundColor: theme.panelBg,
        padding: '16px 30px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative'
      }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: '#000' }}>Rustle Rustle.</div>

        <input
          type="text"
          placeholder="Search"
          style={{
            width: 340,
            padding: '10px 16px',
            borderRadius: 20,
            border: 'none',
            outline: 'none',
            backgroundColor: '#F1F1E8'
          }}
        />

        {!isLoggedIn ? (
          <div style={{ display: 'flex', gap: 10 }}>
            <Link to="/register" style={{
              padding: '9px 22px', borderRadius: 20, backgroundColor: '#fff',
              fontWeight: 700, fontSize: 14, textDecoration: 'none', color: '#000'
            }}>
              Register
            </Link>
            <Link to="/login" style={{
              padding: '9px 22px', borderRadius: 20, backgroundColor: '#fff',
              fontWeight: 700, fontSize: 14, textDecoration: 'none', color: '#000'
            }}>
              Login
            </Link>
          </div>
        ) : (
          <div ref={menuRef} style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ position: 'relative' }}>
              <img
                src={memberMonster}
                alt="me"
                onClick={() => setMenuOpen((v) => !v)}
                style={{ width: 44, height: 44, borderRadius: 10, cursor: 'pointer' }}
                onError={(e) => { e.currentTarget.style.outline = '2px dashed red'; }}
              />
              <img
                src={approvedBadge}
                alt="approved"
                style={{ width: 18, height: 18, position: 'absolute', top: -6, right: -6 }}
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            </div>

            {menuOpen && (
              <div style={{
                position: 'absolute',
                top: 54,
                right: 0,
                backgroundColor: '#fff',
                borderRadius: 12,
                boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
                padding: 10,
                width: 180,
                zIndex: 50
              }}>
                {[
                  { label: 'View Profile', action: () => {} },
                  { label: 'Edit Avatar', action: () => {} },
                  { label: 'Log Out', action: handleLogout },
                  { label: 'Settings', action: () => {} }
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={item.action}
                    style={{
                      display: 'block',
                      width: '100%',
                      textAlign: 'left',
                      padding: '10px 8px',
                      border: 'none',
                      background: 'none',
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: 'pointer',
                      borderRadius: 8
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f2f2f2')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ---------- 主體：側欄 + 內容 ---------- */}
      <div style={{ display: 'flex' }}>
        {/* 左側功能列 */}
        <div style={{
          width: 240,
          backgroundColor: theme.panelBg,
          padding: 20,
          minHeight: 'calc(100vh - 76px)',
          boxSizing: 'border-box'
        }}>
          {!isLoggedIn ? (
            <>
              <button style={sidebarButtonStyle}>Explore</button>
              <p style={{ fontWeight: 700, fontSize: 13, margin: '20px 0 10px' }}>Big Thicket &gt;</p>
            </>
          ) : (
            <>
              <button style={sidebarButtonStyle}>Notifications</button>
              <button style={sidebarButtonStyle} onClick={handleCreateThicket}>Create a Thicket +</button>
              <button style={sidebarButtonStyle}>Big Thicket</button>
              <button style={sidebarButtonStyle}>Explore</button>

              {myThickets.length > 0 && (
                <>
                  <p style={{ fontWeight: 700, fontSize: 13, margin: '20px 0 10px' }}>My Thickets &gt;</p>
                  {myThickets.map((b, i) => (
                    <div
                      key={b._id}
                      onClick={() => navigate(`/thickets/${b.name}`)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '6px 4px', fontSize: 13, fontWeight: 600, cursor: 'pointer'
                      }}
                    >
                      <CommunityDot color={COMMUNITY_COLORS[i % COMMUNITY_COLORS.length]} />
                      {b.name}
                    </div>
                  ))}
                </>
              )}

              <p style={{ fontWeight: 700, fontSize: 13, margin: '20px 0 10px' }}>Thicket you in &gt;</p>
            </>
          )}

          {mockCommunities.map((c) => (
            <div
              key={c.name}
              onClick={() => navigate(`/thickets/${c.name}`)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '6px 4px', fontSize: 13, fontWeight: 600, position: 'relative',
                cursor: 'pointer'
              }}
            >
              <CommunityDot color={c.color} />
              {c.name}
              {isLoggedIn && c.hasNotice && (
                <span style={{
                  width: 6, height: 6, borderRadius: '50%',
                  backgroundColor: '#E24C4C', marginLeft: 4
                }} />
              )}
            </div>
          ))}

          {!isLoggedIn && (
            <button style={{ ...sidebarButtonStyle, marginTop: 10, backgroundColor: '#eee' }}>
              See more
            </button>
          )}
        </div>

        {/* 內容區 */}
        <div style={{ flex: 1, padding: '30px 36px', backgroundColor: theme.formBg }}>
          <h2 style={{ marginTop: 0, marginBottom: 16 }}>Big Thicket</h2>
          <BigThicketCarousel posts={bigThicketPosts} joinedMap={joinedMap} onJoin={handleJoin} />

          <h2 style={{ marginTop: 36, marginBottom: 16 }}>Recommended for you</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 20
          }}>
            {recommendedPosts.map((post) => (
              <PostCard key={post.id} post={post} joined={!!joinedMap[post.id]} onJoin={handleJoin} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
