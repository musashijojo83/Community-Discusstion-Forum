import { theme } from '../theme';
import noticeMonster from '../pic/notice-monster.png';

/**
 * 搜尋結果找不到內容時顯示的提示區塊（非全螢幕遮罩，是內嵌在內容區的卡片）
 * props:
 *  - variant: 'posts' | 'thickets'
 *  - onAction: () => void   // 按下 Make a Rustle / Create a Thicket + 要做的事
 */
function EmptyState({ variant, onAction }) {
  const isPosts = variant === 'posts';
  const message = isPosts
    ? 'Sorry, no Rustles yet. Be the first to start a discussion!'
    : 'Sorry, no Thickets yet. Be the first to start a discussion!';
  const actionLabel = isPosts ? 'Make a Rustle' : 'Create a Thicket +';

  return (
    <div style={{
      backgroundColor: theme.noticeBg,
      borderRadius: 16,
      padding: '46px 40px',
      textAlign: 'center',
      maxWidth: 520,
      margin: '0 auto'
    }}>
      <img
        src={noticeMonster}
        alt="notice mascot"
        style={{ width: 70, marginBottom: 18 }}
        onError={(e) => { e.currentTarget.style.outline = '2px dashed red'; }}
      />
      <h2 style={{ color: '#fff', margin: '0 0 24px 0', fontSize: 20 }}>{message}</h2>
      <button
        onClick={onAction}
        style={{
          padding: '10px 28px', borderRadius: 8, border: 'none',
          backgroundColor: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer'
        }}
      >
        {actionLabel}
      </button>
    </div>
  );
}

export default EmptyState;
