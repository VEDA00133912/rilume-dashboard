import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import BotInfoPageClient from './BotInfoPage';

export default async function InfoPage() {
  const cookieStore = await cookies();
  const auth = cookieStore.get('admin_auth');

  if (!auth || auth.value !== 'true') {
    redirect('/');
  }

  return <BotInfoPageClient />;
}
