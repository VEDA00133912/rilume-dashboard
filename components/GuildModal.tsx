'use client';
import { useState, useEffect } from 'react';
import styles from '../css/GuildModal.module.css';

type Props = {
  guildId: string;
  onClose: () => void;
};

type GuildResponse =
  | {
      ok: true;
      guild: { id: string; name: string; approximate_member_count: number };
      owner: { id: string; username: string };
    }
  | { ok: false; message?: string };

export default function GuildModal({ guildId, onClose }: Props) {
  const [data, setData] = useState<GuildResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/guilds/${guildId}`)
      .then(res => res.json())
      .then((json: GuildResponse) => setData(json))
      .finally(() => setLoading(false));
  }, [guildId]);

  const handleLeave = async () => {
    if (!confirm('本当にサーバーからBOTを脱退しますか？')) return;
    await fetch(`/api/guilds/${guildId}/leave`, { method: 'POST' });
    onClose();
    alert('脱退しました');
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button onClick={onClose} className={styles.closeButton} aria-label="閉じる">
          ×
        </button>

        {loading ? (
          <p>読み込み中...</p>
        ) : !data ? (
          <p>データが取得できませんでした</p>
        ) : data.ok === false ? (
          <p>エラー: {data.message || '不明なエラー'}</p>
        ) : (
          <>
            <h2>{data.guild.name}</h2>
            <p>メンバー数: {data.guild.approximate_member_count}</p>
            <p>オーナー: {data.owner.username} ({data.owner.id})</p>
            <button onClick={handleLeave} className={styles.leaveButton}>
              脱退
            </button>
            <button onClick={onClose} className={styles.closeActionButton}>
              閉じる
            </button>
          </>
        )}
      </div>
    </div>
  );
}
