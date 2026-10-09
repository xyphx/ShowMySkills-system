import { signupConfig } from '@/config/signupConfig';
import { Signup } from '@/components/Signup';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return Object.keys(signupConfig).map((role) => ({
    role,
  }));
}

export default async function Page({ params }) {
  const { role } = await params; // Next.js 15 params unwrapping
  const config = signupConfig[role];

  if (!config) {
    notFound(); // Triggers 404 if someone types an invalid role in the URL
  }

  return <Signup role={role} config={config} />;
}