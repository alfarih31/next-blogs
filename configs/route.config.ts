import type { RouteConfig } from '$dto/config';
import { USER_ROLE } from '$lib/CONSTANTS';

export const homePath = '/admin';
export const loginPath = '/admin/login';

const routeConfig: { [key: string]: RouteConfig } = {
  [`${homePath}/(!${loginPath})*`]: {
    fullLayout: false,
    permissions: [USER_ROLE.PERSONAL],
  },
};

export default routeConfig;
