import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import BlackListPageClient from './BlackListPage';

export default async function BlackListPage() {
  const cookieStore = await cookies();
  const auth = cookieStore.get('admin_auth');

  // 認証されていなければリダイレクト
  if (!auth || auth.value !== 'true') {
    redirect('/');
  }

  // 認証済みならクライアントコンポーネントを表示
  return <BlackListPageClient />;
}
