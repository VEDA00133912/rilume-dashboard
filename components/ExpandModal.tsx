'use client';
import Modal from '@/components/SettingsModal';
import { useEffect, useState } from 'react';
import styles from '@/css/dashboard/Settings/Modal.module.css';

type ExpandData = {
  _id: string;
  guildId: string;
  expand: boolean;
};

export default function ExpandsModal({ onClose }: { onClose: () => void }) {
  const [data, setData] = useState<ExpandData[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ExpandData | null>(null);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/expands');
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error('Expands取得失敗:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('この設定を削除しますか？')) return;
    try {
      await fetch(`/api/expands/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (err) {
      console.error('削除失敗:', err);
    }
  };

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editing) return;
    const formData = new FormData(e.currentTarget);
    const body = Object.fromEntries(formData.entries());
    try {
      await fetch(`/api/expands/${editing._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guildId: body.guildId,
          expand: body.expand === 'true',
        }),
      });
      setEditing(null);
      fetchData();
    } catch (err) {
      console.error('編集失敗:', err);
    }
  };

  return (
    <Modal title="Expands Settings" onClose={onClose}>
      <div className={styles.discordList}>
        {loading ? (
          <p style={{ textAlign: 'center', padding: '16px' }}>ロード中...</p>
        ) : data.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '16px' }}>
            データがありません。
          </p>
        ) : (
          data.map((item) => (
            <div key={item._id} className={styles.discordBlock}>
              <div className={styles.darkBlock}>
                <div>
                  <b>Guild:</b> {item.guildId}
                </div>
                <div>
                  <b>Expand:</b>{' '}
                  {item.expand ? (
                    <span className={styles.enabled}>✅ 有効</span>
                  ) : (
                    <span className={styles.disabled}>❌ 無効</span>
                  )}
                </div>
                <div>
                  <button
                    className={`${styles.iconBtn} ${styles.editBtn}`}
                    aria-label="編集"
                    onClick={() => setEditing(item)}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1.004 1.004 0 000-1.42l-2.34-2.34a1.004 1.004 0 00-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z"
                        fill="currentColor"
                      />
                    </svg>
                  </button>

                  <button
                    className={`${styles.iconBtn} ${styles.deleteBtn}`}
                    aria-label="削除"
                    onClick={() => handleDelete(item._id)}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-4.5l-1-1z"
                        fill="currentColor"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {editing && (
        <div className={styles.editOverlay}>
          <form className={styles.editForm} onSubmit={handleEdit}>
            <h3>Expand 編集</h3>
            <label>
              GuildID:
              <input name="guildId" defaultValue={editing.guildId} required />
            </label>
            <label>
              Expand:
              <select name="expand" defaultValue={String(editing.expand)}>
                <option value="true">有効</option>
                <option value="false">無効</option>
              </select>
            </label>
            <div className={styles.editActions}>
              <button type="submit">保存</button>
              <button type="button" onClick={() => setEditing(null)}>
                キャンセル
              </button>
            </div>
          </form>
        </div>
      )}
    </Modal>
  );
}
