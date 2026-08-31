import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from '../axiosConfig';
import { theme } from '../theme';
import memberMonster from '../pic/member-monster.png';
import approvedBadge from '../pic/approved_1.png';
import { SortDropdown, MoreMenu, pillButtonStyle, THICKET_COLORS, mockJoinedThickets } from './ThicketBoard';
import ReportModal from './ReportModal';
import { DEMO_POSTS, mockComments } from '../demoData';

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

function CommentItem({ comment, level = 0, onReport }) {
  const [showReplies, setShowReplies] = useState(false);

  return (
    <div style={{ marginLeft: level * 52, marginTop: 16 }}>
      <div style={{ display: 'flex', gap: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: THICKET_COLORS[level % THICKET_COLORS.length], flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: 12, color: '#555' }}>{comment.time}</span>
          <p style={{ margin: '4px 0 8px 0', fontSize: 14, color: '#222' }}>{comment.text}</p>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button style={{ ...pillButtonStyle, padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 6 }}>
              💬 {comment.commentCount || ''}
            </button>
            <button style={{ ...pillButtonStyle, padding: '6px 14px' }}>Share</button>
            <MoreMenu onReport={() => onReport(comment.id)} />
          </div>

          {comment.replies && comment.replies.map((r) => (
            <CommentItem key={r.id} comment={r} level={level + 1} onReport={onReport} />
          ))}

          {comment.moreReplies > 0 && !showReplies && (
            <div
              onClick={() => setShowReplies(true)}
              style={{ marginLeft: 52, marginTop: 10, fontSize: 12, color: '#555', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <span style={{
                width: 18, height: 18, borderRadius: '50%', border: '1px solid #999',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 12
              }}>+</span>
              {comment.moreReplies} more replies
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PostDetail() {
  const { thicketName, postId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [sort, setSort] = useState('New');
  const [searchTerm, setSearchTerm] = useState('');
  const [reportPostId, setReportPostId] = useState(null); // 目前要回報的 post id
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const displayName = thicketName || 'Thicket_name';

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        // 從 CreatePost 展示模式傳來的假貼文內容（讓 Make a Rustle 送出的標題/內容真的顯示出來）
        if (location.state?.demoPost) {
          setPost(location.state.demoPost);
          setLoading(false);
          return;
        }

        // 後端沒有「用 id 查單一 post」的 API，先抓全部 posts 再用 postId 過濾
        const res = await axios.get('/posts');
        const matched = res.data.find((p) => p._id === postId);
        if (matched) {
          setPost(matched);
        } else {
          // 找不到真實貼文（例如這是側欄假 Thicket 底下的展示貼文）—— fallback 用假資料，不擋畫面
          const demoMatch = DEMO_POSTS.find((p) => p._id === postId) || DEMO_POSTS[0];
          setPost(demoMatch);
        }
      } catch (err) {
        console.error('Failed to load post, falling back to demo content:', err);
        setPost(DEMO_POSTS[0]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [postId, location.state]);

  const handleSubmitComment = () => {
    // TODO: 串接留言送出 API（目前後端沒有 Comment model / API，這區塊仍是純前端假資料）
    setReplyText('');
    setReplyOpen(false);
  };

  // 後端 Report 只能綁定 Post，沒有留言目標欄位，所以不管是點文章還是點留言的 Report，
  // 一律回報「這篇貼文」。之後如果後端加了 Comment model 跟留言回報功能，
  // 這裡要換成傳留言自己的 id。
  const handleReport = () => {
    setReportPostId(postId);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: theme.formBg, fontFamily: 'sans-serif' }}>
      {/* Nav bar */}
      <div style={{
        backgroundColor: theme.panelBg, padding: '16px 30px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div style={{ fontSize: 22, fontWeight: 800 }}>Rustle Rustle.</div>
        <input
          type="text" placeholder="Search"
          style={{ width: 340, padding: '10px 16px', borderRadius: 20, border: 'none', backgroundColor: '#F1F1E8' }}
        />
        <div style={{ position: 'relative' }}>
          <img src={memberMonster} alt="me" style={{ width: 40, height: 40, borderRadius: 10 }}
            onError={(e) => { e.currentTarget.style.outline = '2px dashed red'; }} />
          <img src={approvedBadge} alt="approved" style={{ width: 16, height: 16, position: 'absolute', top: -5, right: -5 }}
            onError={(e) => { e.currentTarget.style.display = 'none'; }} />
        </div>
      </div>

      <div style={{ display: 'flex' }}>
        {/* 左側功能列 */}
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

        {/* 主內容：文章 + 留言 */}
        <div style={{ flex: 1, padding: '30px 36px', maxWidth: 920 }}>
          {loading && <p>Loading...</p>}

          {post && (
            <>
              {/* 文章本體 */}
              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  onClick={() => navigate(`/thickets/${displayName}`)}
                  style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 20, marginTop: 4 }}
                >
                  ←
                </button>
                <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: '#B968C7', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: 12, color: '#555' }}>{timeAgo(post.createdAt)}</span>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h2 style={{ margin: '4px 0 8px 0' }}>{post.title}</h2>
                    <MoreMenu onReport={handleReport} />
                  </div>
                  <p style={{ whiteSpace: 'pre-line', fontSize: 14, color: '#222', margin: 0 }}>{post.content}</p>

                  <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 14 }}>
                    <button style={{ ...pillButtonStyle, display: 'flex', alignItems: 'center', gap: 6 }}>
                      💬 {mockComments.length}
                    </button>
                    <button style={pillButtonStyle}>Share</button>
                  </div>
                </div>
              </div>

          {/* 回覆輸入框（可收合展開） */}
          {replyOpen ? (
            <div style={{
              marginTop: 20, border: '1px solid #ddd', borderRadius: 12, padding: 16, backgroundColor: theme.formBg
            }}>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Join the Thicket"
                rows={3}
                style={{
                  width: '100%', border: 'none', outline: 'none', resize: 'none',
                  backgroundColor: 'transparent', fontSize: 14, boxSizing: 'border-box'
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button style={{ border: '1px solid #ccc', borderRadius: 8, background: 'none', padding: '4px 8px', cursor: 'pointer' }}>🖼️</button>
                  <button style={{ border: '1px solid #ccc', borderRadius: 8, background: 'none', padding: '4px 8px', cursor: 'pointer', fontSize: 11, fontWeight: 700 }}>GIF</button>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    onClick={() => { setReplyOpen(false); setReplyText(''); }}
                    style={{ padding: '8px 20px', borderRadius: 20, border: 'none', backgroundColor: '#ddd', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitComment}
                    disabled={!replyText.trim()}
                    style={{
                      padding: '8px 20px', borderRadius: 20, border: 'none',
                      backgroundColor: theme.successClose, color: '#fff', fontWeight: 700,
                      cursor: replyText.trim() ? 'pointer' : 'not-allowed', opacity: replyText.trim() ? 1 : 0.6
                    }}
                  >
                    Comment
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setReplyOpen(true)}
              style={{
                marginTop: 20, width: '100%', textAlign: 'left', padding: '12px 16px',
                borderRadius: 12, border: '1px solid #ddd', backgroundColor: '#fff',
                color: '#999', cursor: 'pointer'
              }}
            >
              Join the Thicket — write a comment...
            </button>
          )}

          {/* 留言搜尋 + 排序 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 26 }}>
            <input
              type="text"
              placeholder="Search Comments"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ padding: '9px 16px', borderRadius: 20, border: '1px solid #ddd', backgroundColor: '#EFEFE0', width: 220 }}
            />
            <span style={{ fontSize: 13, fontWeight: 700 }}>Sort by:</span>
            <SortDropdown value={sort} onChange={setSort} />
          </div>

          {/* 留言列表 */}
          <div>
            {mockComments
              .filter((c) => c.text.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((c) => (
                <CommentItem key={c.id} comment={c} onReport={handleReport} />
              ))}
          </div>
            </>
          )}
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

export default PostDetail;
