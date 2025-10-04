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

export default function ManageServers() {
  const [guilds, setGuilds] = useState<Guild[]>([]);

  useEffect(() => {
    fetch('/api/guilds', { credentials: 'include' })
      .then((res) => {
        if (res.status === 401) {
          window.location.href = '/';
          return;
        }
        if (!res.ok) throw new Error('サーバー取得エラー');
        return res.json();
      })
      .then((data) => data && setGuilds(data))
      .catch((err) => alert(err.message));
  }, []);

  return (
    <>
      <Header />
      <div className={styles.container}>
        <h1 className={styles.header}>Bot参加サーバー一覧</h1>
        <div className={styles.grid}>
          {guilds.map((g) => (
            <ServerCard key={g.id} guild={g} />
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}
