import Link from 'next/link';
import { Typography } from '@mui/material';
import Img from 'next/image';
import Logo from '$assets/img/logo.png';
import { appConfig } from '$configs/app.config';

export default function DrawerHeader() {
  return (
    <div className="DrawerHeader">
      <Link href="/">
        <Img src={Logo} alt={appConfig.APP_NAME} />
        <Typography variant="h6" className="DrawerHeader__Title">
          {appConfig.APP_NAME}
        </Typography>
      </Link>
    </div>
  );
}
