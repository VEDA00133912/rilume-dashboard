'use client';

import { useState } from 'react';
import styles from '@/css/dashboard/Settings/Page.module.css';
import WebhookModal from '@/components/WebhookModal';
import ExpandsModal from '@/components/ExpandModal';
import ImpersonateModal from '@/components/ImpersonateModal';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function SettingsPageClient() {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const openModal = (type: string) => setActiveModal(type);
  const closeModal = () => setActiveModal(null);

  return (
    <>
      <Header />
      <div className={styles.container}>
        <h1 className={styles.title}>Settings</h1>
        <div className={styles.cardGrid}>
          <div className={styles.card} onClick={() => openModal('webhook')}>
            <h2>Webhook Settings</h2>
            <p>Webhookの設定を確認・変更します</p>
          </div>
          <div className={styles.card} onClick={() => openModal('expands')}>
            <h2>Expands Settings</h2>
            <p>サーバーのExpand設定を確認します</p>
          </div>
          <div className={styles.card} onClick={() => openModal('impersonate')}>
            <h2>Impersonate Settings</h2>
            <p>Impersonateの状態を確認します</p>
          </div>
        </div>

        {activeModal === 'webhook' && <WebhookModal onClose={closeModal} />}
        {activeModal === 'expands' && <ExpandsModal onClose={closeModal} />}
        {activeModal === 'impersonate' && (
          <ImpersonateModal onClose={closeModal} />
        )}
      </div>
      <Footer />
    </>
  );
}
