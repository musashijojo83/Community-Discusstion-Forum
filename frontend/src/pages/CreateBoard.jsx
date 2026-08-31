import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../axiosConfig';
import { theme } from '../theme';
import successMonster from '../pic/success-monster.png';

const MEMBER_LIMIT_OPTIONS = [50, 100, 500, 1000];
const APPROVAL_OPTIONS = [
  { label: 'No approval needed', value: false },
  { label: 'Requires approval to join', value: true }
];

function CreateBoard() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [rules, setRules] = useState('');
  const [maxMembers, setMaxMembers] = useState(100);
  const [needsApproval, setNeedsApproval] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) {
      setError('Thicket name is required.');
      return;
    }
    try {
      const res = await axios.post('/boards', { name, description, rules, maxMembers, needsApproval });
      setSuccess(res.data);

      const user = JSON.parse(localStorage.getItem('user'));
      if (user) {
        user.role = res.data.newRole;
        localStorage.setItem('user', JSON.stringify(user));
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create Thicket.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: theme.formBg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'sans-serif',
      padding: 20
    }}>
      {!success ? (
        // Create a Thicket Form to user
        <div style={{
          backgroundColor: '#fff',
          borderRadius: 16,
          width: 560,
          maxWidth: '100%',
          padding: 32,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}>
          <div
            onClick={() => navigate('/')}
            style={{ fontSize: 15, fontWeight: 800, color: theme.linkPurple, cursor: 'pointer', marginBottom: 14 }}
          >
            ← Rustle Rustle.
          </div>
          <h2 style={{ marginTop: 0, marginBottom: 22 }}>Create a Thicket</h2>

          <form onSubmit={handleSubmit}>
            <label style={{ fontWeight: 700, fontSize: 14, display: 'block', marginBottom: 6 }}>
              Thicket name:
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: '100%', padding: '10px 14px', borderRadius: 10,
                border: '1px solid #ccc', boxSizing: 'border-box', marginBottom: 18, fontSize: 14
              }}
            />

            <label style={{ fontWeight: 700, fontSize: 14, display: 'block', marginBottom: 6 }}>
              Introduction:
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              style={{
                width: '100%', padding: '10px 14px', borderRadius: 10,
                border: '1px solid #ccc', boxSizing: 'border-box', marginBottom: 18,
                fontSize: 14, resize: 'vertical', fontFamily: 'sans-serif'
              }}
            />

            <label style={{ fontWeight: 700, fontSize: 14, display: 'block', marginBottom: 6 }}>
              Rule:
            </label>
            <textarea
              value={rules}
              onChange={(e) => setRules(e.target.value)}
              rows={4}
              style={{
                width: '100%', padding: '10px 14px', borderRadius: 10,
                border: '1px solid #ccc', boxSizing: 'border-box', marginBottom: 18,
                fontSize: 14, resize: 'vertical', fontFamily: 'sans-serif'
              }}
            />

            <div style={{ display: 'flex', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
              <select
                value={maxMembers}
                onChange={(e) => setMaxMembers(Number(e.target.value))}
                style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #ccc', fontSize: 13 }}
              >
                {MEMBER_LIMIT_OPTIONS.map((n) => (
                  <option key={n} value={n}>Member's limit: {n}</option>
                ))}
              </select>

              <select
                value={String(needsApproval)}
                onChange={(e) => setNeedsApproval(e.target.value === 'true')}
                style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #ccc', fontSize: 13 }}
              >
                {APPROVAL_OPTIONS.map((opt) => (
                  <option key={String(opt.value)} value={String(opt.value)}>{opt.label}</option>
                ))}
              </select>
            </div>

            {error && (
              <p style={{ color: theme.errorRed, fontSize: 13, textAlign: 'center', margin: '4px 0 14px' }}>
                {error}
              </p>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="submit"
                style={{
                  padding: '10px 32px', borderRadius: 20, border: 'none',
                  backgroundColor: theme.successClose, color: '#fff',
                  fontWeight: 700, fontSize: 14, cursor: 'pointer'
                }}
              >
                Rustle!
              </button>
            </div>
          </form>
        </div>
      ) : (
        // Success window notice
        <div style={{
          backgroundColor: theme.formBg,
          borderRadius: 16,
          padding: '44px 50px',
          textAlign: 'center',
          boxShadow: '0 10px 40px rgba(0,0,0,0.15)'
        }}>
          <img
            src={successMonster}
            alt="success mascot"
            style={{ width: 64, marginBottom: 14 }}
            onError={(e) => { e.currentTarget.style.outline = '2px dashed red'; }}
          />
          <h2 style={{ margin: '0 0 10px 0' }}>Success!</h2>
          <p style={{ margin: '0 0 6px 0', color: '#333' }}>The Thicket is created!</p>
          <p style={{ margin: '0 0 22px 0', color: '#333', fontWeight: 700 }}>
            You are now the Moderator of this board!
          </p>
          <button
            onClick={() => navigate('/')}
            style={{
              padding: '10px 36px', borderRadius: 8, border: 'none',
              backgroundColor: theme.successClose, color: '#fff',
              fontWeight: 700, fontSize: 14, cursor: 'pointer'
            }}
          >
            close
          </button>
        </div>
      )}
    </div>
  );
}

export default CreateBoard;
