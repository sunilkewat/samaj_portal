import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { useTenant } from '../../context/TenantContext';

export default function Footer() {
  const { tenant } = useTenant();

  return (
    <Box sx={{ bgcolor: '#0f172a', color: '#94a3b8', py: 4, mt: 'auto', borderTop: `2px solid ${tenant.primaryColor}` }}>
      <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
        <Typography variant="body2" sx={{ color: '#e2e8f0', fontWeight: 700 }}>
          {tenant.name} • {tenant.trustName} • सर्वाधिकार सुरक्षित © 2026
        </Typography>
        <Typography variant="caption" sx={{ color: '#cbd5e1', mt: 0.8, display: 'block' }}>
          हेल्पलाइन: {tenant.helpline} • ईमेल: {tenant.email} • मुख्य कार्यालय: {tenant.headquarters}
        </Typography>
        <Typography variant="caption" sx={{ color: '#64748b', mt: 0.5, display: 'block', fontSize: '0.7rem' }}>
          Powered by Samaj Portal Multi-Tenant SaaS Platform • Empowering Communities Across India
        </Typography>
      </Container>
    </Box>
  );
}
