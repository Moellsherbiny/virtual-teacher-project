import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation';
import React from 'react'

async function ResultsLayout({ children }: { children: React.ReactNode }) {
  const sesstion = await auth();
  if (!sesstion)
    redirect('/auth/login');
  else
    return (
      <>
        {children}
      </>
    )
}

export default ResultsLayout
