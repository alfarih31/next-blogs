import type { ReactElement } from 'react';

type MaybePromise<T> = T | Promise<T>;

export interface NavigationConfig {
  id: string;
  title: string;
  icon?: string | ReactElement;
  linkTo?: string;
  onClick?: () => MaybePromise<void>;
  expanded?: boolean;
  children?: NavigationConfig[]
  permissions?: number[]
  omit?: boolean
}


export interface RouteConfig {
  path: string | RegExp;
  permissions?: number[];
  fullLayout?: boolean;
}

export interface PathAlias {
  to: string;
  from: string;
}
