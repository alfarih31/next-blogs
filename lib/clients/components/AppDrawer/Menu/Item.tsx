import type { NavigationConfig } from '$dto/config';
import React from 'react';
import Link from 'next/link';
import classNames from 'classnames';
import { Icon, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';

export default function MenuItem({ item }: { item: NavigationConfig }) {
  const { title, linkTo, icon, omit, onClick } = item;

  let iconEl;
  switch (typeof icon) {
    case 'string':
      iconEl = <Icon>{icon}</Icon>;
      break;
    case 'object':
      if (React.isValidElement(icon)) {
        iconEl = icon;
      }
      break;
    default:
      iconEl = <div />;
      break;
  }

  return (
    <Link href={linkTo || '/'} as={linkTo || '/'} passHref>
      <ListItemButton
        component="a"
        onClick={onClick}
        className={classNames('DrawerMenu__Item', { 'display-hidden': omit === true })}
      >
        {icon && <ListItemIcon className="Item__Icon">{iconEl}</ListItemIcon>}
        <ListItemText classes={{ primary: 'Item__Text' }} primary={title} />
      </ListItemButton>
    </Link>
  );
}
