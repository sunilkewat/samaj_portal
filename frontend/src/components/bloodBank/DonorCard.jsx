import React from 'react';
import { Card, Box, Typography, Button, Avatar } from '@mui/material';
import { Phone as PhoneIcon } from '@mui/icons-material';

export default function DonorCard({ donor }) {
  return (
    <Card
      sx={{
        p: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderLeft: '5px solid #ef4444',
        borderRadius: 2.5,
        boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
      }}
    >
      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          {donor.name}
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748b' }}>
          {donor.city} • तैयार रक्तदाता
        </Typography>
        <Button
          size="small"
          variant="text"
          color="error"
          startIcon={<PhoneIcon />}
          href={`tel:${donor.phone}`}
          sx={{ mt: 1, p: 0 }}
        >
          {donor.phone}
        </Button>
      </Box>
      <Avatar sx={{ bgcolor: '#fee2e2', color: '#b91c1c', width: 50, height: 50, fontWeight: 800 }}>
        {donor.bloodGroup}
      </Avatar>
    </Card>
  );
}
