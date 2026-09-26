import React from 'react';
import { Box, Container, Typography, Chip, Tabs, Tab } from '@mui/material';

export default function HeroBanner({ activeTab, onTabChange }) {
  return (
    <Box sx={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', color: '#fff', py: 3.5, px: 2 }}>
      <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
        <Chip label="अखिल भारतीय समाज कल्याण मंच" color="warning" size="small" sx={{ mb: 1.5, fontWeight: 700 }} />
        <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, fontSize: { xs: '1.7rem', md: '2.4rem' } }}>
          समस्त स्वजातीय बंधुओं का डिजिटल मंच
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: '#cbd5e1', maxWidth: 700, mx: 'auto', mb: 2.5, fontSize: { xs: '0.9rem', md: '1rem' } }}
        >
          पारिवारिक डायरेक्टरी, विवाह संबंध (Rishtey), रक्तदान सहायता, सामाजिक आयोजन व समाज समाचार की एकीकृत सुविधा।
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
              '& .Mui-selected': { color: '#ffffff !important', bgcolor: 'rgba(234, 88, 12, 0.3)' },
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
