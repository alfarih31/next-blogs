import { RouteConfig } from '$dto/config';
import routeConfig from '$configs/route.config';
import { pathToRegexp } from 'path-to-regexp';
import { useRouterPath } from './use-router-path';

export const useRouteConfig = (): [string, RouteConfig | undefined] => {
  const path = useRouterPath();

  const matchedPath = Object.keys(routeConfig).find((thisPath) => {
    const matches = pathToRegexp(thisPath).exec(path);
    if (matches) {
      return matches.length > 0;
    }

    return false;
  });

  if (!matchedPath) {
    return [path, undefined];
  }

  return [path, routeConfig[matchedPath]];
};
