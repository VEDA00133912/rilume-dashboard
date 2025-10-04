'use client';
import { useState, useEffect, useCallback, useMemo } from 'react';
import StatusMessage from '@/components/StatusMessage';
import styles from '@/css/dashboard/RandomSongs/Page.module.css';

type TaikoDifficulties = {
  easy?: number;
  normal?: number;
  hard?: number;
  oni?: number;
  edit?: number;
};

type PrskDifficulties = {
  easy?: number;
  normal?: number;
  hard?: number;
  expert?: number;
  master?: number;
  append?: number;
};

type TaikoForm = {
  _id?: string;
  title?: string;
  genre?: string;
  difficulties: TaikoDifficulties;
};

type PrskForm = {
  _id?: string;
  name?: string;
  difficulties: PrskDifficulties;
};

type Song = TaikoForm | PrskForm;

function updateDifficulty<T extends Song, K extends keyof T['difficulties']>(
  song: T,
  key: K,
  value: number
): T {
  return {
    ...song,
    difficulties: { ...song.difficulties, [key]: value },
  };
}

export default function RandomSongsPage() {
  const [collection, setCollection] = useState<'taiko' | 'prsk'>('taiko');
  const [songs, setSongs] = useState<Song[]>([]);
  const [form, setForm] = useState<TaikoForm | PrskForm>(
    collection === 'taiko' ? { difficulties: {} } : { difficulties: {} }
  );
  const [editForm, setEditForm] = useState<TaikoForm | PrskForm>(
    collection === 'taiko' ? { difficulties: {} } : { difficulties: {} }
  );
  const [editId, setEditId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<{ message: string; type?: 'success' | 'error' | 'info' } | null>(null);

  const fetchSongs = useCallback(async () => {
    try {
      setStatus({ message: 'データをロード中...', type: 'info' });
      const res = await fetch(`/api/randomsongs/${collection}`);
      if (!res.ok) throw new Error('ロードに失敗しました');
      const data: Song[] = await res.json();
      setSongs(data);
      setStatus({ message: 'ロード成功', type: 'success' });
    } catch (err: unknown) {
      setStatus({ message: err instanceof Error ? err.message : 'ロードに失敗しました', type: 'error' });
    }
  }, [collection]);

  useEffect(() => {
    fetchSongs();
  }, [fetchSongs]);

  const handleAdd = async () => {
    try {
      if (collection === 'taiko' && !(form as TaikoForm).title)
        throw new Error('曲名を入力してください');
      if (collection === 'prsk' && !(form as PrskForm).name)
        throw new Error('曲名を入力してください');

      const res = await fetch(`/api/randomsongs/${collection}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('追加に失敗しました');

      setForm(collection === 'taiko' ? { difficulties: {} } : { difficulties: {} });
      await fetchSongs();
      setStatus({ message: '追加成功', type: 'success' });
    } catch (err: unknown) {
      setStatus({
        message: err instanceof Error ? err.message : '追加に失敗しました',
        type: 'error',
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/randomsongs/${collection}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('削除に失敗しました');

      await fetchSongs();
      setStatus({ message: '削除成功', type: 'success' });
    } catch (err: unknown) {
      setStatus({
        message: err instanceof Error ? err.message : '削除に失敗しました',
        type: 'error',
      });
    }
  };

  const handleEdit = (song: Song) => {
    setEditId(song._id ?? null);
    setEditForm(song);
  };

  const handleUpdate = async () => {
    if (!editId) return;
    try {
      const res = await fetch(`/api/randomsongs/${collection}/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      if (!res.ok) throw new Error('編集に失敗しました');

      setEditId(null);
      setEditForm(collection === 'taiko' ? { difficulties: {} } : { difficulties: {} });
      await fetchSongs();
      setStatus({ message: '編集成功', type: 'success' });
    } catch (err: unknown) {
      setStatus({
        message: err instanceof Error ? err.message : '編集に失敗しました',
        type: 'error',
      });
    }
  };

  const taikoGenres = ['namco', 'gamemusic', 'classic', 'pops', 'anime', 'kids', 'variety', 'vocaloid'] as const;

  const difficulties =
    collection === 'taiko'
      ? (['easy', 'normal', 'hard', 'oni', 'edit'] as const)
      : (['easy', 'normal', 'hard', 'expert', 'master', 'append'] as const);

  const filteredSongs = useMemo(() => {
    return songs.filter(song =>
      !search
        ? true
        : collection === 'taiko'
        ? (song as TaikoForm).title?.toLowerCase().includes(search.toLowerCase())
        : (song as PrskForm).name?.toLowerCase().includes(search.toLowerCase())
    );
  }, [songs, search, collection]);

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
          value={collection === 'taiko' ? ((form as TaikoForm).title ?? '') : ((form as PrskForm).name ?? '')}
          onChange={e =>
            setForm(f =>
              collection === 'taiko'
                ? { ...(f as TaikoForm), title: e.target.value }
                : { ...(f as PrskForm), name: e.target.value }
            )
          }
          className={styles.titleBox}
        />
      </div>

      {collection === 'taiko' && (
        <div className={styles.formRow}>
          <select
            value={(form as TaikoForm).genre ?? ''}
            onChange={e => setForm(f => ({ ...(f as TaikoForm), genre: e.target.value }))}
            className={styles.titleBox}
          >
            <option value="">ジャンルを選択</option>
            {taikoGenres.map(genre => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className={styles.formRow}>
        {difficulties.map(dif => (
          <input
            key={dif}
            placeholder={dif}
            type="number"
            value={
              collection === 'taiko'
                ? (form as TaikoForm).difficulties[dif as keyof TaikoDifficulties] ?? ''
                : (form as PrskForm).difficulties[dif as keyof PrskDifficulties] ?? ''
            }
            onChange={e => {
              const value = Number(e.target.value);
              if (collection === 'taiko') {
                setForm(f => updateDifficulty(f as TaikoForm, dif as keyof TaikoDifficulties, value));
              } else {
                setForm(f => updateDifficulty(f as PrskForm, dif as keyof PrskDifficulties, value));
              }
            }}
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
              <tr key={song._id ?? Math.random()}>
                <td className={styles.title}>
                  <input
                    value={
                      collection === 'taiko'
                        ? (editForm as TaikoForm).title ?? ''
                        : (editForm as PrskForm).name ?? ''
                    }
                    onChange={e =>
                      setEditForm(f =>
                        collection === 'taiko'
                          ? { ...(f as TaikoForm), title: e.target.value }
                          : { ...(f as PrskForm), name: e.target.value }
                      )
                    }
                    className={styles.titleBox}
                  />
                </td>

                {difficulties.map(dif => (
                  <td key={dif} className={styles.diff}>
                    <input
                      type="number"
                      value={
                        collection === 'taiko'
                          ? (editForm as TaikoForm).difficulties[dif as keyof TaikoDifficulties] ?? ''
                          : (editForm as PrskForm).difficulties[dif as keyof PrskDifficulties] ?? ''
                      }
                      onChange={e => {
                        const value = Number(e.target.value);
                        if (collection === 'taiko') {
                          setEditForm(f => updateDifficulty(f as TaikoForm, dif as keyof TaikoDifficulties, value));
                        } else {
                          setEditForm(f => updateDifficulty(f as PrskForm, dif as keyof PrskDifficulties, value));
                        }
                      }}
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
              <tr key={song._id ?? Math.random()}>
                <td className={styles.title}>
                  {collection === 'taiko' ? (song as TaikoForm).title : (song as PrskForm).name}
                </td>
                {difficulties.map(dif => (
                  <td key={dif} className={styles.diff}>
                    {collection === 'taiko'
                      ? (song as TaikoForm).difficulties[dif as keyof TaikoDifficulties] ?? ''
                      : (song as PrskForm).difficulties[dif as keyof PrskDifficulties] ?? ''}
                  </td>
                ))}
                <td className={styles.action}>
                  <div className={styles.actionBtns}>
                    <button onClick={() => handleEdit(song)}>編集</button>
                    <button onClick={() => song._id && handleDelete(song._id)}>削除</button>
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
