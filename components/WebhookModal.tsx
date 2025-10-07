'use client';
import Modal from '@/components/SettingsModal';
import { useEffect, useState } from 'react';
import styles from '@/css/dashboard/Settings/Modal.module.css';

type WebhookData = {
  _id: string;
  guildId: string;
  webhookId: string;
  token: string;
};

export default function WebhookModal({ onClose }: { onClose: () => void }) {
  const [data, setData] = useState<WebhookData[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<WebhookData | null>(null);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/webhooks');
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error('Webhook取得失敗:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('このWebhook設定を削除しますか？')) return;
    await fetch(`/api/webhooks/${id}`, { method: 'DELETE' });
    fetchData();
  };

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editing) return;
    const formData = new FormData(e.currentTarget);
    const body = Object.fromEntries(formData.entries());
    await fetch(`/api/webhooks/${editing._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    setEditing(null);
    fetchData();
  };

  return (
    <Modal title="Webhook Settings" onClose={onClose}>
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
                  <b>Webhook:</b> {item.webhookId}
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
              <div className={styles.lightBlock}>
                <div className={styles.tokenScroll}>
                  <b>Token:</b> {item.token}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {editing && (
        <div className={styles.editOverlay}>
          <form className={styles.editForm} onSubmit={handleEdit}>
            <h3>Webhook 編集</h3>
            <label>
              GuildID:
              <input name="guildId" defaultValue={editing.guildId} required />
            </label>
            <label>
              WebhookID:
              <input
                name="webhookId"
                defaultValue={editing.webhookId}
                required
              />
            </label>
            <label>
              Token:
              <input name="token" defaultValue={editing.token} required />
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
