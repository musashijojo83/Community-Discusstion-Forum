import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from '../axiosConfig';
import { theme } from '../theme';

function CreatePost() {
  const { thicketName } = useParams();
  const navigate = useNavigate();
  const [board, setBoard] = useState(null);
  const [boardError, setBoardError] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('General');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // 目前後端沒有「用名字查單一 board」的 API，先抓全部 board 清單再用 name 找出對應的 _id
  useEffect(() => {
    const findBoard = async () => {
      try {
        const res = await axios.get('/boards');
        const matched = res.data.find((b) => b.name === thicketName);
        if (!matched) {
          setBoardError(`Could not find a Thicket named "${thicketName}".`);
        } else {
          setBoard(matched);
        }
      } catch (err) {
        setBoardError(err.response?.data?.message || 'Failed to load Thicket.');
      }
    };
    findBoard();
  }, [thicketName]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await axios.post('/posts', {
        title,
        content,
        category,
        board: board._id
      });
      navigate(`/thickets/${thicketName}/posts/${res.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post.');
    } finally {
      setSubmitting(false);
    }
  };

  if (boardError) {
    return (
      <div style={{
        minHeight: '100vh', backgroundColor: theme.formBg, fontFamily: 'sans-serif',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
      }}>
        <p style={{ marginBottom: 12 }}>{boardError}</p>
        <Link to="/" style={{ color: theme.linkPurple, fontWeight: 700 }}>Back to home</Link>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh', backgroundColor: theme.formBg, fontFamily: 'sans-serif',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
    }}>
      <div style={{
        width: 560, maxWidth: '100%', backgroundColor: '#fff',
        borderRadius: 16, padding: 32, boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ marginTop: 0 }}>Make a Rustle</h2>
        <p style={{ color: '#666', fontSize: 13, marginTop: -8, marginBottom: 20 }}>
          Posting in <strong>{thicketName}</strong>
        </p>

        <form onSubmit={handleSubmit}>
          <label style={{ fontWeight: 700, fontSize: 13, display: 'block', marginBottom: 6 }}>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              width: '100%', padding: '10px 14px', borderRadius: 20,
              border: 'none', backgroundColor: theme.inputBg, color: '#fff',
              boxSizing: 'border-box', marginBottom: 16, fontSize: 14
            }}
            required
          />

          <label style={{ fontWeight: 700, fontSize: 13, display: 'block', marginBottom: 6 }}>Content:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            style={{
              width: '100%', padding: '12px 14px', borderRadius: 16,
              border: '1px solid #ccc', boxSizing: 'border-box', marginBottom: 16,
              fontSize: 14, resize: 'vertical', fontFamily: 'sans-serif'
            }}
            required
          />

          <label style={{ fontWeight: 700, fontSize: 13, display: 'block', marginBottom: 6 }}>Category:</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              width: '100%', padding: '10px 14px', borderRadius: 20,
              border: '1px solid #ccc', boxSizing: 'border-box', marginBottom: 20, fontSize: 14
            }}
          />

          {error && <p style={{ color: theme.errorRed, fontSize: 13, marginBottom: 14 }}>{error}</p>}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <button
              type="button"
              onClick={() => navigate(`/thickets/${thicketName}`)}
              style={{
                padding: '10px 24px', borderRadius: 20, border: 'none',
                backgroundColor: '#ddd', fontWeight: 700, fontSize: 14, cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !board}
              style={{
                padding: '10px 28px', borderRadius: 20, border: 'none',
                backgroundColor: theme.inputBg, color: '#fff', fontWeight: 700,
                fontSize: 14, cursor: submitting ? 'not-allowed' : 'pointer',
                opacity: submitting ? 0.7 : 1
              }}
            >
              {submitting ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreatePost;
