'use client';
import { useEffect, useState } from 'react';
import ServerCard from '@/components/ServerCard';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import styles from '@/css/dashboard/ManageServers/Page.module.css';

type Guild = {
  id: string;
  name: string;
  icon: string | null;
};

export default function ManageServersClient() {
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/guilds', { credentials: 'include' })
      .then((res) => {
        if (res.status === 401) {
          window.location.href = '/';
          return null;
        }
        if (!res.ok) throw new Error('サーバー取得エラー');
        return res.json();
      })
      .then((data) => {
        if (data) {
          const sorted = data.sort((a: Guild, b: Guild) =>
            a.id.localeCompare(b.id)
          );
          setGuilds(sorted);
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const renderStatus = () => {
    if (loading) return <p className={styles.status}>読み込み中...</p>;
    if (error)
      return (
        <p className={`${styles.status} ${styles.error}`}>エラー: {error}</p>
      );
    if (guilds.length === 0)
      return (
        <p className={styles.status}>Botが参加しているサーバーはありません。</p>
      );
    return (
      <p className={styles.status}>
        参加中のサーバー数: <strong>{guilds.length}</strong>
      </p>
    );
  };

  return (
    <>
      <Header />
      <div className={styles.container}>
        <h1 className={styles.header}>Bot参加サーバー一覧</h1>

        {/* ✅ 状態表示を統一 */}
        {renderStatus()}

        {!loading && !error && guilds.length > 0 && (
          <div className={styles.grid}>
            {guilds.map((g) => (
              <ServerCard key={g.id} guild={g} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
