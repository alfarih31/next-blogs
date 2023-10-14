import type { RouteConfig } from '$dto/config';
import { USER_ROLE } from '$lib/CONSTANTS';

export const homePath = '/admin/dashboard/blogs';
export const loginPath = '/admin/login';

const routeClientConfig: RouteConfig[] = [
  {
    path: new RegExp(`^${homePath}.*`),
    fullLayout: false,
    permissions: [USER_ROLE.PERSONAL],
  },
];

export default routeClientConfig;
