import React from 'react';
import { Card, CardMedia, CardContent, Box, Typography, Chip, Button } from '@mui/material';

export default function MatrimonialCard({ profile, isInterestSent, onExpressInterest }) {
  return (
    <Card sx={{ borderRadius: 3, overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
      <CardMedia component="img" height="260" image={profile.photo} alt={profile.name} sx={{ objectFit: 'cover' }} />
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            {profile.name}
          </Typography>
          <Chip label={`गोत्र: ${profile.gotra}`} size="small" sx={{ bgcolor: '#ffedd5', color: '#ea580c', fontWeight: 700 }} />
        </Box>
        <Typography variant="body2" sx={{ color: '#475569', mb: 0.5 }}>
          आयु: {profile.age} वर्ष • कद: {profile.height}
        </Typography>
        <Typography variant="body2" sx={{ color: '#475569', mb: 0.5 }}>
          शिक्षा: {profile.education}
        </Typography>
        <Typography variant="body2" sx={{ color: '#475569', mb: 2 }}>
          कार्यक्षेत्र: {profile.occupation} ({profile.city})
        </Typography>
        <Button
          fullWidth
          variant={isInterestSent ? 'outlined' : 'contained'}
          color={isInterestSent ? 'success' : 'primary'}
          onClick={() => onExpressInterest(profile.id)}
          disabled={isInterestSent}
          sx={{ py: 1, fontWeight: 700 }}
        >
          {isInterestSent ? 'प्रस्ताव भेजा गया ✓' : 'रिश्ता प्रस्ताव भेजें (Express Interest)'}
        </Button>
      </CardContent>
    </Card>
  );
}
