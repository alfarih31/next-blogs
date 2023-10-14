import type { SnackbarSeverity } from '$dto/redux';
import { SHOW_SNACKBAR, HIDE_SNACKBAR } from '../events';
import store from '../index';

const { dispatch } = store;

export const showSnackbar = (message: string, severity: SnackbarSeverity = 'success') => {
  dispatch({ type: SHOW_SNACKBAR, payload: { message, severity } });
};

export const hideSnackbar = () => {
  dispatch({ type: HIDE_SNACKBAR });
};
