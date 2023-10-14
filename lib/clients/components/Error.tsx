import { NextPageContext } from 'next';
import { Button, Typography } from '@mui/material';
import { Home } from '@mui/icons-material';
import { homePath } from '$configs/route.config';
import Link from 'next/link';

const ErrorMessageMap: { [key: number]: string } = {
  100: 'Continue',
  101: 'SwitchingProtocols',
  102: 'Processing',
  103: 'EarlyHints',
  200: 'OK',
  201: 'Created',
  202: 'Accepted',
  203: 'NonAuthoritativeInfo',
  204: 'NoContent',
  205: 'ResetContent',
  206: 'PartialContent',
  207: 'MultiStatus',
  208: 'AlreadyReported',
  226: 'IMUsed',
  300: 'MultipleChoices',
  301: 'MovedPermanently',
  302: 'Found',
  303: 'SeeOther',
  304: 'NotModified',
  305: 'UseProxy',
  306: '_',
  307: 'TemporaryRedirect',
  308: 'PermanentRedirect',
  400: 'BadRequest',
  401: 'Unauthorized',
  402: 'PaymentRequired',
  403: 'Forbidden',
  404: 'NotFound',
  405: 'MethodNotAllowed',
  406: 'NotAcceptable',
  407: 'ProxyAuthRequired',
  408: 'RequestTimeout',
  409: 'Conflict',
  410: 'Gone',
  411: 'LengthRequired',
  412: 'PreconditionFailed',
  413: 'RequestEntityTooLarge',
  414: 'RequestURITooLong',
  415: 'UnsupportedMediaType',
  416: 'RequestedRangeNotSatisfiable',
  417: 'ExpectationFailed',
  418: 'Teapot',
  421: 'MisdirectedRequest',
  422: 'UnprocessableEntity',
  423: 'Locked',
  424: 'FailedDependency',
  425: 'TooEarly',
  426: 'UpgradeRequired',
  428: 'PreconditionRequired',
  429: 'TooManyRequests',
  431: 'RequestHeaderFieldsTooLarge',
  451: 'UnavailableForLegalReasons',

  500: 'InternalServerError',
  501: 'NotImplemented',
  502: 'BadGateway',
  503: 'ServiceUnavailable',
  504: 'GatewayTimeout',
  505: 'HTTPVersionNotSupported',
  506: 'VariantAlsoNegotiates',
  507: 'InsufficientStorage',
  508: 'LoopDetected',
  510: 'NotExtended',
  511: 'NetworkAuthenticationRequired',
};

function Error({ statusCode, message = '' }: { statusCode: number; message: string }) {
  return (
    <div style={{ padding: '1rem' }}>
      <Typography variant="h1" style={{ paddingRight: '1rem' }}>
        {statusCode}
      </Typography>
      <Typography variant="body1" style={{ paddingLeft: '1rem' }}>
        {message}
      </Typography>

      <Link href={homePath}>
        <Button style={{ marginTop: '1rem' }}>
          <Home />
          <Typography variant="button">Back to home</Typography>
        </Button>
      </Link>
    </div>
  );
}

Error.getInitialProps = (ctx: NextPageContext) => {
  const statusCode = ctx.res?.statusCode || 204;
  const message = ctx.err?.message || ErrorMessageMap[statusCode];
  return { statusCode, message };
};

export default Error;
