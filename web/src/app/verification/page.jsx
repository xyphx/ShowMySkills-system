'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/apiClient';

export default function VerificationPage() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    authService.getCurrentUser().then((user) => {
      if (isMounted) {
        if (user) {
          setItems([
            {
              title: 'Email Verification',
              description: 'Verify your email address using OTP.',
              icon: '✉',
              status: user.emailVerified || user.isEmailVerified ? 'Completed' : 'Pending',
            },
            {
              title: 'Phone Verification',
              description: 'Verify your phone number.',
              icon: '☎',
              status: user.phoneVerified ? 'Completed' : 'Pending',
            },
            {
              title: 'College ID Verification',
              description: 'Verify your college identity document.',
              icon: '🎓',
              status: user.collegeIdVerified || user.verified ? 'Completed' : 'Pending',
            },
          ]);
        } else {
          setItems([]);
        }
        setLoading(false);
      }
    }).catch(() => {
      if (isMounted) setLoading(false);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 px-4 py-10 md:px-8">
      <div className="mx-auto max-w-3xl">

        <button
          onClick={() => router.push('/student/internships')}
          className="mb-6 text-sm font-medium text-teal-700 hover:text-teal-900 cursor-pointer"
        >
          ← Back to Internships
        </button>

        <section className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-teal-600">
            Student Account
          </p>

          <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
            Verification Centre
          </h1>

          <p className="mt-3 text-slate-600">
            Complete your verification steps to establish your student identity on ShowMySkills.
          </p>
        </section>

        <section className="space-y-4">
          {loading ? (
            <div className="space-y-3">
              <div className="h-24 bg-white rounded-2xl animate-pulse border border-slate-100" />
              <div className="h-24 bg-white rounded-2xl animate-pulse border border-slate-100" />
              <div className="h-24 bg-white rounded-2xl animate-pulse border border-slate-100" />
            </div>
          ) : items.length > 0 ? (
            items.map((item) => (
              <article
                key={item.title}
                className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:flex-row sm:items-center"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-2xl">
                  {item.icon}
                </div>

                <div className="flex-1">
                  <h2 className="font-semibold text-slate-900">
                    {item.title}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {item.description}
                  </p>
                </div>

                <span
                  className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                    item.status === 'Completed'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-amber-50 text-amber-700'
                  }`}
                >
                  {item.status}
                </span>
              </article>
            ))
          ) : (
            <div className="p-8 text-center text-slate-500 bg-white rounded-2xl border border-slate-100">
              Please sign in to view and manage your identity verifications.
            </div>
          )}
        </section>

      </div>
    </main>
  );
}