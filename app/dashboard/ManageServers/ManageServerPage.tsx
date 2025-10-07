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
        if (data) setGuilds(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Header />
      <div className={styles.container}>
        <h1 className={styles.header}>Bot参加サーバー一覧</h1>

        {loading ? (
          <p className={styles.loading}>読み込み中...</p>
        ) : error ? (
          <p className={styles.error}>エラー: {error}</p>
        ) : guilds.length === 0 ? (
          <p className={styles.empty}>Botが参加しているサーバーはありません。</p>
        ) : (
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
