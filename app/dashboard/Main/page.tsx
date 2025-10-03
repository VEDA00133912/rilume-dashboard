import Link from 'next/link';
import styles from '../../../css/dashboard/Main.module.css';

export default function MainPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Rilume ダッシュボード メインページ</h1>
      <ul className={styles.grid}>
        <li><Link href="/dashboard/ManageServers">サーバー管理</Link></li>
        <li><Link href="/dashboard/BlackList">ブラックリスト管理</Link></li>
        <li><Link href="/dashboard/Info">サーバー情報</Link></li>
        <li><Link href="/dashboard/RandomSongs">ランダムソング管理</Link></li>
        <li><Link href="/dashboard/Settings">サーバー設定</Link></li>
      </ul>
    </div>
  );
}
