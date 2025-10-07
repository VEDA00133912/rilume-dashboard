import { ReactNode } from 'react';
import styles from '@/css/dashboard/Settings/Modal.module.css';

export type ModalProps = {
  title: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
};

export default function Modal({ title, onClose, children, wide }: ModalProps) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={`${styles.modal} ${wide ? styles.wide : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <h2>{title}</h2>
          <button onClick={onClose} className={styles.close}>
            ×
          </button>
        </div>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
