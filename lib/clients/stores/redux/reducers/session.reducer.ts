/* eslint-disable @typescript-eslint/default-param-last */

import { Action } from '$dto/redux';
import { UPDATE_SESSION } from '$clients/stores/redux/events';

const initState: Session = {
  authenticated: false,
  role: 0,
  userID: 0,
};

const session = (prevState: Session = initState, action: Action): Session => {
  switch (action.type) {
    case UPDATE_SESSION:
      return action.payload;
    default:
      return prevState;
  }
};

export default session;
