import { useState } from 'react';
import { theme } from '../theme';
import reportMonster from '../pic/report-monster.png';

/**
 * 疊加式刪除確認彈窗
 * props:
 *  - onConfirm: () => Promise<void> | void   // 按下 Delete 後執行的刪除動作
 *  - onClose: () => void                     // Cancel 或刪除完成後 Close 都呼叫這個
 */
function DeleteConfirmModal({ onConfirm, onClose }) {
  const [deleted, setDeleted] = useState(false);

  const handleDelete = async () => {
    await onConfirm();
    setDeleted(true);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 200,
      fontFamily: 'sans-serif'
    }}>
      <div style={{
        backgroundColor: theme.noticeBg,
        borderRadius: 16,
        width: 500,
        maxWidth: '90vw',
        padding: '46px 40px',
        textAlign: 'center',
        boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
      }}>
        <img
          src={reportMonster}
          alt="notice mascot"
          style={{ width: 80, marginBottom: 20 }}
          onError={(e) => { e.currentTarget.style.outline = '2px dashed red'; }}
        />

        {!deleted ? (
          <>
            <h2 style={{ color: '#fff', margin: '0 0 30px 0' }}>
              Are you sure you want to delete this Rustle / Thicket?
            </h2>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 24 }}>
              <button
                onClick={onClose}
                style={{
                  padding: '10px 40px', borderRadius: 8, border: 'none',
                  backgroundColor: theme.successClose, color: '#fff',
                  fontWeight: 700, fontSize: 15, cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                style={{
                  padding: '10px 40px', borderRadius: 8, border: 'none',
                  backgroundColor: '#D9342B', color: '#fff',
                  fontWeight: 700, fontSize: 15, cursor: 'pointer'
                }}
              >
                Delete
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 style={{ color: '#fff', margin: '0 0 30px 0' }}>
              Rustle / Thicket deleted.
            </h2>
            <button
              onClick={onClose}
              style={{
                padding: '10px 46px', borderRadius: 8, border: 'none',
                backgroundColor: theme.successClose, color: '#fff',
                fontWeight: 700, fontSize: 15, cursor: 'pointer'
              }}
            >
              Close
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default DeleteConfirmModal;
