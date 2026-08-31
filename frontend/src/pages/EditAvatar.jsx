import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../axiosConfig';
import { theme } from '../theme';

const STYLE = 'critters';

function randomSeed() {
  return Math.random().toString(36).slice(2, 10);
}

function avatarUrl(seed) {
  return `https://api.dicebear.com/10.x/${STYLE}/svg?seed=${seed}`;
}

function EditAvatar() {
  const navigate = useNavigate();
  const storedUser = (() => {
    try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
  })();

  const [seed, setSeed] = useState(storedUser?.email || randomSeed());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  const handleReroll = () => {
    setSeed(randomSeed());
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const url = avatarUrl(seed);
      const res = await axios.patch('/users/me/avatar', { avatar: url });
      const updatedUser = { ...storedUser, avatar: res.data.avatar };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setSaved(true);
      setTimeout(() => navigate('/'), 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save avatar.');
      setSaving(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', backgroundColor: theme.formBg, fontFamily: 'sans-serif',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
    }}>
      <div style={{
        width: 440, maxWidth: '100%', backgroundColor: '#fff',
        borderRadius: 16, padding: 32, boxShadow: '0 4px 20px rgba(0,0,0,0.1)', textAlign: 'center'
      }}>
        <div
          onClick={() => navigate('/')}
          style={{ fontSize: 15, fontWeight: 800, color: theme.linkPurple, cursor: 'pointer', marginBottom: 14, textAlign: 'left' }}
        >
          ← Rustle Rustle.
        </div>

        <h2 style={{ marginTop: 0, marginBottom: 6 }}>Make Your Monster</h2>
        <p style={{ color: '#666', fontSize: 13, marginBottom: 24 }}>
          Reroll until you find the one that's you.
        </p>

        {/* FOR REVIEW AND AVATAR REROLL DICE*/}
        <div style={{
          width: 200, height: 200, margin: '0 auto 24px',
          borderRadius: 24, backgroundColor: theme.panelBg, overflow: 'hidden',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <img src={avatarUrl(seed)} alt="avatar preview" style={{ width: '100%', height: '100%' }} />
        </div>

        <button
          onClick={handleReroll}
          style={{
            padding: '10px 28px', borderRadius: 20, border: '1px solid #ccc',
            backgroundColor: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer', marginBottom: 20
          }}
        >
          🎲 Reroll
        </button>

        {error && <p style={{ color: theme.errorRed, fontSize: 13, marginBottom: 12 }}>{error}</p>}
        {saved && <p style={{ color: '#2e7d32', fontSize: 13, marginBottom: 12 }}>Saved! Taking you home...</p>}

        <div>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              padding: '10px 44px', borderRadius: 20, border: 'none',
              backgroundColor: theme.inputBg, color: '#fff', fontWeight: 700,
              fontSize: 14, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1
            }}
          >
            {saving ? 'Saving...' : 'Save this monster'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditAvatar;
