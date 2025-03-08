import { redirect } from 'next/navigation';

export default function Home() {
  // This page will be handled by the middleware
  // But we'll add a redirect as a fallback
  redirect('/login');
} 