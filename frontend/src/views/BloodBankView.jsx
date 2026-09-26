import React from 'react';
import { Box, Typography, Grid, Alert } from '@mui/material';
import DonorCard from '../components/bloodBank/DonorCard';

export default function BloodBankView({ donors = [] }) {
  return (
    <Box>
      <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
        <strong>इमरजेंसी रक्तदान हेल्पलाइन:</strong> यदि किसी स्वजन को अस्पताल में रक्त की अतिशीघ्र आवश्यकता है, तो नीचे दिए गए स्वैच्छिक रक्तदाताओं से तुरंत संपर्क करें।
      </Alert>
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>
        उपलब्ध रक्तदाता सूची (Blood Donors)
      </Typography>
      <Grid container spacing={2}>
        {donors.map((donor) => (
          <Grid item xs={12} sm={6} md={4} key={donor.id}>
            <DonorCard donor={donor} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
