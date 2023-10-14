export type Action = {
  type: number;
  payload?: any;
};

export type UIState = {
  snackbar: SnackbarState;
};

type SnackbarSeverity = 'error' | 'warning' | 'info' | 'success';

export type SnackbarState = {
  show: boolean;
  message: string;
  severity: SnackbarSeverity;
};
