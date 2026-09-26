import React, { useState } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import MatrimonialCard from '../components/matrimonial/MatrimonialCard';

export default function MatrimonialView({ profiles = [], onNotification }) {
  const [interestsSent, setInterestsSent] = useState({});

  const handleExpressInterest = (id) => {
    setInterestsSent((prev) => ({ ...prev, [id]: true }));
    if (onNotification) {
      onNotification('रिश्ते के लिए आपका प्रस्ताव (Interest) सफलतापूर्वक भेज दिया गया है! 💌');
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
          विवाह संबंध मंच (Matrimonial Rishtey)
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748b' }}>
          समाज के सुयोग्य युवक-युवतियों के बायोडाटा व पारिवारिक विवरण
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {profiles.map((profile) => (
          <Grid item xs={12} sm={6} md={4} key={profile.id}>
            <MatrimonialCard
              profile={profile}
              isInterestSent={Boolean(interestsSent[profile.id])}
              onExpressInterest={handleExpressInterest}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
