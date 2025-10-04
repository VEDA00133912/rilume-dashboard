'use client';
import React from 'react';
import styles from '@/css/dashboard/RandomSongs/StatusMessage.module.css';

type StatusMessageProps = {
  message: string;
  type?: 'success' | 'error' | 'info';
};

export default function StatusMessage({
  message,
  type = 'info',
}: StatusMessageProps) {
  return <div className={`${styles.message} ${styles[type]}`}>{message}</div>;
}
