'use client';

import dynamic from 'next/dynamic';
import NavigationPlaceholder from './NavigationPlaceholder';

const Navigation = dynamic(() => import('./Navigation'), {
  ssr: false,
  loading: () => <NavigationPlaceholder />,
});

export default function NavigationWrapper() {
  return <Navigation />;
}