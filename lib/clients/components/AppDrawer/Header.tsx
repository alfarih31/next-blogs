import Link from 'next/link';
import { Typography } from '@mui/material';
import Img from 'next/image';
import Logo from '$assets/img/logo.png';
import { appClientConfig } from '$configs/clients/app.client.config';

export default function DrawerHeader() {
  return (
    <div className="DrawerHeader">
      <Link href="/">
        <Img src={Logo} alt={appClientConfig.APP_NAME} />
        <Typography variant="h6" className="DrawerHeader__Title">
          {appClientConfig.APP_NAME}
        </Typography>
      </Link>
    </div>
  );
}
