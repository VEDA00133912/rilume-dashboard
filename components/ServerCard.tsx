'use client';
import { useState } from 'react';
import Image from 'next/image';
import styles from '../css/dashboard/ManageServers/ServerCard.module.css';
import GuildModal from './GuildModal';

type GuildProps = {
  guild?: {
    id: string;
    name: string;
    icon?: string | null;
  };
};

export default function ServerCard({ guild }: GuildProps) {
  const [open, setOpen] = useState(false);

  if (!guild) return null;

  const iconUrl = guild.icon
    ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`
    : 'https://cdn.discordapp.com/embed/avatars/0.png';

  return (
    <>
      <div className={styles.card} onClick={() => setOpen(true)}>
        <div className={styles.iconWrapper}>
          <Image
            src={iconUrl}
            alt="icon"
            width={64}
            height={64}
            className={styles.icon}
          />
        </div>
        <h3 className={styles.name}>{guild.name ?? '不明なサーバー'}</h3>
        <p className={styles.id}>ID: {guild.id ?? '不明'}</p>
      </div>
      {open && <GuildModal guildId={guild.id} onClose={() => setOpen(false)} />}
    </>
  );
}
