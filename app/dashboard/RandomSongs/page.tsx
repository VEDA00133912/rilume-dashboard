'use client';
import { useState, useEffect } from 'react';
import StatusMessage from '@/components/StatusMessage';
import styles from '@/css/dashboard/RandomSongs/Page.module.css';

type TaikoForm = {
  title?: string;
  genre?: string;
  difficulties?: { easy?: number; normal?: number; hard?: number; oni?: number; edit?: number };
};

type PrskForm = {
  name?: string;
  difficulties?: { easy?: number; normal?: number; hard?: number; expert?: number; master?: number; append?: number };
};

type FormType = TaikoForm | PrskForm;

export default function RandomSongsPage() {
  const [collection, setCollection] = useState<'taiko' | 'prsk'>('taiko');
  const [songs, setSongs] = useState<any[]>([]);
  const [form, setForm] = useState<FormType>({});
  const [editForm, setEditForm] = useState<FormType>({});
  const [editId, setEditId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<{ message: string; type?: 'success' | 'error' | 'info' } | null>(null);

  useEffect(() => {
    fetchSongs();
  }, [collection]);

  const fetchSongs = async () => {
    try {
      setStatus({ message: 'データをロード中...', type: 'info' });
      const res = await fetch(`/api/randomsongs/${collection}`);
      if (!res.ok) throw new Error('ロードに失敗しました');
      const data = await res.json();
      setSongs(data);
      setStatus({ message: 'ロード成功', type: 'success' });
    } catch (err: any) {
      setStatus({ message: err.message || 'ロードに失敗しました', type: 'error' });
    }
  };

  const handleAdd = async () => {
    try {
      if (collection === 'taiko' && !(form as TaikoForm).title) throw new Error('曲名を入力してください');
      if (collection === 'prsk' && !(form as PrskForm).name) throw new Error('曲名を入力してください');

      const res = await fetch(`/api/randomsongs/${collection}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('追加に失敗しました');

      setForm({});
      fetchSongs();
      setStatus({ message: '追加成功', type: 'success' });
    } catch (err: any) {
      setStatus({ message: err.message || '追加に失敗しました', type: 'error' });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/randomsongs/${collection}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('削除に失敗しました');

      fetchSongs();
      setStatus({ message: '削除成功', type: 'success' });
    } catch (err: any) {
      setStatus({ message: err.message || '削除に失敗しました', type: 'error' });
    }
  };

  const handleEdit = (song: any) => {
    setEditId(song._id);
    setEditForm(
      collection === 'taiko'
        ? { title: song.title, difficulties: { ...song.difficulties } }
        : { name: song.name, difficulties: { ...song.difficulties } }
    );
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch(`/api/randomsongs/${collection}/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      if (!res.ok) throw new Error('編集に失敗しました');

      setEditId(null);
      setEditForm({});
      fetchSongs();
      setStatus({ message: '編集成功', type: 'success' });
    } catch (err: any) {
      setStatus({ message: err.message || '編集に失敗しました', type: 'error' });
    }
  };

  const difficulties =
    collection === 'taiko'
      ? ['easy', 'normal', 'hard', 'oni', 'edit']
      : ['easy', 'normal', 'hard', 'expert', 'master', 'append'];

  const filteredSongs = songs.filter(song =>
    !search
      ? true
      : collection === 'taiko'
      ? song.title?.toLowerCase().includes(search.toLowerCase())
      : song.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <h2 className={styles.header}>ランダム選曲データベース管理</h2>

      {status && <StatusMessage message={status.message} type={status.type} />}

      <div className={styles.switch}>
        <button onClick={() => setCollection('taiko')} disabled={collection === 'taiko'}>
          Taiko
        </button>
        <button onClick={() => setCollection('prsk')} disabled={collection === 'prsk'}>
          Prsk
        </button>
      </div>

      <div className={styles.formRow}>
        <input
          placeholder="曲名"
          value={collection === 'taiko' ? (form as TaikoForm).title || '' : (form as PrskForm).name || ''}
          onChange={e =>
            setForm(f =>
              collection === 'taiko' ? { ...f, title: e.target.value } : { ...f, name: e.target.value }
            )
          }
          className={styles.titleBox}
        />
      </div>

      <div className={styles.formRow}>
        <input
          placeholder="ジャンル"
          value={(form as TaikoForm).genre || ''}
          onChange={e => setForm(f => ({ ...f, genre: e.target.value }))}
          className={styles.titleBox}
        />
      </div>

      <div className={styles.formRow}>
        {difficulties.map(dif => (
          <input
            key={dif}
            placeholder={dif}
            type="number"
            value={(form as any).difficulties?.[dif] || ''}
            onChange={e =>
              setForm(f => ({ ...f, difficulties: { ...(f.difficulties || {}), [dif]: Number(e.target.value) } }))
            }
            className={styles.diffBox}
          />
        ))}
        <button onClick={handleAdd} className={styles.addBtn}>
          追加
        </button>
      </div>

      <div className={styles.formRow}>
        <input
          placeholder="検索"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className={styles.titleBox}
        />
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.title}>曲名</th>
            {difficulties.map(dif => (
              <th key={dif} className={styles.diff}>
                {dif}
              </th>
            ))}
            <th className={styles.action}>操作</th>
          </tr>
        </thead>
        <tbody>
          {filteredSongs.map(song =>
            editId === song._id ? (
              <tr key={song._id}>
                <td className={styles.title}>
                  <input
                    value={collection === 'taiko' ? (editForm as TaikoForm).title || '' : (editForm as PrskForm).name || ''}
                    onChange={e =>
                      setEditForm(f =>
                        collection === 'taiko' ? { ...f, title: e.target.value } : { ...f, name: e.target.value }
                      )
                    }
                    className={styles.titleBox}
                  />
                </td>
                {difficulties.map(dif => (
                  <td key={dif} className={styles.diff}>
                    <input
                      type="number"
                      value={(editForm as any).difficulties?.[dif] || ''}
                      onChange={e =>
                        setEditForm(f => ({
                          ...f,
                          difficulties: { ...(f.difficulties || {}), [dif]: Number(e.target.value) },
                        }))
                      }
                      className={styles.diffBox}
                    />
                  </td>
                ))}
                <td className={styles.action}>
                  <div className={styles.actionBtns}>
                    <button onClick={handleUpdate}>保存</button>
                    <button onClick={() => setEditId(null)}>キャンセル</button>
                  </div>
                </td>
              </tr>
            ) : (
              <tr key={song._id}>
                <td className={styles.title}>{collection === 'taiko' ? song.title : song.name}</td>
                {difficulties.map(dif => (
                  <td key={dif} className={styles.diff}>
                    {song.difficulties?.[dif] ?? ''}
                  </td>
                ))}
                <td className={styles.action}>
                  <div className={styles.actionBtns}>
                    <button onClick={() => handleEdit(song)}>編集</button>
                    <button onClick={() => handleDelete(song._id)}>削除</button>
                  </div>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}
