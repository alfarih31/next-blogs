import type { DocumentProps } from 'next/document';
import { Head, Html, Main, NextScript } from 'next/document';
import { appClientConfig } from '$configs/clients/app.client.config';

export default function Document(props: DocumentProps) {
  const { head } = props;
  return (
    <Html>
      <Head>
        <meta name="description" content={appClientConfig.APP_NAME} />
        <link rel="icon" href="/assets/ico/favicon.ico" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
        {/* eslint-disable-next-line @next/next/no-css-tags */}
        <link rel="stylesheet" href="/assets/css/core.css" />

        {head && head.map((h) => h)}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
