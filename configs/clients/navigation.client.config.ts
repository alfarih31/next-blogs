import type { NavigationConfig } from '$dto/config';
import { logout, showSnackbar } from '$clients/stores/redux/actions';
import { homePath } from './route.client.config';

const navigationClientConfig: NavigationConfig[] = [
  {
    id: 'home',
    title: 'Home',
    linkTo: homePath,
    icon: 'home',
  },
  {
    id: 'logout',
    title: 'Logout',
    onClick: () => logout().then(() => showSnackbar('Logged out...')),
  },
];

export default navigationClientConfig;
