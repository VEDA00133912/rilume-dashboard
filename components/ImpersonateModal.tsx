'use client';
import Modal from '@/components/SettingsModal';
import { useEffect, useState } from 'react';
import styles from '@/css/dashboard/Settings/Modal.module.css';

type ImpersonateData = {
  _id: string;
  guildId: string;
  channelId?: string;
  impersonate: boolean;
};

export default function ImpersonateModal({ onClose }: { onClose: () => void }) {
  const [data, setData] = useState<ImpersonateData[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ImpersonateData | null>(null);

  const fetchImpersonate = async () => {
    try {
      const res = await fetch('/api/impersonate');
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error('Impersonate取得失敗:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImpersonate();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('このImpersonate設定を削除しますか？')) return;
    await fetch(`/api/impersonate/${id}`, { method: 'DELETE' });
    fetchImpersonate();
  };

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editing) return;

    const formData = new FormData(e.currentTarget);
    const raw = Object.fromEntries(formData.entries());

    const body = {
      guildId: raw.guildId as string,
      channelId: raw.channelId as string,
      impersonate: raw.impersonate === 'true',
    };

    await fetch(`/api/impersonate/${editing._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    setEditing(null);
    fetchImpersonate();
  };

  return (
    <Modal title="Impersonate Settings" onClose={onClose}>
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
              <div className={styles.singleRow}>
                <div className={styles.infoGroup}>
                  <span>
                    <b>Guild:</b> {item.guildId}
                  </span>
                  <span>
                    <b>Channel:</b> {item.channelId ?? '—'}
                  </span>
                  <span>
                    <b>Impersonate:</b>{' '}
                    {item.impersonate ? (
                      <span className={styles.enabled}>有効</span>
                    ) : (
                      <span className={styles.disabled}>無効</span>
                    )}
                  </span>
                </div>
                <div className={styles.actionBtns}>
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
            <h3>Impersonate 編集</h3>
            <label>
              Guild ID:
              <input name="guildId" defaultValue={editing.guildId} required />
            </label>
            <label>
              Channel ID:
              <input name="channelId" defaultValue={editing.channelId ?? ''} />
            </label>
            <label>
              Impersonate:
              <select
                name="impersonate"
                defaultValue={String(editing.impersonate)}
                className={styles.select}
              >
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
