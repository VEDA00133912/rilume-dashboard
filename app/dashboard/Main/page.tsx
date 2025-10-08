import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import styles from '@/css/dashboard/Main.module.css';
import Footer from '@/components/Footer';

export default async function MainPage() {
  const cookieStore = await cookies();
  const adminAuth = cookieStore.get('admin_auth');

  if (!adminAuth) {
    redirect('/');
  }

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
            <Link href="/dashboard/BlackList">ブラックリスト</Link>
          </li>
          <li>
            <Link href="/dashboard/Info">BOT情報</Link>
          </li>
          <li>
            <Link href="/dashboard/RandomSongs">ランダム選曲DB</Link>
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
