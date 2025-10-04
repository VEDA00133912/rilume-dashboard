'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from '../css/dashboard/Header.module.css';
const pages = [
  { name: 'Main', path: '/dashboard/Main' },
  { name: 'Info', path: '/dashboard/Info' },
  { name: 'ManageServers', path: '/dashboard/ManageServers' },
  { name: 'RandomSongs', path: '/dashboard/RandomSongs' },
  { name: 'Settings', path: '/dashboard/Settings' },
  { name: 'BlackList', path: '/dashboard/BlackList' },
];

export default function Header() {
  const pathname = usePathname();
  const current = pages.find((page) => pathname.startsWith(page.path));

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        {pages.map((page) => (
          <Link
            key={page.path}
            href={page.path}
            className={
              pathname.startsWith(page.path) ? styles.active : styles.link
            }
          >
            {page.name}
          </Link>
        ))}
      </nav>
      <div className={styles.currentPage}>
        {current ? current.name : 'Dashboard'}
      </div>
    </header>
  );
}
