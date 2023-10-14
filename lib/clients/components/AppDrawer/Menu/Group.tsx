import React, { useState } from 'react';
import type { NavigationConfig } from '$dto/config';
import classNames from 'classnames';
import { Collapse, List, ListItem, ListItemIcon, ListItemText, Icon } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
// eslint-disable-next-line import/no-cycle
import { MenuBuilder } from './index';

type Props = {
  group: NavigationConfig;
};

export default function MenuGroup({ group }: Props) {
  const { title, icon, omit, expanded } = group;

  const [open, setOpen] = useState(expanded === true);

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

  let { children } = group;

  if (!Array.isArray(children)) {
    children = [];
  }

  return (
    <div className={classNames('DrawerMenu__Group', { 'display-hidden': omit === true })}>
      <ListItem className="DrawerMenu__Item" onClick={() => setOpen(!open)} button>
        {icon && <ListItemIcon className="Item__Icon">{iconEl}</ListItemIcon>}
        <ListItemText classes={{ primary: 'Item__Text' }} primary={title} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding className="SubGroup">
          <MenuBuilder menu={children} />
        </List>
      </Collapse>
    </div>
  );
}
