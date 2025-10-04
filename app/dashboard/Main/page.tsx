import Link from 'next/link';
import Header from '@/components/Header';
import styles from '@/css/dashboard/Main.module.css';
import Footer from '@/components/Footer';

export default function MainPage() {
  return (
    <>
      <Header />
      <div className={styles.container}>
        <h1 className={styles.header}>Rilume ダッシュボード メインページ</h1>
        <ul className={styles.grid}>
          <li>
            <Link href="/dashboard/ManageServers">サーバー管理</Link>
          </li>
          <li>
            <Link href="/dashboard/BlackList">ブラックリスト管理</Link>
          </li>
          <li>
            <Link href="/dashboard/Info">BOT情報</Link>
          </li>
          <li>
            <Link href="/dashboard/RandomSongs">ランダム選曲DB管理</Link>
          </li>
          <li>
            <Link href="/dashboard/Settings">サーバー設定</Link>
          </li>
        </ul>
      </div>
      <Footer />
    </>
  );
}
