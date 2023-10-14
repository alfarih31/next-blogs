import type { ReactElement } from 'react';
import Snackbar from '$clients/components/Snackbar';

export default function FullPageLayout({ children }: { children: ReactElement }) {
  return (
    <>
      <main className="MainFullLayout">{children}</main>
      <Snackbar />
    </>
  );
}
