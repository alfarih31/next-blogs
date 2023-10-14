import { LinearProgress } from '@mui/material';

export default function PageLoader() {
  return (
    <div style={{ position: 'fixed', top: '0', left: '0', width: '100%', paddingBottom: '0.1rem', zIndex: 101 }}>
      <LinearProgress />
    </div>
  );
}
