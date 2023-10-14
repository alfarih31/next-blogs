import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export const useRouterPath = () => {
  const router = useRouter();
  const [path, setPath] = useState(router.pathname);
  const listenToPopstate = () => {
    if (typeof window !== 'undefined') {
      return setPath(window.location.pathname);
    }
    setPath(router.pathname);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('popstate', listenToPopstate);
      return () => {
        window.removeEventListener('popstate', listenToPopstate);
      };
    }

    router.events.on('routeChangeComplete', listenToPopstate);

    return () => {
      router.events.off('routeChangeComplete', listenToPopstate);
    };
  }, []);

  return path;
};
