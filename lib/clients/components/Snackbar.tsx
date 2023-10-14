import type { ForwardedRef, PropsWithChildren } from 'react';
import { forwardRef } from 'react';
import { hideSnackbar } from '$clients/stores/redux/actions';
import type { State } from '$clients/stores';
import { connect } from 'react-redux';
import { SnackbarState } from '$dto/redux';
import MuiSnackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

const Alert = forwardRef((props: PropsWithChildren<AlertProps>, ref: ForwardedRef<HTMLDivElement>) => (
  <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
));
Alert.displayName = 'Alert';

function Snackbar({ snackbar }: { snackbar: SnackbarState }) {
  const onClose = () => hideSnackbar();

  return (
    <MuiSnackbar open={snackbar.show} autoHideDuration={3000} onClose={onClose}>
      <Alert onClose={onClose} severity={snackbar.severity} sx={{ width: '100%' }}>
        {snackbar.message}
      </Alert>
    </MuiSnackbar>
  );
}

export default connect((s: State) => ({ snackbar: s.uiState.snackbar }))(Snackbar);
