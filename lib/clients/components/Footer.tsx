import React from 'react';
import { Divider } from '@mui/material';

export default function Footer({ className }: { className: string }) {
  return (
    <footer className={`Footer ${className}`}>
      <Divider />
      <div className="FooterContent">This is footer</div>
    </footer>
  );
}
