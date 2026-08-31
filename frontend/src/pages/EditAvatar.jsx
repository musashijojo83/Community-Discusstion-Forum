import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../axiosConfig';
import { theme } from '../theme';

// 挑選幾種視覺上比較像「怪獸/生物」的 DiceBear 風格，符合 Rustle Rustle 的怪獸主題
const STYLES = [
  { id: 'bottts', label: 'Robo-monster' },
  { id: 'croodles', label: 'Doodle monster' },
  { id: 'thumbs', label: 'Blob monster' },
  { id: 'shapes', label: 'Shape monster' },
  { id: 'big-ears', label: 'Big-ear monster' },
  { id: 'fun-emoji', label: 'Emoji monster' }
];

function randomSeed() {
  return Math.random().toString(36).slice(2, 10);
}

function avatarUrl(style, seed) {
  return `https://api.dicebear.com/10.x/${style}/svg?seed=${seed}`;
}

function EditAvatar() {
  const navigate = useNavigate();
  const storedUser = (() => {
    try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
  })();

  const [style, setStyle] = useState(STYLES[0].id);
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
      const url = avatarUrl(style, seed);
      const res = await axios.patch('/users/me/avatar', { avatar: url });
      const updatedUser = { ...storedUser, avatar: res.data.avatar };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setSaved(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save avatar.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', backgroundColor: theme.formBg, fontFamily: 'sans-serif',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
    }}>
      <div style={{
        width: 500, maxWidth: '100%', backgroundColor: '#fff',
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
          Pick a style, then reroll until you find the one that's you.
        </p>

        {/* 預覽 */}
        <div style={{
          width: 140, height: 140, margin: '0 auto 20px',
          borderRadius: 20, backgroundColor: theme.panelBg,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <img src={avatarUrl(style, seed)} alt="avatar preview" style={{ width: 100, height: 100 }} />
        </div>

        {/* 風格選擇 */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 20
        }}>
          {STYLES.map((s) => (
            <button
              key={s.id}
              onClick={() => { setStyle(s.id); setSaved(false); }}
              style={{
                padding: '10px 6px', borderRadius: 10, cursor: 'pointer',
                border: style === s.id ? `2px solid ${theme.successClose}` : '1px solid #ddd',
                backgroundColor: style === s.id ? '#eef2ff' : '#fff',
                fontSize: 12, fontWeight: 700
              }}
            >
              <img src={avatarUrl(s.id, seed)} alt={s.label} style={{ width: 36, height: 36, display: 'block', margin: '0 auto 6px' }} />
              {s.label}
            </button>
          ))}
        </div>

        <button
          onClick={handleReroll}
          style={{
            padding: '9px 24px', borderRadius: 20, border: '1px solid #ccc',
            backgroundColor: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer', marginBottom: 18
          }}
        >
          🎲 Reroll
        </button>

        {error && <p style={{ color: theme.errorRed, fontSize: 13, marginBottom: 12 }}>{error}</p>}
        {saved && <p style={{ color: '#2e7d32', fontSize: 13, marginBottom: 12 }}>Saved! This is your new monster.</p>}

        <div>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              padding: '10px 40px', borderRadius: 20, border: 'none',
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
