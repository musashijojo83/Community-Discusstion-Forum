import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../axiosConfig';
import registerMonster from '../pic/register-monster.png';
import successMonster from '../pic/success-monster.png';
import { theme } from '../theme';

function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  const inputWrapStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    width: '100%',
    padding: '11px 16px',
    borderRadius: 24,
    backgroundColor: theme.inputBg,
    boxSizing: 'border-box',
    marginBottom: 12
  };

  const inputStyle = {
    flex: 1,
    border: 'none',
    outline: 'none',
    background: 'transparent',
    color: '#fff',
    fontSize: 14,
    fontWeight: 600
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!agreed) {
      setError('Please agree to the Terms & Privacy Policy.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    try {
      await axios.post('/auth/register', {
        nickname: fullName,
        email,
        password
      });
      setShowSuccess(true);
    } catch (err) {
      if (!err.response) {
        // Set (If no respone then maybe connection issue)
        setError('Could not reach the server. Please check your connection and try again.');
        console.error('Register request failed with no response:', err);
        return;
      }
      const msg = err.response?.data?.message || '';
      if (err.response?.status === 400 && /already registered/i.test(msg)) {
        setError('Email already registered, please try another one.');
      } else {
        setError(msg || 'Registration failed, please try again.');
      }
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
      <div style={{
        display: 'flex',
        width: 700,
        maxWidth: '100%',
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }}>
        {/* For left side fuction list */}
        <div style={{ backgroundColor: theme.formBg, padding: '36px 40px', flex: 1.1 }}>
          <h2 style={{ marginTop: 0, marginBottom: 20, fontWeight: 800 }}>Registration Form</h2>

          <form onSubmit={handleSubmit}>
            <div style={inputWrapStyle}>
              <span style={{ color: '#fff', fontSize: 15 }}>👤</span>
              <input
                type="text"
                placeholder="Full Name:"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                style={inputStyle}
                required
              />
            </div>

            <div style={inputWrapStyle}>
              <span style={{ color: '#fff', fontSize: 15 }}>✉️</span>
              <input
                type="email"
                placeholder="Email:"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
                required
              />
            </div>

            <div style={inputWrapStyle}>
              <span style={{ color: '#fff', fontSize: 15 }}>🔒</span>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password:"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={inputStyle}
                required
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                style={{ color: '#fff', cursor: 'pointer', fontSize: 15 }}
              >
                {showPassword ? '🙈' : '👁️'}
              </span>
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, marginBottom: 6, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
              />
              I agree to the{' '}
              <Link to="/terms" style={{ color: theme.linkPurple }}>Terms & Privacy Policy</Link>
            </label>

            {error && (
              <p style={{ color: theme.errorRed, fontSize: 12, margin: '4px 0 10px 0' }}>
                {error}
              </p>
            )}

            <div style={{ textAlign: 'center', marginTop: 10 }}>
              <button
                type="submit"
                style={{
                  padding: '10px 40px',
                  border: 'none',
                  borderRadius: 24,
                  backgroundColor: theme.inputBg,
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: 15,
                  cursor: 'pointer'
                }}
              >
                Register
              </button>
            </div>
          </form>
        </div>

        {/* Right side monster position */}
        <div style={{
          backgroundColor: theme.panelBg,
          flex: 0.9,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          padding: '30px 20px',
          overflow: 'hidden'
        }}>
          <h3 style={{ marginBottom: 30, textAlign: 'center' }}>Welcome to join us!</h3>
          <img
            src={registerMonster}
            alt="mascot"
            style={{
              position: 'absolute',
              bottom: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '50%'
            }}
            onError={(e) => { e.currentTarget.style.outline = '2px dashed red'; }}
          />
        </div>
      </div>

      {/* Success window */}
      {showSuccess && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100
        }}>
          <div style={{
            backgroundColor: theme.formBg,
            borderRadius: 16,
            padding: '50px 60px',
            textAlign: 'center',
            boxShadow: '0 8px 30px rgba(0,0,0,0.2)'
          }}>
            <img
              src={successMonster}
              alt="success mascot"
              style={{ width: 70, marginBottom: 16 }}
              onError={(e) => { e.currentTarget.style.outline = '2px dashed red'; }}
            />
            <h2 style={{ margin: '0 0 12px 0' }}>Success!</h2>
            <p style={{ margin: '0 0 24px 0', color: '#333' }}>
              Please check your email for a confirmation link
            </p>
            <button
              onClick={() => navigate('/')}
              style={{
                padding: '10px 40px',
                border: 'none',
                borderRadius: 8,
                backgroundColor: theme.successClose,
                color: '#fff',
                fontWeight: 700,
                fontSize: 14,
                cursor: 'pointer'
              }}
            >
              close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Register;
