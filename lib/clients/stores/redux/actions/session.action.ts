import { sessionApi } from '$clients/api';
import stores from '../index';

const { dispatch } = stores;

export const logout = async () => {
  dispatch(sessionApi.endpoints.logout.initiate());
};
