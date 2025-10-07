'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from '@/css/dashboard/BlackList/Page.module.css';
import Dialog from '@/components/Dialog';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

type BlacklistUser = {
  _id: string;
  userId: string;
  addedAt: string;
  avatarUrl: string;
  username: string;
};

export default function BlackListPageClient() {
  const [users, setUsers] = useState<BlacklistUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newUserId, setNewUserId] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/blacklist');
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('[Fetch Error]', err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = async () => {
    if (!newUserId.trim()) return alert('ユーザーIDを入力してください');

    try {
      const res = await fetch('/api/blacklist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: newUserId.trim() }),
      });

      const data = await res.json();
      if (res.ok) {
        alert('ユーザーを追加しました');
        setDialogOpen(false);
        setNewUserId('');
        fetchUsers();
      } else {
        alert(data.error || '追加に失敗しました');
      }
    } catch (err) {
      console.error('[Add User Error]', err);
      alert('追加に失敗しました');
    }
  };

  const handleRemoveUser = async (userId: string) => {
    if (!confirm('このユーザーをブラックリストから削除しますか？')) return;

    try {
      const res = await fetch('/api/blacklist', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      const data = await res.json();
      if (res.ok) {
        alert('削除しました');
        fetchUsers();
      } else {
        alert(data.error || '削除に失敗しました');
      }
    } catch (err) {
      console.error('[Remove User Error]', err);
      alert('削除に失敗しました');
    }
  };

  return (
    <>
      <Header />
      <div className={styles.container}>
        <h1 className={styles.title}>ブラックリスト管理</h1>

        <button
          className={styles.addButton}
          onClick={() => setDialogOpen(true)}
        >
          + ユーザーを追加
        </button>

        {loading ? (
          <p className={styles.load}>読み込み中...</p>
        ) : users.length === 0 ? (
          <p className={styles.load}>ブラックリストにユーザーはいません。</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>User ID</th>
                <th>追加日時</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td className={styles.userCell}>
                    <Image
                      src={u.avatarUrl}
                      alt={u.username || 'avatar'}
                      width={40}
                      height={40}
                      className={styles.avatar}
                    />
                    <div>
                      <div className={styles.username}>{u.username}</div>
                      <div className={styles.userid}>{u.userId}</div>
                    </div>
                  </td>
                  <td>{new Date(u.addedAt).toLocaleString('ja-JP')}</td>
                  <td>
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleRemoveUser(u.userId)}
                    >
                      削除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          title="ブラックリスト追加"
        >
          <div className={styles.form}>
            <label>
              ユーザーID:
              <input
                type="text"
                value={newUserId}
                onChange={(e) => setNewUserId(e.target.value)}
              />
            </label>
            <div className={styles.dialogButtons}>
              <button onClick={handleAddUser}>追加</button>
              <button onClick={() => setDialogOpen(false)}>キャンセル</button>
            </div>
          </div>
        </Dialog>
      </div>
      <Footer />
    </>
  );
}
