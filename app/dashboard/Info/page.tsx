'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from '@/css/dashboard/Info/Page.module.css';

type BotInfo = {
  id: string;
  username: string;
  global_name?: string;
  discriminator: string;
  avatarUrl: string;
  bannerUrl?: string | null;
  online: boolean;
  guildCount: number;
  totalMembers: number;
  lastUpdate?: string | null;
};

export default function BotInfoPage() {
  const [data, setData] = useState<BotInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('/api/info')
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div className={styles.fullScreenCenter}>
        <div className={styles.loadingCard}>読み込み中...</div>
      </div>
    );

  if (error || !data)
    return (
      <div className={styles.fullScreenCenter}>
        <div className={styles.loadingCard}>エラーが発生しました</div>
      </div>
    );

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {data.bannerUrl && (
          <div className={styles.bannerWrapper}>
            <Image
              src={data.bannerUrl}
              alt="Banner"
              width={600}
              height={200}
              className={styles.banner}
            />
          </div>
        )}

        <div className={styles.header}>
          <Image
            src={data.avatarUrl}
            alt="Avatar"
            width={96}
            height={96}
            className={styles.avatar}
          />
          <div>
            <div className={styles.title}>
              {data.username}
              <span className={styles.subtitle}>#{data.discriminator}</span>
            </div>
            {data.global_name && (
              <div className={styles.subtitle}>{data.global_name}</div>
            )}
          </div>
        </div>

        <div className={styles.info}>
          <div className={styles.infoRow}>
            <span className={styles.label}>BOTステータス</span>
            <span
              className={styles.value}
              style={{ color: data.online ? 'limegreen' : 'red' }}
            >
              {data.online ? 'オンライン' : 'オフライン'}
            </span>
          </div>

          <div className={styles.infoRow}>
            <span className={styles.label}>参加サーバー数</span>
            <span className={styles.value}>{data.guildCount}</span>
          </div>

          <div className={styles.infoRow}>
            <span className={styles.label}>利用メンバー数</span>
            <span className={styles.value}>{data.totalMembers}</span>
          </div>

          {data.lastUpdate && (
            <div className={styles.infoRow}>
              <span className={styles.label}>最終動作確認時刻</span>
              <span className={styles.value}>
                {new Date(data.lastUpdate).toLocaleString()}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
