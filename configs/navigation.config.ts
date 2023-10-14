import type { NavigationConfig } from '$dto/config';
import { logout, showSnackbar } from '$clients/stores/redux/actions';
import { homePath } from './route.config';

const navigationConfig: NavigationConfig[] = [
  {
    id: 'home',
    title: 'Home',
    linkTo: homePath,
    icon: 'home',
  },
  {
    id: 'my-blog',
    title: 'My Blog',
    linkTo: '/admin/my-blog',
    children: [
      {
        id: 'create-blog',
        title: 'Create Blog',
        linkTo: '/admin/my-blog/create',
      },
    ],
  },
  {
    id: 'logout',
    title: 'Logout',
    onClick: () => logout().then(() => showSnackbar('Logged out...')),
  },
];

export default navigationConfig;
