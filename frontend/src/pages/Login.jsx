import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../axiosConfig';
import monsterImg from '../pic/login-monster.png';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      // For first time register, and login will redirect to create avatar
      if (!res.data.user.avatar) {
        navigate('/edit-avatar');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Incorrect email or password.');
    }
  };

  const inputWrapStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    width: '100%',
    padding: '12px 16px',
    borderRadius: 24,
    backgroundColor: '#A7BE56',
    boxSizing: 'border-box',
    marginBottom: 14
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

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#FBF7C7',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      fontFamily: 'sans-serif'
    }}>
      <div style={{ width: 380, paddingTop: 60 }}>
        <h1 style={{ fontSize: 34, fontWeight: 800, marginBottom: 30 }}>Login</h1>

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div style={inputWrapStyle}>
            <span style={{ color: '#fff', fontSize: 16 }}>✉️</span>
            <input
              type="email"
              placeholder="Email:"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
              required
            />
          </div>

          {/* Password */}
          <div style={inputWrapStyle}>
            <span style={{ color: '#fff', fontSize: 16 }}>🔒</span>
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
              style={{ color: '#fff', cursor: 'pointer', fontSize: 16 }}
            >
              {showPassword ? '🙈' : '👁️'}
            </span>
          </div>

          {/* Remember me / Forgot password */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: error ? 8 : 20,
            fontSize: 13
          }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember Me
            </label>
            <Link to="/forgot-password" style={{ color: '#333', textDecoration: 'none' }}>
              Forgot password?
            </Link>
          </div>

          {/* Error message — sits right below Remember Me row, above Log In button */}
          {error && (
            <p style={{
              color: 'red',
              fontSize: 13,
              margin: '0 0 14px 0',
              textAlign: 'left'
            }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            style={{
              width: '100%',
              padding: 12,
              border: 'none',
              borderRadius: 24,
              backgroundColor: '#A7BE56',
              color: '#fff',
              fontWeight: 700,
              fontSize: 15,
              cursor: 'pointer'
            }}
          >
            Log In
          </button>
        </form>

        {/* Divider */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          margin: '20px 0',
          color: '#999',
          fontSize: 13
        }}>
          <div style={{ flex: 1, height: 1, backgroundColor: '#ccc' }} />
          <span style={{ margin: '0 10px' }}>or</span>
          <div style={{ flex: 1, height: 1, backgroundColor: '#ccc' }} />
        </div>

        {/* Social login */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 16 }}>
          {['G', 'f', ''].map((label, i) => (
            <div key={i} style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              backgroundColor: '#fff',
              boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              cursor: 'pointer'
            }}>
              {label}
            </div>
          ))}
        </div>

        <p style={{ textAlign: 'center', fontSize: 13 }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#9B59B6', fontWeight: 600, textDecoration: 'none' }}>
            Go to Register
          </Link>
        </p>
      </div>

      {/* Bottom floor with monsters */}
      <div style={{
        width: '100%',
        marginTop: 'auto',
        paddingTop: 40,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <img
          src={monsterImg}
          alt="mascots"
          style={{
            width: 420,
            maxWidth: '90%',
            display: 'block'
          }}
          onError={(e) => {
            e.currentTarget.style.outline = '2px dashed red';
            console.error('login-monster.png 載入失敗，請確認路徑 src/pic/login-monster.png 是否存在');
          }}
        />
        <div style={{
          width: '100%',
          height: 24,
          backgroundColor: '#5E3D26'
        }} />
      </div>
    </div>
  );
}

export default Login;
