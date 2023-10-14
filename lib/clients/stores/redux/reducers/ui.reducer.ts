/* eslint-disable @typescript-eslint/default-param-last */
import type { Action, UIState } from '$lib/dto/redux';
import { HIDE_SNACKBAR, SHOW_SNACKBAR } from '../events';

const initState: UIState = {
  snackbar: {
    show: false,
    message: '',
    severity: 'success',
  },
};

const uiState = (prevState: UIState = initState, action: Action) => {
  switch (action.type) {
    case SHOW_SNACKBAR:
      return {
        ...prevState,
        snackbar: {
          ...action.payload,
          show: true,
        },
      };
    case HIDE_SNACKBAR:
      return {
        ...prevState,
        snackbar: initState.snackbar,
      };
    default:
      return prevState;
  }
};

export default uiState;
