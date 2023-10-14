import type { ReactElement } from 'react';
import React, { useMemo } from 'react';
import classNames from 'classnames';
import type { NavigationConfig } from '$dto/config';
import { AppBar, IconButton, Toolbar, useScrollTrigger } from '@mui/material';
import { Menu } from '@mui/icons-material';
import { useRouterPath } from '$clients/hooks';
import navigationConfig from '$configs/navigation.config';
import { appConfig } from '$configs/app.config';

function ElevationScroll({ children, window }: { children: ReactElement; window: Window }) {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window,
  });

  return React.cloneElement(children, {
    elevation: trigger ? 5 : 0,
  });
}

export default function Appbar({
  drawerOpen = false,
  toggleDrawer,
  ...props
}: {
  drawerOpen: boolean;
  toggleDrawer: () => void;
} & KeyValue) {
  const path = useRouterPath();

  const findNavConfig = (navConfigs: NavigationConfig[]): NavigationConfig | undefined => {
    for (let i = 0; i < navConfigs.length; i += 1) {
      const nav = navConfigs[i];
      if (nav.linkTo && nav.linkTo === path) {
        return nav;
      }

      if (nav.children) {
        const found = findNavConfig(nav.children);

        if (found) {
          return found;
        }
      }
    }
  };

  const thisNavConfig = useMemo(() => findNavConfig(navigationConfig), [path]);

  return (
    <>
      <ElevationScroll window={props.window}>
        <AppBar position="fixed" className={classNames('AppBar', { DrawerOpen: drawerOpen })}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="AppBar AppDrawer"
              onClick={toggleDrawer}
              edge="start"
              className="MenuIcon"
            >
              <Menu />
            </IconButton>
            {thisNavConfig ? thisNavConfig.title : appConfig.APP_NAME}
          </Toolbar>
        </AppBar>
      </ElevationScroll>
      <Toolbar />
    </>
  );
}
