import { Drawer, IconButton, Divider } from '@mui/material';
import { ChevronLeft } from '@mui/icons-material';

import DrawerHeader from './Header';
import DrawerMenu from './Menu';

export default function AppDrawer({ drawerOpen, toggleDrawer }: { drawerOpen: boolean; toggleDrawer: () => void }) {
  return (
    <Drawer className="Drawer" variant="persistent" anchor="left" open={drawerOpen} classes={{ paper: 'DrawerPaper' }}>
      <div className="DrawerControl">
        <IconButton onClick={toggleDrawer} edge="end">
          <ChevronLeft />
        </IconButton>
      </div>

      <Divider />

      <div className="DrawerContent">
        <DrawerHeader />

        <DrawerMenu />
      </div>
    </Drawer>
  );
}
