'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function TrackRoute() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;

    fetch(`http://10.10.50.93:5000/track_visit?page=${encodeURIComponent(pathname)}`, {
      method: 'GET',
      credentials: 'include',
    }).catch(err => console.error('Tracking error:', err));
  }, [pathname]); // runs every time the route changes

  return null;
}
