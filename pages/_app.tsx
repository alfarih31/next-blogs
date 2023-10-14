import type { NextRouter } from 'next/router';
import type { AppContext, AppInitialProps } from 'next/app';
import NextApp from 'next/app';
import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { Provider } from 'react-redux';
import store from '$clients/stores/redux';
import PageLoader from '$clients/components/PageLoader';
import { useRouteConfig } from '$clients/hooks';
import { appClientConfig } from '$configs/clients/app.client.config';

function App({
  pageProps,
  Component,
  router,
}: {
  pageProps: Record<string, unknown>;
  Component: NextPage;
  router: NextRouter;
}) {
  const [, routeConfig] = useRouteConfig();

  let Layout = dynamic(() => import('./_layout/FullPageLayout'), { loading: PageLoader });

  if (routeConfig) {
    if (!routeConfig.fullLayout && router.pathname !== '/error/[code]') {
      Layout = dynamic(() => import('./_layout/VerticalLayout'), { loading: PageLoader });
    }
  }

  const RouteGuard = dynamic(() => import('$clients/components/RouteGuard'), { loading: PageLoader });

  return (
    <>
      <Head>
        <title>{appClientConfig.APP_NAME}</title>
      </Head>
      <Provider store={store}>
        <Layout>
          <RouteGuard>
            <Component {...pageProps} />
          </RouteGuard>
        </Layout>
      </Provider>
    </>
  );
}

App.getInitialProps = async (ctx: AppContext): Promise<AppInitialProps> => {
  const props: AppInitialProps = {
    pageProps: {},
  };

  Object.assign(props, await NextApp.getInitialProps(ctx));

  if (ctx.Component.getInitialProps) {
    Object.assign(props.pageProps, await ctx.Component.getInitialProps(ctx.ctx));
  }

  return props;
};

export default App;
