'use client';

import dynamic from 'next/dynamic';

const Navigation = dynamic(() => import('./Navigation'), {
  ssr: false,
  loading: () => null,
});

export default function NavigationWrapper() {
  return <Navigation />;
}