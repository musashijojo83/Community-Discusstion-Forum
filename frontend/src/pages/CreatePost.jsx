import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../axiosConfig';
import { theme } from '../theme';

function CreatePost() {
  const { thicketName } = useParams();
  const navigate = useNavigate();
  const [board, setBoard] = useState(null);
  const [isDemo, setIsDemo] = useState(false);
  const [checkingBoard, setCheckingBoard] = useState(true);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('General');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // For now backend it's not time to create backend resource to check API, use get all board then use name to find
  useEffect(() => {
    const findBoard = async () => {
      setCheckingBoard(true);
      try {
        const res = await axios.get('/boards');
        const matched = res.data.find((b) => b.name === thicketName);
        if (matched) {
          setBoard(matched);
          setIsDemo(false);
        } else {
          // For demo board
          setIsDemo(true);
        }
      } catch (err) {
        console.error('Failed to load board, falling back to demo mode:', err);
        setIsDemo(true);
      } finally {
        setCheckingBoard(false);
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

    if (isDemo) {
      // For demostration use
      const demoPost = {
        _id: `demo-${Date.now()}`,
        title,
        content,
        createdAt: new Date().toISOString()
      };
      navigate(`/thickets/${thicketName}/posts/${demoPost._id}`, { state: { demoPost } });
      return;
    }

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

  if (checkingBoard) {
    return (
      <div style={{
        minHeight: '100vh', backgroundColor: theme.formBg, fontFamily: 'sans-serif',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <p>Loading...</p>
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
        <div
          onClick={() => navigate('/')}
          style={{ fontSize: 15, fontWeight: 800, color: theme.linkPurple, cursor: 'pointer', marginBottom: 14 }}
        >
          ← Rustle Rustle.
        </div>
        <h2 style={{ marginTop: 0 }}>Make a Rustle</h2>
        <p style={{ color: '#666', fontSize: 13, marginTop: -8, marginBottom: 20 }}>
          Posting in <strong>{thicketName}</strong>
          {isDemo && <span style={{ fontStyle: 'italic' }}> (demo — not saved to the database)</span>}
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
              disabled={submitting}
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
