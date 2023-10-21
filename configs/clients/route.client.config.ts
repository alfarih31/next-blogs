import type { RouteConfig } from '$dto/config';
import { USER_ROLE } from '$lib/CONSTANTS';

export const homePath = '/';
export const dashboardPath = "/admin/dashboard/blogs"
export const loginPath = '/admin/login';
export const registerPath = '/admin/register';

const routeClientConfig: RouteConfig[] = [
  {
    path: new RegExp(`^${dashboardPath}.*`),
    fullLayout: false,
    permissions: [USER_ROLE.PERSONAL],
  },
];

export default routeClientConfig;
