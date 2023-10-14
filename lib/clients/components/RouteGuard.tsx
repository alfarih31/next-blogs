import { ReactElement, useEffect } from 'react';
import { homePath, loginPath } from '$configs/clients/route.client.config';
import { useRouter } from 'next/router';
import PageLoader from '$clients/components/PageLoader';
import { useLogoutMutation, useRefreshSessionQuery } from '$clients/api';
import { HttpStatusCode } from 'axios';
import { useRouteConfig } from '$clients/hooks';
import { HttpError } from '$lib/http-error';
import ErrorPage from './Error';

export const usePagePermission = (): {
  isAllowed: boolean;
  isLoading: boolean;
  path: string;
  session?: Session;
  error?: unknown;
} => {
  const [path, routeConfig] = useRouteConfig();
  const { data, isLoading, isError, error, refetch: refreshSession } = useRefreshSessionQuery();

  useEffect(() => {
    refreshSession();
  }, [path]);

  const result: ReturnType<typeof usePagePermission> = {
    isAllowed: false,
    isLoading,
    session: undefined,
    path,
    error,
  };

  if (isLoading) {
    return result;
  }
  result.isLoading = false;

  if (isError && error) {
    return result;
  }

  if (data) {
    result.session = data.data;
  }

  if (path === loginPath && result.session) {
    result.isAllowed = !result.session.authenticated;
    return result;
  }

  let permissions: number[] | undefined;
  if (routeConfig && routeConfig.permissions) {
    if (routeConfig.permissions.length > 0) {
      permissions = routeConfig.permissions;
    }
  }

  if (permissions) {
    if (!result.session) {
      result.isAllowed = false;
      return result;
    }

    result.isAllowed = !!result.session && permissions.includes(result.session.role);
    return result;
  }

  result.isAllowed = true;
  return result;
};

export default function RouteGuard({ children }: { children: ReactElement }) {
  const { isAllowed, isLoading, session, error, path } = usePagePermission();
  const [logout, { isLoading: isLogoutLoading }] = useLogoutMutation();
  const router = useRouter();

  if (isLoading || isLogoutLoading) {
    return <PageLoader />;
  }

  if (error) {
    if (error instanceof HttpError) {
      if (error.status === HttpStatusCode.Unauthorized) {
        logout();
      }

      return <ErrorPage statusCode={error.status} message={error.message} />;
    }

    return <ErrorPage statusCode={HttpStatusCode.InternalServerError} message={error.toString()} />;
  }

  if (!isAllowed) {
    // Handle for authenticated user
    if (session && session.authenticated) {
      if (path === loginPath) {
        router.replace({ pathname: homePath }, undefined, { shallow: true });
        return <PageLoader />;
      }
      return <ErrorPage statusCode={HttpStatusCode.Unauthorized} message="Unauthorized" />;
    }

    // Handle for unauthenticated user
    if (path !== loginPath) {
      router.replace({ pathname: loginPath }, undefined, { shallow: true });
      return <PageLoader />;
    }
  }

  return children;
}
