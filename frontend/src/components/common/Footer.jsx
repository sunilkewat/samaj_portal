import React from 'react';
import { Box, Container, Typography } from '@mui/material';

export default function Footer() {
  return (
    <Box sx={{ bgcolor: '#0f172a', color: '#94a3b8', py: 4, mt: 'auto', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
      <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
        <Typography variant="body2" sx={{ color: '#e2e8f0', fontWeight: 600 }}>
          अखिल भारतीय समाज कल्याण संगठन • सर्वाधिकार सुरक्षित © 2026
        </Typography>
        <Typography variant="caption" sx={{ color: '#64748b', mt: 1, display: 'block' }}>
          Empowering community connection with transparency and modern technology.
        </Typography>
      </Container>
    </Box>
  );
}
