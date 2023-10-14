let c = -1;

const iota = () => {
  c += 1;

  return c;
};

export const UPDATE_SESSION = iota();

export const SHOW_SNACKBAR = iota();
export const HIDE_SNACKBAR = iota();
