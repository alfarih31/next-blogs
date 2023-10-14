import { ReactElement, useState } from 'react';
import classNames from 'classnames';
import CssBaseline from '@mui/material/CssBaseline';
import Appbar from '$clients/components/Appbar';
import AppDrawer from '$clients/components/AppDrawer';
import Footer from '$clients/components/Footer';
import Snackbar from '$clients/components/Snackbar';

export default function VerticalLayout({ children }: { children: ReactElement }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => setDrawerOpen(!drawerOpen);

  return (
    <>
      <CssBaseline />
      <Appbar toggleDrawer={toggleDrawer} drawerOpen={drawerOpen} />
      <AppDrawer toggleDrawer={toggleDrawer} drawerOpen={drawerOpen} />
      <main className={classNames('Main', { DrawerOpen: drawerOpen })}>{children}</main>
      <Footer className={classNames({ DrawerOpen: drawerOpen })} />
      <Snackbar />
    </>
  );
}
