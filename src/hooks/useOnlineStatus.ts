import { useState, useEffect } from 'react';
import { firestore } from '../lib/firebase';
import { enableNetwork, disableNetwork } from 'firebase/firestore';

export function useOnlineStatus() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      enableNetwork(firestore).catch(console.error);
    };

    const handleOffline = () => {
      setIsOffline(true);
      disableNetwork(firestore).catch(console.error);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOffline;
}