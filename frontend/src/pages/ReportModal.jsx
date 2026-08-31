import { useState } from 'react';
import axios from '../axiosConfig';
import { theme } from '../theme';
import successMonster from '../pic/success-monster.png';

const REASONS = ['Spam', 'Harassment', 'Other'];


function ReportModal({ postId, onClose }) {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!reason) {
      setError('Please select a report reason.');
      return;
    }
    setError('');

    try {
      await axios.post('/reports', { postId, reason });
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit report, please try again.');
    }
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.35)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 200,
        fontFamily: 'sans-serif'
      }}
    >
      {/* Prevent click the wrong content to close window */}
      <div onClick={(e) => e.stopPropagation()}>
        {!submitted ? (
          // Report form
          <div style={{
            backgroundColor: theme.formBg,
            borderRadius: 16,
            width: 480,
            maxWidth: '90vw',
            padding: 28,
            boxShadow: '0 10px 40px rgba(0,0,0,0.25)'
          }}>
            <div style={{
              border: '1px solid #ccc', borderRadius: 10, overflow: 'hidden', marginBottom: 14
            }}>
              <div style={{ padding: '10px 14px', fontWeight: 700, fontSize: 14, backgroundColor: '#f2f2e6' }}>
                Report reason:
              </div>
              {REASONS.map((r) => (
                <label
                  key={r}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '12px 14px', fontSize: 14, cursor: 'pointer',
                    backgroundColor: '#f2f2e6', borderTop: '1px solid #e2e2d4'
                  }}
                >
                  <input
                    type="radio"
                    name="report-reason"
                    checked={reason === r}
                    onChange={() => setReason(r)}
                  />
                  {r}
                </label>
              ))}
            </div>

            {error && (
              <p style={{ color: theme.errorRed, fontSize: 13, textAlign: 'center', margin: '4px 0 14px' }}>
                {error}
              </p>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button
                onClick={onClose}
                style={{
                  padding: '9px 20px', borderRadius: 20, border: 'none',
                  backgroundColor: '#ddd', fontWeight: 700, fontSize: 13, cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                style={{
                  padding: '9px 24px', borderRadius: 20, border: 'none',
                  backgroundColor: '#ccc', color: theme.errorRed, fontWeight: 700,
                  fontSize: 13, cursor: 'pointer'
                }}
              >
                Report
              </button>
            </div>
          </div>
        ) : (
          // Success window
          <div style={{
            backgroundColor: theme.formBg,
            borderRadius: 16,
            padding: '44px 50px',
            textAlign: 'center',
            boxShadow: '0 10px 40px rgba(0,0,0,0.25)'
          }}>
            <img
              src={successMonster}
              alt="success mascot"
              style={{ width: 64, marginBottom: 14 }}
              onError={(e) => { e.currentTarget.style.outline = '2px dashed red'; }}
            />
            <h2 style={{ margin: '0 0 10px 0' }}>Success!</h2>
            <p style={{ margin: '0 0 6px 0', color: '#333' }}>Report submitted. Our moderators will review it.</p>
            <p style={{ margin: '0 0 22px 0', color: '#333' }}>Thank for your report!</p>
            <button
              onClick={onClose}
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
    </div>
  );
}

export default ReportModal;
