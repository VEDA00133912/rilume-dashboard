// app/dashboard/Settings/page.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import SettingsPageClient from './SettingsPage';

export default async function SettingsPage() {
  const cookieStore = await cookies();
  const adminAuth = cookieStore.get('admin_auth');

  if (!adminAuth) {
    redirect('/');
  }

  return <SettingsPageClient />;
}
