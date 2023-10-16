import type { ReactElement } from 'react';
import Snackbar from '$clients/components/Snackbar';
import { SpeedDial, SpeedDialAction, SpeedDialIcon } from '@mui/material';
import { AppRegistration, Home, Login } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { homePath, loginPath, registerPath } from '$configs/clients/route.client.config';

export default function FullPageLayout({ children }: { children: ReactElement }) {
  const router = useRouter();
  return (
    <>
      <main className="MainFullLayout">
        {children}
        <SpeedDial
          sx={{ position: 'fixed', bottom: '1rem', right: '1rem' }}
          ariaLabel="SpeedDial playground example"
          icon={<SpeedDialIcon />}
          direction="up"
        >
          <SpeedDialAction icon={<Home />} tooltipTitle="Home" onClick={() => router.push(homePath)} />
          <SpeedDialAction
            icon={<AppRegistration />}
            tooltipTitle="Register"
            onClick={() => router.push(registerPath)}
          />
          <SpeedDialAction icon={<Login />} tooltipTitle="Login" onClick={() => router.push(loginPath)} />
        </SpeedDial>
      </main>
      <Snackbar />
    </>
  );
}
