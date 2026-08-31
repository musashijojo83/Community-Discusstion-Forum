import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../axiosConfig';

function CreateBoard() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [rules, setRules] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!name) {
      setError('Thicket name is required');
      return;
    }
    try {
      const res = await axios.post('/boards', { name, description, rules });
      setSuccess(res.data);

      const user = JSON.parse(localStorage.getItem('user'));
      user.role = res.data.newRole;
      localStorage.setItem('user', JSON.stringify(user));

      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create board');
    }
  };

  if (success) {
    return (
      <div style={{ textAlign: 'center', marginTop: 80, fontFamily: 'sans-serif' }}>
        <h2>Success!</h2>
        <p>The Thicket is created!</p>
        <p><strong>You are now the Moderator of this board!</strong></p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 500, margin: '60px auto', fontFamily: 'sans-serif' }}>
      <h2>Create a Thicket</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>Thicket name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: '100%', padding: 8 }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Introduction:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ width: '100%', padding: 8, minHeight: 60 }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Rules:</label>
          <textarea
            value={rules}
            onChange={(e) => setRules(e.target.value)}
            style={{ width: '100%', padding: 8, minHeight: 60 }}
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Create Thicket</button>
      </form>
    </div>
  );
}

export default CreateBoard;