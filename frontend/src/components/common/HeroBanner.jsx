import React from 'react';
import { Box, Container, Typography, Chip, Tabs, Tab } from '@mui/material';
import { useTenant } from '../../context/TenantContext';

export default function HeroBanner({ activeTab, onTabChange }) {
  const { tenant } = useTenant();

  return (
    <Box sx={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', color: '#fff', py: 3.5, px: 2 }}>
      <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
        <Chip
          label={`आराध्य: ${tenant.ishtadev} • ${tenant.headquarters || 'अखिल भारतीय'}`}
          size="small"
          sx={{
            mb: 1.5,
            fontWeight: 800,
            bgcolor: 'rgba(255, 255, 255, 0.12)',
            color: '#fdba74',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        />
        <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, fontSize: { xs: '1.7rem', md: '2.4rem' } }}>
          {tenant.name}
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: '#cbd5e1', maxWidth: 700, mx: 'auto', mb: 2.5, fontSize: { xs: '0.9rem', md: '1rem' } }}
        >
          {tenant.tagline} • पारिवारिक डायरेक्टरी, वैवाहिक प्रकोष्ठ, रक्तदान सहायता एवं समाज चौपाल।
        </Typography>

        {/* Navigation Tabs */}
        <Box sx={{ bgcolor: 'rgba(255,255,255,0.06)', borderRadius: 3, p: 0.5, display: 'inline-block', maxWidth: '100%', overflowX: 'auto' }}>
          <Tabs
            value={activeTab}
            onChange={(e, val) => onTabChange(val)}
            textColor="inherit"
            indicatorColor="primary"
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': { color: '#cbd5e1', fontWeight: 600, minHeight: 44, borderRadius: 2 },
              '& .Mui-selected': { color: '#ffffff !important', bgcolor: `${tenant.primaryColor}55` },
              '& .MuiTabs-indicator': { bgcolor: tenant.primaryColor },
            }}
          >
            <Tab label="📢 समाचार व फीड (Social Feed)" />
            <Tab label="💬 समाज चौपाल व चैट (Chat)" />
            <Tab label="👥 सदस्य डायरेक्टरी (Directory)" />
            <Tab label="💍 वैवाहिक रिश्ते (Matrimonial)" />
            <Tab label="🩸 रक्तदान केंद्र (Blood SOS)" />
            <Tab label="📅 आगामी कार्यक्रम (Events)" />
          </Tabs>
        </Box>
      </Container>
    </Box>
  );
}
