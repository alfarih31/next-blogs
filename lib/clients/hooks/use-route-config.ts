import { RouteConfig } from '$dto/config';
import routeClientConfig from '$configs/clients/route.client.config';
import { pathToRegexp } from 'path-to-regexp';
import { useRouterPath } from './use-router-path';

export const useRouteConfig = (): [string, RouteConfig | undefined] => {
  const path = useRouterPath();

  const matchedPath = routeClientConfig.find(({ path: thisPath }) => {
    let pathRegExp: RegExp;
    if (typeof thisPath === 'string') {
      pathRegExp = pathToRegexp(thisPath);
    } else {
      pathRegExp = thisPath;
    }

    const matches = pathRegExp.exec(path);
    if (matches) {
      return matches.length > 0;
    }

    return false;
  });

  return [path, matchedPath];
};
