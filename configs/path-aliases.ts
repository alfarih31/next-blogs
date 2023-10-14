import type { PathAlias } from '$dto/config';

const pathAliases: PathAlias[] = [
  {
    to: '/',
    from: '/example',
  },
  {
    to: '/',
    from: '/alias',
  },
];

export default pathAliases;
