import type { ReactElement } from 'react';
import type { State } from '$clients/stores/redux';
import type { NavigationConfig } from '$dto/config';
import { connect } from 'react-redux';
import { List } from '@mui/material';
import navigationClientConfig from '$configs/clients/navigation.client.config';
import MenuItem from './Item';
// eslint-disable-next-line import/no-cycle
import MenuGroup from './Group';

type Props = {
  menu: NavigationConfig[];
  session: Session;
};

export const MenuBuilder = connect((state: State) => ({ session: state.session }))(({
  menu = [],
  session,
}: Props): ReactElement | null => {
  const { role } = session;

  return (
    <>
      {menu.map((item) => {
        const { permissions } = item;
        if (Array.isArray(permissions) && role !== undefined) {
          if (!permissions.includes(role)) return null;
        }

        if (item.children && item.children.length > 0) {
          return <MenuGroup key={item.id} group={item} />;
        }
        return <MenuItem key={item.id} item={item} />;
      })}
    </>
  );
});

export default function DrawerMenu() {
  return (
    <List component="nav" className="DrawerMenu">
      <MenuBuilder menu={navigationClientConfig} />
    </List>
  );
}
